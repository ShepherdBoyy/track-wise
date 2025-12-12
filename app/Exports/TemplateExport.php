<?php

namespace App\Exports;

use App\Models\Invoice;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TemplateExport implements FromArray, WithHeadings, ShouldAutoSize
{
    public function headings(): array
    {
        return [
            "Customer No.",
            "Area",
            "Customer Name",
            "Invoice No.",
            "Document Date",
            "Due Date",
            "Days Overdue",
            "Amount"
        ];
    }

    public function array(): array
    {
        return [];
    }
}
