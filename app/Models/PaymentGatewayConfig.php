<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Throwable;

class PaymentGatewayConfig extends Model
{
    protected $fillable = [
        'gateway',
        'name',
        'config',
        'is_active',
        'is_test_mode',
        'supported_currencies',
        'fee_percentage',
        'fee_fixed',
        'sort_order',
        'icon_url',
    ];

    protected $casts = [
        'config' => 'encrypted:array',
        'is_active' => 'boolean',
        'is_test_mode' => 'boolean',
        'supported_currencies' => 'array',
        'fee_percentage' => 'decimal:2',
        'fee_fixed' => 'decimal:2',
    ];

    /**
     * @return array<string, mixed>
     */
    public static function credentials(string $gateway): array
    {
        try {
            $row = static::query()->where('gateway', $gateway)->first();

            return is_array($row?->config) ? $row->config : [];
        } catch (Throwable) {
            return [];
        }
    }

    /**
     * @param  array<string, mixed>  $config
     */
    public static function put(string $gateway, string $name, array $config, bool $active = true): self
    {
        $existing = static::credentials($gateway);
        $merged = $existing;

        foreach ($config as $key => $value) {
            if ($value === null || $value === '••••••••') {
                continue;
            }

            $merged[$key] = $value;
        }

        $hasKeys = ! empty($merged['public']) && ! empty($merged['secret']);

        return static::query()->updateOrCreate(
            ['gateway' => $gateway],
            [
                'name' => $name,
                'config' => $merged,
                'is_active' => $active && $hasKeys,
            ]
        );
    }
}
