<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Session\Session;
use Illuminate\Http\Request;

class Locale
{
   # const LOCALES = ['it', 'en'];

    public static function getSupportedLanguages()
    {
        $langs = [];
        $folders = glob(base_path() . "/lang/*");
        return array_map(function ($el) {
            return basename($el);
        }, $folders);
    }

    public function handle(Request $request, Closure $next)
    {
        $locales = self::getSupportedLanguages();
        $lang = $request->getPreferredLanguage($locales);

        if ($request->has('lang')) {
            $lang = $request->get('lang');
        }

        app()->setLocale($lang);

        return $next($request);
    }
}
