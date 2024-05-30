<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;
    protected $table = 'activities';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['name', 'description', 'binnacle_id'];

    public function binnacle() {
        return $this->belongsTo(Binnacle::class);
    }
}
