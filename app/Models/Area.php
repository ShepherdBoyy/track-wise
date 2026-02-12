<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    protected $fillable = ["area_name"];

    public function hospitals()
    {
        return $this->hasMany(Hospital::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
