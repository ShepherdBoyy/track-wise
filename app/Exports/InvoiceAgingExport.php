<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class InvoiceAgingExport implements WithMultipleSheets
{
    public function __construct(
        private array $data,
        private array $bucketLabels
    ) {}

    public function sheets(): array
    {
        return [
            new InvoiceAgingSummarySheet($this->data, $this->bucketLabels),
            new InvoiceAgingInvoicesSheet($this->data, $this->bucketLabels),
        ];
    }
}