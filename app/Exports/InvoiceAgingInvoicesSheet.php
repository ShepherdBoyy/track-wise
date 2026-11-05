<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class InvoiceAgingInvoicesSheet implements FromArray, WithHeadings, WithTitle, WithStyles, WithColumnFormatting, ShouldAutoSize
{
    private const PESO = '"₱"#,##0.00';
    private const DATE = 'm/d/yyyy';
    private array $rows = [];

    public function __construct(private array $data, private array $bucketLabels)
    {
        foreach ($data["hospitalBlocks"] as $block) {
            $hospital = $block["hospital"];

            foreach ($block["invoices"] as $invoice) {
                $this->rows[] = [
                    $hospital->area->area_name ?? "",
                    $hospital->hospital_number,
                    $hospital->hospital_name,
                    $invoice->invoice_number,
                    $this->excelDate($invoice->document_date),
                    $this->excelDate($invoice->due_date),
                    max(0, (int) $invoice->processing_days),
                    $this->bucketLabels[$invoice->aging_bucket],
                    (float) $invoice->amount,
                    $invoice->latestHistory?->remarks ?? ""
                ];
            }
        }
    }

    public function headings(): array
    {
        return [
            "Area",
            "Customer No",
            "Customer Name",
            "Invoice No",
            "Document Date",
            "Due Date",
            "Days Overdue",
            "Aging",
            "Amount",
            "Remarks"
        ];
    }

    public function array(): array
    {
        return $this->rows;
    }

    public function title(): string
    {
        return "Invoices";
    }

    public function columnFormats(): array
    {
        return [
            "E" => self::DATE,
            "F" => self::DATE,
            "I" => self::PESO
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $header = $sheet->getStyle("A1:J1");
        $header->getFont()->setBold(true)->getColor()->setRGB("FFFFFF");
        $header->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB("222222");
        $header->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->freezePane("A2");
        $sheet->setAutoFilter("A1:J1");

        $sheet->getColumnDimension("J")->setAutoSize(false)->setWidth(60);
        $sheet->getStyle("J2:J" . max(2, count($this->rows) + 1))
            ->getAlignment()->setWrapText(true)->setVertical(Alignment::VERTICAL_TOP);

        return [];
    }

    private function excelDate($value): ?float
    {
        return $value ? Date::dateTimeToExcel(Carbon::parse($value)->startOfDay()) : null;
    }
}