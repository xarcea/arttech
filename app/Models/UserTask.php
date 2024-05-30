<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTask extends Model
{
    use HasFactory;
    protected $table = 'user_tasks';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['task_id', 'assigned_by', 'assigned_to'];
}
