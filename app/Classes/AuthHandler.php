<?php

namespace App\Classes;

use Carbon\Carbon;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class AuthHandler
{
    /**
     * Deletes expired token provided by Bearer Authentication header
     * when user's authentication fails due to token expiration
     *
     * @param string|null $token: the full bearer token
     *
     * @return bool true if succeded, false on failure
     */
    public static function deleteExpiredToken(string|null $token = null)
    {
        $tokenDB = PersonalAccessToken::findToken($token);
        if ($tokenDB) {
            $tokenDB->delete();
            return true;
        }
        return false;
    }

    /**
     * Revokes the token passed in the Bearer Authentication header
     * or in 'auth_token' cookie
     *
     * @param Request $request
     *
     * @return bool true on success, false on failure
     */
    public static function revokeToken(Request $request): bool
    {
        try {
            $tokenId = null;
            if (!empty($request->bearerToken())) {
                $tokenId = Str::before($request->bearerToken(), '|');
            } else {
                $tokenId = Str::before($_COOKIE['auth_token'] ?? '', '|');
            }

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
            return $user->createToken(
                Str::random(8),
                ['*'],
                Carbon::now()->addMinutes(config('sanctum.expiration'))
            )->plainTextToken;
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
