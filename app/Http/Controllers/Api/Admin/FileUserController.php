<?php

namespace App\Http\Controllers\Api\Admin;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\File;

class FileUserController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'file' => 'required|file|max:2048',
        ]);

        $user = User::findOrFail($request->input('user_id'));

        if ($request->hasFile('file')) {
            $uploadedFile = $request->file('file');
            $filename = time() . '_' . $uploadedFile->getClientOriginalName();
            $uploadedFile->storeAs('public/assets/imgs/avatar', $filename);

            $file = new File([
                'filename' => $filename,
                'path' => 'storage/assets/imgs/avatar/' . $filename
            ]);

            if ($user->file) {
                Storage::delete('public/assets/imgs/avatar/' . $user->file->filename);
                $user->file->delete();
            }

            $user->file()->save($file);

            return response()->json([
                'message' => 'Archivo subido y asociado con éxito',
                'file' => $file,
                'success' => true
            ], 201);
        }

        return response()->json(['message' => 'Error al subir el archivo'], 500);
    }
}
