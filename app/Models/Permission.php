<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = [
        "name",
        "display_name",
        "category"
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, "user_permissions");
    }
}
