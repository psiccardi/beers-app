<?php

namespace App\Http\Controllers;

use App\Classes\ErrorHandler;
use App\Classes\PunkApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BeersController extends Controller
{
    //
    public function get(Request $request)
    {
        $validateData = Validator::make($request->all(), [
            "page" => "required|integer",
            "limit" => "required|integer"
        ]);

        if ($validateData->fails()) {
            return ErrorHandler::handleApiBadRequestError(__METHOD__, $validateData->errors()->first());
        }

        try {
            $beers = PunkApi::getBeers([
                "page" => $request->page + 1,
                "per_page" => $request->limit
            ]);
            if (empty($beers)) {
                return response()->json([]);
            }

            if (!empty($beers["error"])) {
                $statusCode = $beers["statusCode"] ?? 500;
                $msg = $beers["message"] ?? "Internal server error";
                return response()->json(['error' => $msg], $statusCode);
            }

            return response()->json($beers);
        } catch (\Exception $e) {
            return ErrorHandler::handleApiInternalServerError(__METHOD__, $e);
        }
    }
}
