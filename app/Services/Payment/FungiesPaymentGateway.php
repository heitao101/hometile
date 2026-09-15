<?php

namespace App\Services\Payment;

use App\Models\PaymentGatewayConfig;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FungiesPaymentGateway implements PaymentGatewayInterface
{
    protected string $publicKey;
    protected string $secretKey;
    protected string $webhookSecret;
    protected string $productId;
    protected string $storeUrl;
    protected float $feePercentage;
    protected float $feeFixed;

    public function __construct()
    {
        $stored = PaymentGatewayConfig::credentials('fungies');

        $this->publicKey = $stored['public'] ?? config('services.fungies.public') ?? '';
        $this->secretKey = $stored['secret'] ?? config('services.fungies.secret') ?? '';
        $this->webhookSecret = $stored['webhook_secret'] ?? config('services.fungies.webhook_secret') ?? '';
        $this->productId = $stored['product_id'] ?? config('services.fungies.product_id') ?? '';
        $this->storeUrl = rtrim($stored['store_url'] ?? config('services.fungies.store_url') ?? '', '/');
        $this->feePercentage = (float) (config('services.fungies.fee_percentage', 2.9));
        $this->feeFixed = (float) (config('services.fungies.fee_fixed', 0.30));

        if ($this->publicKey === '' || $this->secretKey === '') {
            throw new \Exception('Fungies is not configured. Add your pub_ and sec_ keys in System Configuration.');
        }

        if ($this->productId === '' || $this->storeUrl === '') {
            throw new \Exception('Fungies product ID and store URL are required. Create a Credit Top-up product in Fungies, then paste those values in System Configuration.');
        }
    }

    public function createCheckoutSession(float $amount, string $currency, array $metadata = []): array
    {
        $transactionId = (string) ($metadata['transaction_id'] ?? '');
        $offerName = $transactionId !== ''
            ? 'Credit top-up #'.$transactionId
            : 'Credit top-up';

        $offer = $this->request('POST', '/offers/create', [
            'productId' => $this->productId,
            'name' => $offerName,
            'currency' => strtoupper($currency),
            'price' => round($amount, 2),
            'limit' => 1,
            'externalId' => $transactionId !== '' ? 'txn_'.$transactionId : null,
        ]);

        $offerId = data_get($offer, 'data.offer.id');
        if (! $offerId) {
            throw new \Exception('Fungies did not return an offer ID.');
        }

        $checkout = $this->request('POST', '/elements/checkout/create', [
            'name' => $offerName,
            'offersIds' => [$offerId],
        ]);

        $checkoutId = data_get($checkout, 'data.checkoutElement.id');
        if (! $checkoutId) {
            throw new \Exception('Fungies did not return a checkout element ID.');
        }

        return [
            'session_id' => $checkoutId,
            'checkout_url' => $this->storeUrl.'/checkout-element/'.$checkoutId,
            'payment_id' => $transactionId !== '' ? 'txn_'.$transactionId : $offerId,
            'offer_id' => $offerId,
        ];
    }

    public function handleWebhook(string $payload, string $signature): array
    {
        $this->verifySignature($payload, $signature);

        $event = json_decode($payload, true);
        if (! is_array($event)) {
            throw new \Exception('Invalid Fungies webhook payload.');
        }

        $type = $event['type'] ?? 'unknown';
        $data = $event['data'] ?? [];
        $mapped = match ($type) {
            'payment_success' => 'payment.success',
            'payment_failed', 'payment_failure' => 'payment.failed',
            'refund_success', 'order_refunded' => 'refund.completed',
            default => 'unknown',
        };

        if ($mapped === 'unknown') {
            throw new \Exception('Unhandled Fungies webhook event type: '.$type);
        }

        $orderId = data_get($data, 'order.id') ?: data_get($data, 'payment.id');
        $transactionId = $this->extractTransactionId($data);
        $amount = data_get($data, 'payment.amount')
            ?? data_get($data, 'order.amount')
            ?? data_get($data, 'items.0.price')
            ?? 0;

        return [
            'event_type' => $mapped,
            'payment_id' => $transactionId !== null ? 'txn_'.$transactionId : (string) $orderId,
            'amount' => is_numeric($amount) && (float) $amount >= 100 ? ((float) $amount) / 100 : (float) $amount,
            'currency' => strtoupper((string) (data_get($data, 'payment.currency') ?? data_get($data, 'order.currency') ?? 'USD')),
            'status' => $mapped === 'payment.success' ? 'completed' : ($mapped === 'payment.failed' ? 'failed' : 'refunded'),
            'metadata' => [
                'transaction_id' => $transactionId,
                'order_id' => data_get($data, 'order.id'),
                'payment_id' => data_get($data, 'payment.id'),
                'idempotency_key' => $event['idempotencyKey'] ?? $event['id'] ?? null,
            ],
            'customer_email' => data_get($data, 'user.email') ?: data_get($data, 'customer.email'),
        ];
    }

    public function refund(string $transactionId, ?float $amount = null): array
    {
        $body = [];
        if ($amount !== null) {
            $body['amount'] = round($amount, 2);
        }

        $response = $this->request('PATCH', '/orders/'.$transactionId.'/refund', $body);

        return [
            'refund_id' => (string) (data_get($response, 'data.refund.id') ?? data_get($response, 'data.order.id') ?? $transactionId),
            'amount' => (float) (data_get($response, 'data.refund.amount') ?? $amount ?? 0),
            'status' => 'completed',
        ];
    }

    public function getTransactionDetails(string $transactionId): array
    {
        $response = $this->request('GET', '/orders/'.$transactionId);
        $order = data_get($response, 'data.order', []);

        return [
            'id' => (string) ($order['id'] ?? $transactionId),
            'amount' => (float) ($order['amount'] ?? 0),
            'currency' => strtoupper((string) ($order['currency'] ?? 'USD')),
            'status' => (string) ($order['status'] ?? 'unknown'),
            'created_at' => (string) ($order['createdAt'] ?? now()->toDateTimeString()),
            'metadata' => $order,
        ];
    }

    public function getSupportedCurrencies(): array
    {
        return ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    }

    public function getGatewayName(): string
    {
        return 'fungies';
    }

    public function isTestMode(): bool
    {
        return false;
    }

    public function calculateFees(float $amount, string $currency): array
    {
        $percentageFee = ($amount * $this->feePercentage) / 100;
        $totalFee = $percentageFee + $this->feeFixed;

        return [
            'percentage_fee' => round($percentageFee, 2),
            'fixed_fee' => $this->feeFixed,
            'total_fee' => round($totalFee, 2),
            'amount_after_fees' => round($amount - $totalFee, 2),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    protected function extractTransactionId(array $data): ?int
    {
        $candidates = [
            data_get($data, 'customFields.transaction_id'),
            data_get($data, 'order.customFields.transaction_id'),
            data_get($data, 'items.0.customFields.transaction_id'),
            data_get($data, 'items.0.offer.externalId'),
            data_get($data, 'items.0.externalId'),
            data_get($data, 'order.externalId'),
        ];

        foreach ($candidates as $candidate) {
            if (is_array($candidate)) {
                $candidate = $candidate['value'] ?? $candidate['transaction_id'] ?? null;
            }

            if (is_string($candidate) && preg_match('/(?:txn_)?(\d+)/', $candidate, $matches)) {
                return (int) $matches[1];
            }

            if (is_numeric($candidate)) {
                return (int) $candidate;
            }
        }

        $fields = data_get($data, 'customFields', data_get($data, 'order.customFields', []));
        if (is_array($fields)) {
            foreach ($fields as $field) {
                $name = is_array($field) ? ($field['name'] ?? '') : '';
                $value = is_array($field) ? ($field['value'] ?? '') : '';
                if ($name === 'transaction_id' && is_numeric($value)) {
                    return (int) $value;
                }
            }
        }

        return null;
    }

    protected function verifySignature(string $payload, string $signature): void
    {
        if ($this->webhookSecret === '') {
            Log::warning('Fungies webhook secret is empty; skipping signature verification.');

            return;
        }

        $signature = trim($signature);
        $expected = 'sha256_'.hash_hmac('sha256', $payload, $this->webhookSecret);

        if ($signature === '' || ! hash_equals($expected, $signature)) {
            throw new \Exception('Invalid Fungies webhook signature.');
        }
    }

    /**
     * @param  array<string, mixed>  $body
     * @return array<string, mixed>
     */
    protected function request(string $method, string $path, array $body = []): array
    {
        $request = Http::timeout(30)
            ->acceptJson()
            ->withHeaders([
                'x-fngs-public-key' => $this->publicKey,
                'x-fngs-secret-key' => $this->secretKey,
            ]);

        $url = 'https://api.fungies.io/v0'.(str_starts_with($path, '/') ? $path : '/'.$path);

        $response = strtoupper($method) === 'GET'
            ? $request->get($url)
            : $request->send($method, $url, ['json' => array_filter($body, fn ($value) => $value !== null)]);

        if (! $response->successful()) {
            $message = data_get($response->json(), 'error.message')
                ?? data_get($response->json(), 'message')
                ?? $response->body();

            throw new \Exception('Fungies API error: '.$message);
        }

        $json = $response->json();

        return is_array($json) ? $json : [];
    }
}
