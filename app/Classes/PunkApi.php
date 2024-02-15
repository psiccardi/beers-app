<?php

namespace App\Classes;

use Illuminate\Support\Facades\Http;

class PunkApi
{
    const BASE_URL='https://api.punkapi.com/';
    const VERSION='v2';

    protected static function getBaseUrl(): string
    {
        return self::BASE_URL . self::VERSION;
    }

    public static function getBeers(array $params = []): array|null
    {
        try {
            $response = Http::get(self::getBaseUrl() . "/beers", $params);
            return json_decode($response->body(), true);
        } catch (\Exception $e) {
            ErrorHandler::logError(__METHOD__, $e);
            return null;
        }
    }
}
