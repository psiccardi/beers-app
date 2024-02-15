<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Role;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminCheckAPI
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!empty($request->user())) {
            if ($request->user()->role_id == Role::ADMINISTRATOR) {
                return $next($request);
            }
        }
        return response()->json([
            "error" => __("errors.permission_denied")
        ], Response::HTTP_FORBIDDEN);
    }
}
