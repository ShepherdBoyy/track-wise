<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $hospitalId = $request->query("hospital_id");
        $searchQuery = $request->query("search");
        $processingFilter = $request->query("processing_days") ?? "0-30 days";
        $invoicesCount = $request->query("invoices_count");

        $invoices = Invoice::query()
            ->with(["hospital", "creator", "updater"])
            ->select("*", DB::raw("
                DATEDIFF(
                    IFNULL(date_closed, CURDATE()),
                    transaction_date
                ) AS processing_days
            "))
            ->when($hospitalId, function ($query) use ($hospitalId) {
                $query->where("hospital_id", $hospitalId);
            })
            ->when($searchQuery, function ($query) use ($searchQuery) {
                $hospitalIds = Hospital::where("hospital_name", "like", "%{$searchQuery}")
                    ->pluck("id");
                $query->whereIn("hospital_id", $hospitalIds);
            })
            ->orderBy("transaction_date", "desc")
            ->get();
        
        $invoices = $this->filterByProcessingDays($invoices, $processingFilter);

        return Inertia::render("Invoices/Index", [
            "invoices" => $invoices,
            "hospital" => $hospitalId ? Hospital::find($hospitalId) : null,
            "searchQuery" => $searchQuery,
            "processingFilter" => $processingFilter ?? "0-30 days",
            "invoicesCount" => $invoicesCount
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    private function filterByProcessingDays($invoices, $range)
    {
        return $invoices->filter(function ($invoice) use ($range) {
            $days = $invoice->processing_days;

            return match($range) {
                "30 days" => $days >= 0 && $days <= 30,
                "31-60 days" => $days >= 31 && $days <= 60,
                "61-90 days" => $days >= 61 && $days <= 90,
                "91-over" => $days >= 91,
                default => true
            };
        })->values();
    }
}
