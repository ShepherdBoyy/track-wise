<?php

namespace App\Models;

use Carbon\Carbon;
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
        $today = Carbon::today();
        $dueDate = Carbon::parse($this->due_date)->startOfDay();

        if (!empty($this->date_closed)) {
            return "closed";
        }

        return $today->greaterThan($dueDate)
            ? "overdue"
            : "open";
    }
}
