<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InvoiceHistory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        "invoice_id",
        "updated_by",
        "description"
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function updater()
    {
        return $this->belongsTo(User::class, "updated_by");
    }
}
