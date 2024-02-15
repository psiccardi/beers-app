<?php
namespace App\Classes;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class ErrorHandler {
    public static function logError(string $method, \Exception $e): void
    {
        Log::info($method);
        Log::info($e->getMessage());
        Log::info($e->getTraceAsString());
    }

    public static function handleApiInternalServerError(string $method, \Exception $e): JsonResponse
    {
        self::logError($method, $e);
        return response()->json([
            "error" => __("errors.generic_error")
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public static function handleApiBadRequestError(string $method, string $error): JsonResponse
    {
        Log::info($method);
        Log::info("Bad request");
        return response()->json(["error" => $error], Response::HTTP_BAD_REQUEST);
    }

    public static function handleApiUnauthorizedError(string $method, string $error): JsonResponse
    {
        return self::handleApiError($method, "Unauthorized", $error, Response::HTTP_UNAUTHORIZED);
    }

    public static function handleApiNotFoundError(string $method, string $error): JsonResponse
    {
        return self::handleApiError($method, "Resource not found", $error, Response::HTTP_NOT_FOUND);
    }

    public static function handleApiError(string $method, string $logMessage, string $error, string|int $statusCode = 200)
    {
        Log::info($method);
        Log::info($logMessage);
        return response()->json(["error" => $error], $statusCode);
    }
}
