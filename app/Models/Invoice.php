<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'hospital_id',
        'invoice_number',
        'amount',
        'status',
        'transaction_date',
        'date_closed',
        'processing_days',
        'created_by',
        'updated_by',
    ];

    public function customer()
    {
        return $this->belongsTo(Hospital::class, 'hospital_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
