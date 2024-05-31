<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index() {
        $data = User::whereDoesntHave('roles', function($query) {
            $query->where('name', 'admin');
        })->get();
        return response()->json($data, 200);
    }

    public function show($id) {
        $data = User::find($id);
        if ($data) {
            return response()->json($data, 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function update(Request $request, $id) {
        $data = User::find($id);
    
        if (!$data) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        if (!$request->has('name') 
            && !$request->has('email') 
            && !$request->has('employee_id') 
            && !$request->has('role')
            && !$request->has('rol')
            ) {
            return response()->json(['message' => 'No fields to update provided'], 422);
        }
    
        try {
            $this->validate($request, [
                'name' => 'sometimes|required|string',
                'email' => 'sometimes|required|email',
                'employee_id' => 'sometimes|required|string',
                'role' => 'sometimes|required|string',
                'rol' => 'sometimes|required|string|exists:roles,name'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    
        $data->fill($request->only(['name', 'email', 'employee_id', 'role']));
        if ($request->has('rol')) {
            $role = Role::where('name', $request->input('rol'))->first();
    
            if ($role) {
                $data->syncRoles([$role]);
            } else {
                return response()->json(['message' => 'Role not found'], 404);
            }
        }
        $data->save();
        return response()->json($data, 200);
    }    

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string',
            'employee_id' => 'required|string',
            'role' => 'required|string',
            'rol' => 'required|string|exists:roles,name'
        ]);

        if ($validator->fails()) {
            $response = ['error' => $validator->errors()];
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
            'user' => $user
        ], 200);
    }

    public function destroy($id) {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        if ($user->hasRole('admin')) {
            return response()->json(['message' => 'Cannot delete user with admin role'], 403);
        }
        $user->roles()->detach();    
        $user->delete();
        return response()->json(['message' => 'User deleted'], 200);
    }
}
