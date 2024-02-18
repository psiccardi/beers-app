<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware('redirectIfLogged')->get('/login', [HomeController::class, "getPage"])->name('login');

Route::middleware('locale')->group(function () {
    Route::get("/", function () {
        return redirect(route('login'));
    });
    Route::post("/login", [AuthController::class, "loginWeb"])->name('web.login');
});

Route::middleware(['locale', 'auth:sanctum'])->group(function () {
    Route::get("/logout", [AuthController::class, "logoutWeb"])->name('web.logout');
    Route::get("/beers", [HomeController::class, "getPage"])->name('beers');
});

Route::get("/{any}", [HomeController::class, "getPage"])->where("any", ".*");
