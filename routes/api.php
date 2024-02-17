<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BeersController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['customSanctumAuthentication', 'locale'])->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user();
        $user->loadAllData();
        return $user;
    });

    Route::get("/beers", [BeersController::class, "get"])->name('api.beers');
});

Route::middleware('locale')->group(function () {
    Route::post("/login", [AuthController::class, "login"]);
});
