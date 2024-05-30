<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request) { //TODO: Hacer pruebas en Thunder Client (rol)
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            $response = ['error' => $validator->errors()];
            return response()->json($response, 400);
        }

        if (auth()->attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = auth()->user();
            if ($user instanceof \App\Models\User) {
                $response['token'] = $user->createToken('authToken')->plainTextToken;
                $response['user'] = $user;
                $response['role'] = $user->roles->pluck('name');
                $response['success'] = true;
            }
        } else {
            $response['message'] = 'Credenciales incorrectas';
            return response()->json($response, 401);
        }
        return response()->json($response, 200);
    }

    public function logout() {
        $response = ['success' => false];
        $user = auth()->user();
        if ($user instanceof \App\Models\User) {
            $user->tokens()->delete();
        }
        $response = ['success' => true, 'message' => 'Sesión cerrada'];
        return response()->json($response, 200);
    }
}
