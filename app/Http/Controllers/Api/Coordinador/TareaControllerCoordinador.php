<?php

namespace App\Http\Controllers\Api\Coordinador;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use App\Models\UserTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TareaControllerCoordinador extends Controller
{
    public function index($id) {
        $user = User::find($id);
        if(!$user) {
            return response()->json(['message' => 'User not found', 'success' => false], 404);
        }
        $assigned_by = $id;
        $tasks = Task::whereHas('assigningUsers', function($query) use ($assigned_by) {
            $query->where('assigned_by', $assigned_by);
        })->with(['assignedUsers' => function($query) {
            $query->select('users.employee_id', 'users.name', 'users.role');
        }])->get();

        return response()->json($tasks);
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'description' => 'required|string|max:255',
            'completed' => 'required|boolean',
            'assignment_date' => 'required|date',
            'due_date' => 'required|date',
            'assigned_by' => 'required|integer|exists:users,id',
            'assigned_to' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors(), 'success' => false], 400);
        }

        $task = Task::create([
            'description' => $request->description,
            'completed' => $request->completed,
            'assignment_date' => $request->assignment_date,
            'due_date' => $request->due_date,
        ]);

        UserTask::create([
            'task_id' => $task->id,
            'assigned_by' => $request->assigned_by,
            'assigned_to' => $request->assigned_to,
        ]);

        return response()->json(['message' => 'Task created successfully', 'success' => true], 201);
    }

    public function update(Request $request, $id) {
        $task = Task::find($id);
        if(!$task) {
            return response()->json(['message' => 'Task not found', 'success' => false], 404);
        }

        $validator = Validator::make($request->all(), [
            'due_date' => 'date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors(), 'success' => false], 400);
        }

        $task->update($request->all());

        return response()->json(['message' => 'Task updated successfully', 'success' => true], 200);
    }

    public function destroy($id) {
        $task = Task::find($id);
        if(!$task) {
            return response()->json(['message' => 'Task not found', 'success' => false], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully', 'success' => true], 200);
    }
}
