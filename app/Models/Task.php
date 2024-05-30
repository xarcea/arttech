<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $table = 'tasks';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['description', 'completed', 'assignment_date', 'due_date'];

    public function assignedUsers() {
        return $this->belongsToMany(User::class, 'user_task', 'task_id', 'assigned_to')
            ->withPivot('assigned_by');
    }

    public function assigningUsers() {
        return $this->belongsToMany(User::class, 'user_task', 'task_id', 'assigned_by')
            ->withPivot('assigned_to');
    }
}
