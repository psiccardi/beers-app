<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Session\Session;
use Illuminate\Http\Request;

class Locale
{
    /**
     * This method returns the supported languages, retrieving automatically
     * the folder names inside the 'lang' folder
     *
     * @return array
     */
    public static function getSupportedLanguages(): array
    {
        $folders = glob(base_path() . "/lang/*");
        return array_map(function ($el) {
            return basename($el);
        }, $folders);
    }

    /**
     * This method sets the app language and then proceeds to next
     * middleware/route
     *
     */
    public function handle(Request $request, Closure $next)
    {
        $locales = self::getSupportedLanguages();
        $lang = $request->getPreferredLanguage($locales);

        if ($request->has('lang')) {
            $lang = $request->get('lang');
            if (!in_array($lang, $locales)) {
                $lang = 'en'; // default language is 'en'
            }
        }

        app()->setLocale($lang);

        return $next($request);
    }
}
