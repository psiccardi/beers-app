<?php

namespace App\Classes;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class AuthHandler
{
    /**
     * Revokes the token passed in the Bearer Authentication header
     *
     * @param Request $request
     *
     * @return bool true on success, false on failure
     */
    public static function revokeToken(Request $request): bool
    {
        try {
            $tokenId = Str::before($request->bearerToken(), '|');
            $request->user()->tokens()->where('id', $tokenId)->delete();
            return true;
        } catch (\Exception $e) {
            ErrorHandler::logError(__METHOD__, $e);
            return false;
        }
    }

    /**
     * Generates a token for a user
     *
     * @param Authenticatable $user
     *
     * @return string|null
     */
    public static function createToken(Authenticatable $user): string|null
    {
        try {
            return $user->createToken(Str::random(8))->plainTextToken;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Performs the logout using 'web' guard
     *
     * @param Request $request
     *
     * @return bool true on success, false on failure
     */
    public static function logoutWeb(Request $request): bool
    {
        try {
            // $user = $request->user();
            auth('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            setcookie('auth_token', '', -1);
            setcookie(strtolower(str_replace(' ', '_', env('APP_NAME'))) . '_session', '', -1);

            return true;
        } catch (\Exception $e) {
            ErrorHandler::logError(__METHOD__, $e);
            return false;
        }
    }
}
