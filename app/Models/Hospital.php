<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hospital extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'hospital_name',
        'hospital_number',
        'area_id'
    ];

    protected static function booted()
    {
        static::deleting(function ($hospital) {
            if ($hospital->isForceDeleting()) {
                $hospital->invoices()->withTrashed()->get()->each(function ($invoice) {
                    $invoice->history()->withTrashed()->forceDelete();
                    $invoice->forceDelete();
                });
            } else {
                $hospital->invoices()->get()->each(function ($invoice) {
                    $invoice->history()->delete();
                    $invoice->delete();
                });
            }
        });

        static::restoring(function ($hospital) {
            $hospital->invoices()->withTrashed()->get()->each(function ($invoice) {
                $invoice->restore();
                $invoice->history->withTrashed()->restore();
            });
        });
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}
