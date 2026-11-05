<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class InvoiceAgingSummarySheet implements FromArray, WithTitle, WithStyles, WithColumnFormatting, ShouldAutoSize
{
    private const LEADING_COLUMNS = 5;
    private const PESO = '"₱"#,##0.00';

    private array $rows = [];
    private int $headerRow = 0;
    private int $lastRow = 0;
    private int $lastColumnIndex = 0;

    public function __construct(private array $data, private array $bucketLabels)
    {
        $this->build();
    }

    private function build(): void
    {
        $buckets = $this->data["agingFilter"];

        $this->rows[] = ["Invoice Aging Report"];
        $this->rows[] = ["Generated: " . $this->data["generatedAt"]];
        $this->rows[] = ["Filter: " . $this->data["filterLabel"]];
        $this->rows[] = ["Aging: " . $this->data["agingLabel"]];
        $this->rows[] = [""];

        $headings = ["Customer No", "Customer Name", "Area", "Credit Term", "Credit Limit"];
        foreach ($buckets as $bucket) {
            $headings[] = $this->bucketLabels[$bucket];
        }
        $headings[] = "Total";

        $this->lastColumnIndex = count($headings);
        $this->rows[] = $headings;
        $this->headerRow = count($this->rows);

        foreach ($this->data["hospitalBlocks"] as $block) {
            $hospital = $block["hospital"];

            $row = [
                $hospital->hospital_number,
                $hospital->hospital_name,
                $hospital->area->area_name ?? "",
                $hospital->credit_term ?: "",
                (float) $hospital->credit_limit,
            ];

            foreach ($buckets as $bucket) {
                $row[] = (float) $block["subTotals"][$bucket];
            }
            $row[] = (float) $block["subTotals"]["total"];

            $this->rows[] = $row;
        }

        $totalRow = ["Grand Total", "", "", "", ""];
        foreach ($buckets as $bucket) {
            $totalRow[] = (float) $this->data["grandTotals"][$bucket];
        }
        $totalRow[] = (float) $this->data["grandTotals"]["total"];

        $this->rows[] = $totalRow;
        $this->lastRow = count($this->rows);
    }

    public function array(): array
    {
        return $this->rows;
    }

    public function title(): string
    {
        return "Summary";
    }

    public function columnFormats(): array
    {
        $formats = [];

        for ($i = self::LEADING_COLUMNS; $i < $this->lastColumnIndex; $i++) {
            $formats[$this->col($i)] = self::PESO;
        }

        return $formats;
    }

    public function styles(Worksheet $sheet)
    {
        $lastCol = $this->col($this->lastColumnIndex);

        $sheet->getStyle("A1")->getFont()->setBold(true)->setSize(14);

        $header = $sheet->getStyle("A{$this->headerRow}:{$lastCol}{$this->headerRow}");
        $header->getFont()->setBold(true)->getColor()->setRGB("FFFFFF");
        $header->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB("222222");
        $header->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $total = $sheet->getStyle("A{$this->lastRow}:{$lastCol}{$this->lastRow}");
        $total->getFont()->setBold(true);
        $total->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB("F4F4F4");
        $total->getBorders()->getTop()->setBorderStyle(Border::BORDER_THIN);

        $sheet->freezePane("A" . ($this->headerRow + 1));

        return [];
    }

    private function col(int $index): string
    {
        return Coordinate::stringFromColumnIndex($index);
    }
}