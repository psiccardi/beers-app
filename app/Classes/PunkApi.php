<?php

namespace App\Classes;

use Illuminate\Support\Facades\Http;

class PunkApi
{
    /**
     * Punk API base url
     */
    const BASE_URL='https://api.punkapi.com/';
    /**
     * Punk API version
     */
    const VERSION='v2';

    /**
     * Method that retrieves API base url
     *
     * @return string
     */
    protected static function getBaseUrl(): string
    {
        return self::BASE_URL . self::VERSION;
    }

    /**
     * Get beers API
     *
     * @param array the associative array of the request.
     *              Should contain the keys 'page' and 'per_page' to work.
     *
     * @return array|null
     */
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
