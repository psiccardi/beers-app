<?php

namespace App\Classes;

use Illuminate\Support\Str;
use Illuminate\Http\Request;

class AuthHandler
{
    public static function revokeToken(Request $request)
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

    public static function logoutWeb(Request $request)
    {
        try {
            // $user = $request->user();
            auth('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            setcookie('auth_token', '', -1);
            setcookie(strtolower(str_replace(' ', '_', env('APP_NAME'))) . '_session', '', -1);
        } catch (\Exception $e) {
            ErrorHandler::logError(__METHOD__, $e);
            return false;
        }
    }
}
