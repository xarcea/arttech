<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;
    protected $table = 'events';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['name', 'description', 'date', 'time', 'duration', 'attendees', 'observations', 'user_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function files() {
        return $this->morphMany(File::class, 'archivable');
    }
}
