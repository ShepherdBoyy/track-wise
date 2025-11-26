<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceHistoryController extends Controller
{
    public function index(Request $request)
    {
        $invoiceId = $request->invoice_id;

        $invoice = Invoice::with(["hospital", "creator"])->findOrFail($invoiceId);

        $history = InvoiceHistory::where("invoice_id", $invoiceId)
            ->with(["updater"])
            ->orderBy("updated_at", "desc")
            ->get();

        return Inertia::render("InvoiceHistory/Index", [
            "invoice" => $invoice,
            "history" => $history,
            "editor" => Auth::user()->name
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
        $invoiceId = $request->invoice_id;

        $validated = $request->validate([
            "description" => "required|string"
        ]);

        InvoiceHistory::create([
            "invoice_id" => $invoiceId,
            "updated_by" => Auth::id(),
            "description" => $validated["description"]
        ]);

        return back()->with("success", true);
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
