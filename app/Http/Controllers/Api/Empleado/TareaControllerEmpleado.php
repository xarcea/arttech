<?php

namespace App\Http\Controllers\Api\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TareaControllerEmpleado extends Controller
{
    public function index($id) {
        $user = User::find($id);
        if(!$user) {
            return response()->json(['message' => 'User not found', 'success' => false], 404);
        }
        $tasks = Task::whereHas('assignedUsers', function ($query) use ($id) {
            $query->where('assigned_to', $id);
        })->get();

        return response()->json($tasks);
    }

    public function update(Request $request, $id) {
        $task = Task::find($id);
        if(!$task) {
            return response()->json(['message' => 'Task not found', 'success' => false], 404);
        }

        $validator = Validator::make($request->all(), [
            'completed' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors(), 'success' => false], 400);
        }

        $task->update($request->all());

        return response()->json(['message' => 'Task updated successfully', 'success' => true], 200);
    }
}
