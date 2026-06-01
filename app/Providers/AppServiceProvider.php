<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Pail\PailServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // laravel/pail est en require-dev ; en prod (FTP + composer --no-dev) il n'est pas présent.
        // On désactive son auto-discovery (composer.json dont-discover) et on l'enregistre seulement en local.
        if ($this->app->environment('local') && class_exists(PailServiceProvider::class)) {
            $this->app->register(PailServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('auth-forms', function (Request $request) {
            return Limit::perMinute(8)->by($request->ip().'|'.$request->path());
        });
    }
}
