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
        $rows = $rows->map(function ($row) {
            return $row->map(function ($value) {
                if (is_string($value)) {
                    return preg_replace("/\s+/", " ", trim($value));
                }
                return $value;
            });
        });

        $areaNames = $rows->pluck("area")->unique()->toArray();
        $customerNos = $rows->pluck("customer_no")->unique()->toArray();
        $newInvoiceNumbers = $rows->pluck("invoice_no")->unique()->toArray();

        $areas = Area::whereIn("area_name", $areaNames)->pluck("id", "area_name");
        $hospitals = Hospital::whereIn("hospital_number", $customerNos)->get()->keyBy("hospital_number");
        $existingInvoices = Invoice::whereIn("invoice_number", $newInvoiceNumbers)->get()->keyBy("invoice_number");

        $areasToCreate = [];
        $hospitalsToCreate = [];
        $hospitalsToUpdate = [];
        $invoicesToUpdate = [];
        $invoicesToCreate = [];
        $historiesToCreate = [];

        DB::beginTransaction();

        try {
            foreach ($rows as $row) {
                if (!isset($areas[$row["area"]])) {
                    $areasToCreate[$row["area"]] = [
                        "area_name" => $row["area"],
                        "created_at" => now(),
                        "updated_at" => now(),
                    ];
                }
            }

            if (!empty($areasToCreate)) {
                Area::insert(array_values($areasToCreate));
                $areas = Area::whereIn("area_name", $areaNames)->pluck("id", "area_name");
            }

            Area::whereNotIn("area_name", $areaNames)->delete();

            $hospitalsByNumber = $rows->groupBy("customer_no");

            foreach ($hospitalsByNumber as $hospitalNumber => $hospitalRows) {
                $row = $hospitalRows->first();

                if (isset($hospitals[$hospitalNumber])) {
                    $hospitalsToUpdate[$hospitalNumber] = [
                        "hospital_name" => $row["customer_name"],
                        "area_id" => $areas[$row["area"]],
                        "updated_at" => now(),
                    ];
                } else {
                    $hospitalsToCreate[$hospitalNumber] = [
                        "hospital_number" => $hospitalNumber,
                        "hospital_name" => $row["customer_name"],
                        "area_id" => $areas[$row["area"]],
                        "created_at" => now(),
                        "updated_at" => now()
                    ];
                }
            }

            foreach ($hospitalsToUpdate as $hospitalNumber => $updateData) {
                Hospital::where("hospital_number", $hospitalNumber)->update($updateData);
            }

            if (!empty($hospitalsToCreate)) {
                Hospital::insert(array_values($hospitalsToCreate));
            }

            Hospital::whereNotIn("hospital_number", $customerNos)->delete();

            $hospitals = Hospital::whereIn("hospital_number", $customerNos)->get()->keyBy("hospital_number");

            foreach ($rows as $row) {
                $documentDate = $this->transformDate($row["document_date"]);
                $dueDate = $this->transformDate($row["due_date"]);
                $dateClosed = !empty($row["date_closed"]) ? $this->transformDate($row["date_closed"]) : null;

                if (isset($existingInvoices[$row["invoice_no"]])) {
                    if (!isset($invoicesToUpdate[$row["invoice_no"]])) {
                        $invoicesToUpdate[$row["invoice_no"]] = [
                            "hospital_id" => $hospitals[$row["customer_no"]]->id,
                            "document_date" => $documentDate,
                            "due_date" => $dueDate,
                            "amount" => floatval(str_replace(",", "", $row["amount"])),
                            "date_closed" => $dateClosed,
                            "updated_at" => now()
                        ];
                    }
                } else {
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
            }

            foreach ($invoicesToUpdate as $invoiceNumber => $updateData) {
                Invoice::where("invoice_number", $invoiceNumber)->update($updateData);
            }

            if (!empty($invoicesToCreate)) {
                foreach (array_chunk($invoicesToCreate, 500) as $chunk) {
                    Invoice::insert($chunk);
                }

                $invoiceNumbers = collect($invoicesToCreate)->pluck("invoice_number")->toArray();
                $createdInvoices = Invoice::whereIn("invoice_number", $invoiceNumbers)->get()->keyBy("invoice_number");

                foreach ($invoicesToCreate as $invoice) {
                    $historiesToCreate[] = [
                        "invoice_id" => $createdInvoices[$invoice["invoice_number"]]->id,
                        "updated_by" => Auth::id(),
                        "remarks" => "Invoice has been created from the imported Excel file",
                        "status" => $this->determineStatus($invoice["due_date"], $invoice["date_closed"]),
                        "created_at" => now(),
                        "updated_at" => now(),
                    ];
                }

                foreach (array_chunk($historiesToCreate, 500) as $chunk) {
                    InvoiceHistory::insert($chunk);
                }
            }

            if (!empty($invoicesToUpdate)) {
                $updatedInvoices = Invoice::whereIn("invoice_number", array_keys($invoicesToUpdate))
                    ->get()
                    ->keyBy("invoice_number");

                $updateHistoriesToCreate = [];
                foreach ($invoicesToUpdate as $invoiceNumber => $updateData) {
                    $updateHistoriesToCreate[] = [
                        "invoice_id" => $updatedInvoices[$invoiceNumber]->id,
                        "updated_by" => Auth::id(),
                        "remarks" => "Invoice has been updated from the imported Excel file",
                        "status" => $this->determineStatus($updateData["due_date"], $updateData["date_closed"]),
                        "updated_at" => now(),
                        "created_at" => now()
                    ];
                }

                foreach (array_chunk($updateHistoriesToCreate, 500) as $chunk) {
                    InvoiceHistory::insert($chunk);
                }
            }

            Invoice::whereNotIn("invoice_number", $newInvoiceNumbers)->delete();

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
