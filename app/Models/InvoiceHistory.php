<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceHistory extends Model
{
    protected $fillable = [
        "invoice_id",
        "updated_by",
        "remarks",
        'status',
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
