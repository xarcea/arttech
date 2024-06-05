<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request) {
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
                $avatar = $user->file;
                $response = [
                    'token' => $user->createToken('authToken')->plainTextToken,
                    'user' => [
                        'email' => $user->email,
                        'employee_id' => $user->employee_id,
                        'id' => $user->id,
                        'name' => $user->name,
                        'role' => $user->role,
                        'avatar' => $avatar ? $avatar->path : null
                    ],
                    'role' => $user->roles->pluck('name'),
                    'success' => true
                ];
            }
        } else {
            $response['message'] = 'Credenciales incorrectas';
            $response['success'] = false;
            return response()->json($response, 401);
        }
        return response()->json($response, 200);
    }

    public function logout() {
        $user = auth()->user();
        if ($user instanceof \App\Models\User) {
            $user->tokens()->delete();
            $response = ['success' => true, 'message' => 'Sesión cerrada'];
        } else {
            return response()->json(['message' => 'Error'], 401);
        }
        return response()->json($response, 200);
    }
}
