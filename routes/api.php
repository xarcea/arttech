<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\FileUserController;
use App\Http\Controllers\Api\Coordinador\ActividadControllerCoordinador;
use App\Http\Controllers\Api\Coordinador\ArchivoControllerCoordinador;
use App\Http\Controllers\Api\Coordinador\BitacoraControllerCoordinador;
use App\Http\Controllers\Api\Coordinador\EventoControllerCoordinador;
use App\Http\Controllers\Api\Coordinador\TareaControllerCoordinador;
use App\Http\Controllers\Api\Empleado\ActividadControllerEmpleado;
use App\Http\Controllers\Api\Empleado\ArchivoControllerEmpleado;
use App\Http\Controllers\Api\Empleado\BitacoraControllerEmpleado;
use App\Http\Controllers\Api\Empleado\EventoControllerEmpleado;
use App\Http\Controllers\Api\Empleado\ItemController;
use App\Http\Controllers\Api\Empleado\TareaControllerEmpleado;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([], function () {
    //públicas
    Route::post('/login', [AuthController::class, 'login']);
    
    //privadas
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/update-password', [UserController::class, 'updatePassword']);
        
        //administrador
        Route::post('/empleado/archivo', [FileUserController::class, 'store']);
        Route::apiResource('/empleados', UserController::class);

        //empleados
        Route::get('/empleado/tareas/{id}', [TareaControllerEmpleado::class, 'index']);
        Route::put('/empleado/tareas/{id}', [TareaControllerEmpleado::class, 'update']);

        Route::apiResource('/empleado/items', ItemController::class);
        Route::apiResource('/empleado/bitacoras', BitacoraControllerEmpleado::class);
        Route::apiResource('/empleado/eventos', EventoControllerEmpleado::class);
        Route::apiResource('/empleado/actividades', ActividadControllerEmpleado::class);
        Route::apiResource('/empleado/archivos', ArchivoControllerEmpleado::class);

        //coordinadores
        Route::post('/coordinador/tareas', [TareaControllerCoordinador::class, 'store']);
        Route::get('/coordinador/tareas/{id}', [TareaControllerCoordinador::class, 'index']);
        Route::put('/coordinador/tareas/{id}', [TareaControllerCoordinador::class, 'update']);
        Route::delete('/coordinador/tareas/{id}', [TareaControllerCoordinador::class, 'destroy']);

        Route::apiResource('/coordinador/bitacoras', BitacoraControllerCoordinador::class);
        Route::apiResource('/coordinador/eventos', EventoControllerCoordinador::class);
        Route::apiResource('/coordinador/actividades', ActividadControllerCoordinador::class);
        Route::apiResource('/coordinador/archivos', ArchivoControllerCoordinador::class);
    });
});