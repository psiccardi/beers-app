<?php

namespace App\Http\Controllers;

use App\Classes\ErrorHandler;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function logoutWeb(Request $request)
    {
        $user = $request->user();
        $tokenId = Str::before(request()->bearerToken(), '|');
        auth()->user()->tokens()->where('id', $tokenId )->delete();
        auth('web')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        setcookie('auth_token', '', -1);
        setcookie(strtolower(str_replace(' ', '_', env('APP_NAME'))) . '_session', '', -1);
        // setCookie('auth_token','', -1);
        // setCookie(Utils.string.toUnderscoreSlug(APP_NAME) + '_session','', -1);
        return redirect(route('login'));
    }
    //
    public function login(Request $request)
    {
        $validateData = Validator::make($request->all(), [
            'email' => 'required|email:filter',
            'password' => 'required'
        ]);

        if ($validateData->fails()) {
            return ErrorHandler::handleApiBadRequestError(__METHOD__, $validateData->errors()->first());
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return ErrorHandler::handleApiUnauthorizedError(__METHOD__, __("errors.invalid_credentials"));
        }

        $token = auth()->user()->createToken(Str::random(8))->plainTextToken;

        return response()->json([
            'token' => $token
        ]);
    }

    public function loginWeb(Request $request)
    {
        $validateData = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required'
        ]);

        if ($validateData->fails()) {
            return ErrorHandler::handleApiBadRequestError(__METHOD__, $validateData->errors()->first());
        }

        if (!Auth::attempt([
            'username' => $request->username,
            'password' => $request->password
        ])) {
            return ErrorHandler::handleApiUnauthorizedError(__METHOD__, __("errors.invalid_credentials"));
        }

        $token = auth()->user()->createToken(Str::random(8))->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => auth()->user()
        ]);
    }
}
