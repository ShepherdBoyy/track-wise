<?php

namespace App\Imports;

use App\Models\Area;
use App\Models\Hospital;
use App\Models\Invoice;
use App\Models\InvoiceHistory;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class DataImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        DB::beginTransaction();

        try {
            foreach ($rows as $row) {
                $area = Area::firstOrCreate(["area_name" => $row["area"]]);

                $hospital = Hospital::firstOrCreate(
                    ["hospital_number" => $row["customer_number"]],
                    [
                        "hospital_name" => $row["customer_name"],
                        "area_id" => $area->id
                    ]
                );

                $documentDate = $this->transformDate($row["document_date"]);
                $dueDate = $this->transformDate($row["due_date"]);
                $dateClosed = !empty($row["date_closed"]) ? $this->transformDate($row["date_closed"]) : null;

                $invoice = Invoice::create(
                    [
                        "invoice_number" => $row["invoice_number"],
                        "hospital_id" => $hospital->id,
                        "document_date" => $documentDate,
                        "due_date" => $dueDate,
                        "amount" => floatval(str_replace(",", "", $row["amount"])),
                        "status" => $this->determineStatus($row["due_date"], $row["date_closed"] ?? null),
                        "date_closed" => $dateClosed,
                        "created_by" => Auth::id(),
                    ]
                );

                InvoiceHistory::create([
                    "invoice_id" => $invoice->id,
                    "updated_by" => Auth::id(),
                    "description" => "Invoice has been created"
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function transformDate($value)
    {
        if (empty($value)) {
            return null;
        }

        try {
            if ($value instanceof \DateTime) {
                return Carbon::instance($value)->format("Y-m-d");
            } elseif (is_numeric($value)) {
                return Carbon::instance(Date::excelToDateTimeObject($value))->format("Y-m-d");
            } elseif (is_string($value)) {
                return Carbon::createFromFormat("n/j/Y", $value)->format("Y-m-d");
            } else {
                return Carbon::parse($value)->format('Y-m-d');
            }
        } catch (\Exception $e) {
            return null;
        }
    }

    private function determineStatus($dueDate, $dateClosed)
    {
        if (!empty($dateClosed)) {
            return "closed";
        }

        $now = Carbon::now();
        $due = Carbon::parse($dueDate);

        if ($now->greaterThan($due)) {
            return "overdue";
        }

         return "open";
    }
}
