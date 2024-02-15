<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
	    //
	    self::setCorrectAppUrl();
	    \Illuminate\Support\Facades\URL::forceRootUrl(config('app.url'));
    }

    public static function setCorrectAppUrl()
    {
        // ConfigurationManager::loadCorrectAppUrl();
        if (isset($_SERVER['HTTP_HOST'])) {
            $host     = $_SERVER['HTTP_HOST'];
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443 ? "https://" : "http://";
            config(['app.url' => $protocol . $host]);
        }
        \Illuminate\Support\Facades\URL::forceRootUrl(config('app.url'));
    }
}
