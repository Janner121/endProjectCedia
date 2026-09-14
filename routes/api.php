<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PlantController;
use App\Http\Controllers\SpeciesController;
use App\Http\Controllers\WateringController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/species', [SpeciesController::class, 'index']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('plants', PlantController::class);

    Route::post('/plants/{plant}/waterings', [WateringController::class, 'store']);
    Route::delete('/waterings/{watering}', [WateringController::class, 'destroy']);
});
