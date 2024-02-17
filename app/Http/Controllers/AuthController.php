<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Classes\ErrorHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Web logout route
     * This method revokes the token sent in 'Bearer' authentication header,
     * invalidates session and destroys all cookies generated
     *
     * @param Request $request
     *
     * @return Redirector|RedirectResponse
     */
    public function logoutWeb(Request $request): Redirector|RedirectResponse
    {
        $user = $request->user();
        $tokenId = Str::before(request()->bearerToken(), '|');
        auth()->user()->tokens()->where('id', $tokenId )->delete();
        auth('web')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        setcookie('auth_token', '', -1);
        setcookie(strtolower(str_replace(' ', '_', env('APP_NAME'))) . '_session', '', -1);
        return redirect(route('login'));
    }

    /**
     * Api Login route
     * This method performs login and returns a JSON object
     * with the token and the current user
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function login(Request $request)
    {
        $validateData = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required'
        ]);

        if ($validateData->fails()) {
            return ErrorHandler::handleApiBadRequestError(__METHOD__, $validateData->errors()->first());
        }

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return ErrorHandler::handleApiUnauthorizedError(__METHOD__, __("errors.invalid_credentials"));
        }

        $token = $user->createToken(Str::random(8))->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    /**
     * Web Login route
     * This method is used to authenticate the user
     * both for api requests and web.
     * Returns a JSON Object with the token and the current user
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
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
