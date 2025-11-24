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
            ->with(["hospital" => function ($query) {
                $query->withCount("invoices");
            }, "creator", "updater"])
            ->select("invoices.*")
            ->addSelect([
                "processing_days" => function ($query) {
                    $query->selectRaw("
                        CASE
                            WHEN date_closed IS NOT NULL THEN 0
                            ELSE DATEDIFF(due_date, CURDATE())
                        END
                    ");
                }
            ])
            ->when($searchQuery, function ($query) use ($searchQuery) {
                $query->where("invoice_number", "like", "%{$searchQuery}%");
            })
            ->when(!$searchQuery && $processingFilter, function ($query) use ($processingFilter) {
                match ($processingFilter) {
                    "Current" => $query->having("processing_days", ">", 0),
                    "30-days" => $query->havingBetween("processing_days", [-30, -1]),
                    "31-60-days" => $query->havingBetween("processing_days", [-60, -31]),
                    "61-90-days" => $query->havingBetween("processing_days", [-90, -61]),
                    "91-over" => $query->having("processing_days", "<=", -91),
                    "Closed" => $query->having("processing_days", "=", 0),
                    default => null,
                };
            })
            ->orderBy("due_date", "desc")
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
