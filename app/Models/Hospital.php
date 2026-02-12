<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{

    protected $fillable = [
        'hospital_name',
        'hospital_number',
        'area_id'
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}
