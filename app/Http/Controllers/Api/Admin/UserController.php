<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index() {
        $data = User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'admin');
        })->get(['id', 'name', 'email', 'employee_id', 'birthday', 'phone_number', 'role']);
    
        $data = $data->map(function($user) {
            $user->rol = $user->roles->first()->name ?? null;
            return $user;
        });
        return response()->json($data, 200);
    }

    public function show($id) {
        $user = User::find($id);
        if ($user) {
            $data = [
                'user' => [
                    'email' => $user->email,
                    'employee_id' => $user->employee_id,
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'avatar' => $user->file ? $user->file->path : null,
                    'birthday' => $user->birthday,
                    'phone_number' => $user->phone_number
                ],
                'success' => true
            ];
            return response()->json($data, 200);
        } else {
            return response()->json(['message' => 'User not found', 'success' => false], 404);
        }
    }

    public function update(Request $request, $id) {
        $data = User::find($id);

        if (!$data) {
            return response()->json(['message' => 'User not found', 'success' => false], 404);
        }

        if (
            !$request->has('name')
            && !$request->has('email')
            && !$request->has('employee_id')
            && !$request->has('role')
            && !$request->has('rol')
            && !$request->has('phone_number')
        ) {
            return response()->json(['message' => 'No fields to update provided', 'success' => false], 422);
        }

        try {
            $this->validate($request, [
                'name' => 'sometimes|required|string',
                'email' => 'sometimes|required|email',
                'employee_id' => 'sometimes|required|string',
                'role' => 'sometimes|required|string',
                'rol' => 'sometimes|required|string|exists:roles,name',
                'phone_number' => 'sometimes|required|string'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors(), 'success' => false], 422);
        }

        $data->fill($request->only(['name', 'email', 'employee_id', 'role', 'phone_number']));
        if ($request->has('rol')) {
            $role = Role::where('name', $request->input('rol'))->first();

            if ($role) {
                $data->syncRoles([$role]);
            } else {
                return response()->json(['message' => 'Role not found', 'success' => false], 404);
            }
        }
        $data->save();
        $response = [
            'message' => 'User updated',
            'success' => true,
            'user' => $data
        ];
        return response()->json($response, 200);
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string',
            'employee_id' => 'required|string',
            'role' => 'required|string',
            'rol' => 'required|string|exists:roles,name',
            'birthday' => 'required|date',
            'phone_number' => 'required|string'
        ]);

        if ($validator->fails()) {
            $response = ['error' => $validator->errors(), 'success' => false];
            return response()->json($response, 400);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);

        unset($input['rol']);
        $user = User::create($input);

        if ($user) {
            $user->assignRole($request->input('rol'));
            $response['success'] = true;
            $user->save();
        } else {
            $response['success'] = false;
            return response()->json($response, 500);
        }
        return response()->json([
            $request,
            'message' => 'Usuario creado exitosamente',
            'user' => $user,
            'success' => true
        ], 200);
    }

    public function destroy($id) {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found', 'success' => false], 404);
        }
        if ($user->hasRole('admin')) {
            return response()->json(['message' => 'Cannot delete user with admin role', 'success' => false], 403);
        }
        if ($user->file) {
            Storage::delete('public/assets/imgs/avatar/' . $user->file->filename);
            $user->file->delete();
        }
        $user->roles()->detach();
        $user->delete();
        return response()->json(['message' => 'User deleted', 'success' => true], 200);
    }

    public function updatePassword(Request $request) {
        $user_id = $request->input('user_id');
        $user = User::find($user_id);

        if (!$user) {
            return response()->json(
                [
                    'message' => 'User not found',
                    'success' => false
                ],
                404
            );
        }

        if (!$request->has('current_password') || !$request->has('new_password')) {
            return response()->json(
                [
                    'message' => 'Current password and new password are required',
                    'success' => false
                ],
                422
            );
        }

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string'
        ]);

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json(
                [
                    'message' => 'Data is incorrect',
                    'success' => false
                ],
                401
            );
        }

        $user->password = bcrypt($request->input('new_password'));
        $user->save();
        $response = [
            'message' => 'Password updated',
            'success' => true,
            'user' => $user
        ];
        return response()->json($response, 200);
    }
}
