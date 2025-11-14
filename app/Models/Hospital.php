<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
    use HasFactory;

    protected $fillable = [
        'hospital_name'
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
