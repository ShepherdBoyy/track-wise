<?php

namespace App\Imports;

use App\Models\Hospital;
use App\Models\Invoice;
use App\Models\InvoiceHistory;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DataImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        DB::beginTransaction();

        try {
            foreach ($rows as $row) {
                $hospital = Hospital::firstOrCreate(
                    ["hospital_number" => $row["customer_number"]],
                    ["hospital_name" => $row["customer_name"]]
                );

                $invoice = Invoice::create([
                    "hospital_id" => $hospital->id,
                    "invoice_number" => $row["invoice_number"],
                    "document_date" => $row["document_date"],
                    "due_date" => $row["due_date"],
                    "amount" => $row["amount"],
                    "status" => $this->determineStatus($row["due_date"], $row["date_closed"] ?? null),
                    "date_closed" => $row["date_closed"] ?? null,
                    "created_by" => Auth::id(),
                ]);

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
