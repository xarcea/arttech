<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Binnacle extends Model
{
    use HasFactory;
    protected $table = 'binnacles';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['date', 'observations', 'user_id'];

    public function activities() {
        return $this->hasMany(Activity::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function files() {
        return $this->morphMany(File::class, 'archivable');
    }
}
