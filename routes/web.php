<?php

use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;

// $role = Role::create(['name' => 'admin']);
// $role = Role::create(['name' => 'coordinador']);
// $role = Role::create(['name' => 'empleado']);

Route::get('{any}', function () {
    return view('welcome');
})->where('any', '.*');
