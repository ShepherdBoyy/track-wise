<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'hospital_id',
        'invoice_number',
        'document_date',
        'due_date',
        'amount',
        'status',
        'date_closed',
        'created_by',
    ];

    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function history()
    {
        return $this->hasMany(InvoiceHistory::class);
    }
}
