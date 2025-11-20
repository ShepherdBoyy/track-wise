<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hospital extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'hospital_name'
    ];

    protected static function booted()
    {
        static::deleting(function ($hospital) {
            if ($hospital->isForceDeleting()) {
                $hospital->invoices->forceDelete();
            } else {
                $hospital->invoices()->delete();
            }
        });

        static::restoring(function ($hospital) {
            $hospital->invoices()->restore();
        });
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
