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

use function Symfony\Component\Clock\now;

class DataImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        $areaNames = $rows->pluck("area")->unique()->toArray();
        $customerNos = $rows->pluck("customer_no")->unique()->toArray();

        $areas = Area::whereIn("area_name", $areaNames)->pluck("id", "area_name");
        $hospitals = Hospital::whereIn("hospital_number", $customerNos)->get()->keyBy("hospital_number");

        $areasToCreate = [];
        $hospitalsToCreate = [];
        $invoicesToCreate = [];
        $historiesToCreate = [];

        $documentDate = null;
        $dueDate = null;

        DB::beginTransaction();

        try {
            foreach ($rows as $row) {
                if (!isset($areas[$row["area"]])) {
                    $areasToCreate[$row["area"]] = ["area_name" => $row["area"]];
                }
            }

            if (!empty($areasToCreate)) {
                Area::insert(array_values($areasToCreate));
                $areas = Area::whereIn("area_name", $areaNames)->pluck("id", "area_name");
            }

            foreach ($rows as $row) {
                if (!isset($hospitals["customer_no"])) {
                    $hospitalsToCreate[$row["customer_no"]] = [
                        "hospital_number" => $row["customer_no"],
                        "hospital_name" => $row["customer_name"],
                        "area_id" => $areas[$row["area"]],
                        "created_at" => now(),
                        "updated_at" => now(),
                    ];
                }
            }

            if (!empty($hospitalsToCreate)) {
                Hospital::insert(array_values($hospitalsToCreate));
                $hospitals = Hospital::whereIn("hospital_number", $customerNos)->get()->keyBy("hospital_number");
            }

            foreach ($rows as $row) {
                $documentDate = $this->transformDate($row["document_date"]);
                $dueDate = $this->transformDate($row["due_date"]);
                $dateClosed = !empty($row["date_closed"]) ? $this->transformDate($row["date_closed"]) : null;

                $invoicesToCreate[] = [
                    "invoice_number" => $row["invoice_no"],
                    "hospital_id" => $hospitals[$row["customer_no"]]->id,
                    "document_date" => $documentDate,
                    "due_date" => $dueDate,
                    "amount" => floatval(str_replace(",", "", $row["amount"])),
                    "date_closed" => $dateClosed,
                    "created_by" => Auth::id(),
                    "created_at" => now(),
                    "updated_at" => now(),
                ];
            }
            
            if (!empty($invoicesToCreate)) {
                foreach(array_chunk($invoicesToCreate, 500) as $chunk) {
                    Invoice::insert($chunk);
                }

                $invoiceNumbers = collect($invoicesToCreate)->pluck("invoice_number")->toArray();
                $createdInvoices = Invoice::whereIn("invoice_number", $invoiceNumbers)->get()->keyBy("invoice_number");

                foreach ($invoicesToCreate as $invoice) {
                    $historiesToCreate[] = [
                        "invoice_id" => $createdInvoices[$invoice["invoice_number"]]->id,
                        "updated_by" => Auth::id(),
                        "description" => "Invoice has been created from the imported Excel file",
                        "status" => $this->determineStatus($invoice["due_date"], $invoice["date_closed"]),
                        "created_at" => now(),
                        "updated_at" => now(),
                    ];
                }

                foreach (array_chunk($historiesToCreate, 500) as $chunk) {
                    InvoiceHistory::insert($chunk);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function chunkSize(): int
    {
        return 1000;
    }

    public function batchSize(): int
    {
        return 500;
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
