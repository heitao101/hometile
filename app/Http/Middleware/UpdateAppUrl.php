<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UpdateAppUrl
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $currentUrl = $request->getSchemeAndHttpHost();
        $configUrl = config('app.url');

        // Only update in-memory config. Never write .env on Railway — that file is
        // ephemeral, races with other requests, and is not the source of truth.
        if ($currentUrl !== $configUrl && !app()->environment('testing')) {
            config(['app.url' => $currentUrl]);
        }

        return $next($request);
    }
}
