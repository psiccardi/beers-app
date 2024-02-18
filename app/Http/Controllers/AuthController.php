<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use App\Classes\AuthHandler;
use Illuminate\Http\Request;
use App\Classes\ErrorHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Log;
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
        try {
            if (!AuthHandler::revokeToken($request)) {
                throw new \Exception(__("errors.token_not_revoked"));
            }
            if (!AuthHandler::logoutWeb($request)) {
                Log::info("AuthHandler::logoutWeb failure");
                throw new \Exception(__("errors.logout_error"));
            }
            return redirect(route('login'));
        } catch (\Exception $e) {
            ErrorHandler::logError(__METHOD__, $e);
            return redirect(route('login'));
        }
    }

    /**
     * Api logout route
     * This method revokes the token present in the Bearer Authorization header
     * And returns a JSONObject
     *
     * @param Request $request
     *
     * @return JsonResponse
     *
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            // auth()->user()->tokens()->where('id', $tokenId )->delete();
            if (AuthHandler::revokeToken($request)) {
                return response()->json([
                    "success" => true
                ]);
            } else {
                throw new \Exception(__("errors.token_not_revoked"));
            }
        } catch (\Exception $e) {
            return ErrorHandler::handleApiInternalServerError(__METHOD__, $e);
        }
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
    public function login(Request $request): JsonResponse
    {
        $validateData = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required'
        ]);

        if ($validateData->fails()) {
            return ErrorHandler::handleApiBadRequestError(__METHOD__, $validateData->errors()->first());
        }

        try {
            $user = User::where('username', $request->username)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return ErrorHandler::handleApiUnauthorizedError(__METHOD__, __("errors.invalid_credentials"));
            }

            $token = AuthHandler::createToken($user);

            if (empty($token)) {
                $e = new \Exception("Could not create token");
                return ErrorHandler::handleApiInternalServerError(__METHOD__, $e);
            }

            return response()->json([
                'token' => $token,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return ErrorHandler::handleApiInternalServerError(__METHOD__, $e);
        }
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

        try {
            if (!Auth::attempt([
                'username' => $request->username,
                'password' => $request->password
            ])) {
                return ErrorHandler::handleApiUnauthorizedError(__METHOD__, __("errors.invalid_credentials"));
            }

            $user = auth()->user();
            $token = AuthHandler::createToken($user);

            if (empty($token)) {
                throw new \Exception("Could not create token");
            }

            return response()->json([
                'token' => $token,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return ErrorHandler::handleApiInternalServerError(__METHOD__, $e);
        }
    }
}
