<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceHistory;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
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
            "editor" => Auth::user()->name,
            "breadcrumbs" => [
                ["label" => "Hospitals", "url" => "/hospitals"],
                ["label" => $invoice->hospital->hospital_name, "url" => "/hospitals/{$invoice->hospital_id}/invoices/Current"],
                ["label" => $invoice->invoice_number, "url" => null]
            ]
        ]);
    }

    public function download(Request $request)
    {
        $invoiceId = $request->invoice_id;

        $invoice = Invoice::with(["hospital", "creator"])->findOrFail($invoiceId);

        $history = InvoiceHistory::where("invoice_id", $invoiceId)
            ->with(["updater"])
            ->orderBy("updated_at", "desc")
            ->get();
        
        $today = Carbon::today();
        $dueDate = Carbon::parse($invoice->due_date);

        $daysRemaining = $today->lessThanOrEqualTo($dueDate)
            ? $today->diffInDays($dueDate)
            : 0;
        
        $daysOverdue = $today->greaterThan($dueDate)
            ? $today->diffInDays($dueDate)
            : 0;
        
        $dateClosed = $invoice->date_closed
            ? Carbon::parse($invoice->date_closed)->format('m/d/Y')
            : null;
        
        $pdf = Pdf::loadView("pdf.invoice", [
            "invoice" => $invoice,
            "history" => $history,
            "daysRemaining" => $daysRemaining,
            "daysOverdue" => $daysOverdue,
            "dateClosed" => $dateClosed
        ])->setPaper("letter");

        $hospitalName = str_replace(" ", "-", $invoice->hospital->hospital_name);
        $invoiceNumber = $invoice->invoice_number;
        $dateNow = Carbon::now()->format("F j, Y");

        $filename = "{$hospitalName}-{$invoiceNumber}-{$dateNow}.pdf";

        return $pdf->stream($filename);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $invoiceId = $request->invoice_id;

        $validated = $request->validate([
            "description" => "required|string"
        ]);

        $description = $validated['description'] === 'closed'
            ? 'Invoice has been closed'
            : $validated['description'];

        InvoiceHistory::create([
            "invoice_id" => $invoiceId,
            "updated_by" => Auth::id(),
            "description" => $description
        ]);

        if ($validated["description"] === "closed") {
            Invoice::where("id", $invoiceId)->update([
                "status" => "closed",
                "date_closed" => now()
            ]);
        }

        return back()->with("success", true);   
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
