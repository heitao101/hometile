<?php

namespace App\Providers;

use App\Models\UserKycVerification;
use App\Policies\KycPolicy;
use App\Services\TwiMLService;
use App\Services\TwilioService;
use App\Services\WebhookHandlerService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        foreach ([
            storage_path('framework/cache/data'),
            storage_path('framework/sessions'),
            storage_path('framework/views'),
            storage_path('logs'),
            storage_path('app/public'),
        ] as $directory) {
            if (! is_dir($directory)) {
                mkdir($directory, 0775, true);
            }
        }

        // Register Twilio services as singletons
        $this->app->singleton(TwilioService::class, function ($app) {
            return new TwilioService();
        });

        $this->app->singleton(TwiMLService::class, function ($app) {
            return new TwiMLService();
        });

        $this->app->singleton(WebhookHandlerService::class, function ($app) {
            return new WebhookHandlerService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        
        // Register policies
        Gate::policy(UserKycVerification::class, KycPolicy::class);

        if ($this->shouldForceHttps()) {
            URL::forceScheme('https');
        }
    }

    protected function shouldForceHttps(): bool
    {
        if (app()->environment('local', 'testing')) {
            return false;
        }

        $appUrl = (string) config('app.url');

        return app()->environment('production') || str_starts_with($appUrl, 'https://');
    }
}
