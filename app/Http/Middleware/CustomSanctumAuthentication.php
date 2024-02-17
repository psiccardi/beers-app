<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controllers\Middleware;
use Symfony\Component\HttpFoundation\Response;

class CustomSanctumAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$guards): Response
    {
        if (
            (
                method_exists($this, 'authenticateViaRemember') && $this->authenticateViaRemember($request, $guards)
            ) || (
                method_exists($this, 'authenticateViaSanctum') && $this->authenticateViaSanctum($request, $guards)
            )
             ||
            $request->user()
        ) {
            return $next($request);
        }

        return response()->json([
            "error" => __("errors.permission_denied")
        ], Response::HTTP_FORBIDDEN);
    }

    public function authenticateViaSanctum($request, array $guards) {
        if (Auth::guard('sanctum')->check()) {
            return Auth::shouldUse('sanctum');
        }

        return false;
    }

    public function authenticateViaRemember($request, array $guards) {
        if (method_exists(Auth::class, 'viaRemember') && Auth::viaRemember()) {
            return Auth::shouldUse('sanctum');
        }

        return false;
    }
}
