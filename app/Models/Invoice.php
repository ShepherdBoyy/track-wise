<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'hospital_id',
        'invoice_number',
        'document_date',
        'due_date',
        'amount',
        'date_closed',
        'created_by',
    ];

    protected $appends = ['status'];

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
        return $this->hasMany(InvoiceHistory::class)
            ->orderBy("created_at", "desc");
    }

    public function latestHistory()
    {
        return $this->hasOne(InvoiceHistory::class)->latestOfMany();
    }

    public function getStatusAttribute()
    {
        if (!empty($this->date_closed)) {
            return "closed";
        }

        return now()->startOfDay()->greaterThan(Carbon::parse($this->due_date)->startOfDay())
            ? "overdue"
            : "open";
    }
}
