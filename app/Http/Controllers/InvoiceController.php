<?php

namespace App\Http\Controllers;

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
        $searchQuery = $request->query("search");
        $processingFilter = $request->processing_days;

        $invoices = Invoice::query()
            ->with(["hospital", "creator", "updater"])
            ->select("*", DB::raw("
                DATEDIFF(
                    IFNULL(date_closed, CURDATE()),
                    transaction_date
                ) AS processing_days
            "))
            ->when($searchQuery, function ($query) use ($searchQuery) {
                $query->where("invoice_number", "like", "%{$searchQuery}%");
            })
            ->when(!$searchQuery && $processingFilter, function ($query) use ($processingFilter) {
                match ($processingFilter) {
                    "30-days" => $query->havingBetween("processing_days", [0, 30]),
                    "31-60-days" => $query->havingBetween("processing_days", [31, 60]),
                    "61-90-days" => $query->havingBetween("processing_days", [61, 90]),
                    "91-over" => $query->having("processing_days", ">=", 91),
                    default => null,
                };
            })
            ->orderBy("created_at", "desc")
            ->paginate(10)
            ->withQueryString();

        return Inertia::render("Invoices/Index", [
            "invoices" => $invoices,
            "searchQuery" => $searchQuery,
            "processingFilter" => $processingFilter ?? "30-days",
        ]);
    }

    public function invoicePage()
    {
        return Inertia::render('Invoices/InvoicePage'); // include folder name!
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
}
