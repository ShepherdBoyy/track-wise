<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class DataValidationImport implements ToCollection, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    private int $rowCount = 0;

    public function collection(Collection $rows)
    {
        $this->rowCount = $rows->count();
    }

    public function getRowCount()
    {
        return $this->rowCount;
    }

    public function prepareForValidation($data, $index)
    {
        if (isset($data["document_date"]) && is_numeric($data["document_date"])) {
            $data["document_date"] = Date::excelToDateTimeObject($data["document_date"])->format("m/d/Y");
        }

        if (isset($data["due_date"]) && is_numeric($data["due_date"])) {
            $data["due_date"] = Date::excelToDateTimeObject($data["due_date"])->format("m/d/Y");
        }

        return $data;
    }

    public function rules(): array
    {
        return [
            "*.area" => ["required", "string"],
            "*.customer_no" => ["required", "string"],
            "*.customer_name" => ["required", "string"],
            "*.invoice_no" => ["required", "string"],
            "*.document_date" => ["required", "date_format:m/d/Y"],
            "*.due_date" => ["required", "date_format:m/d/Y"],
            "*.amount" => ["required", "numeric"],
        ];
    }
}
