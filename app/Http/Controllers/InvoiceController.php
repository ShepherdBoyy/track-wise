<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Hospital;
use App\Models\Invoice;
use App\Models\InvoiceHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize("viewAny", Invoice::class);

        $hospitalId = $request->hospital_id;
        $searchQuery = $request->query("search");
        $processingFilter = $request->query("processing_days");
        $perPage = $request->query("per_page", 10);
        $hospital = $hospitalId ? Hospital::withCount("invoices")->find($hospitalId) : null;
        $queryParams = $request->only([
            "search",
            "per_page",
            "sort_by",
            "sort_order",
            "selected_areas",
        ]);

        $countsQuery = Invoice::query()
            ->when($hospitalId, function ($query) use ($hospitalId) {
                $query->where("hospital_id", $hospitalId);
            })
            ->selectRaw("
                SUM(CASE
                    WHEN date_closed is NULL AND DATEDIFF(due_date, CURDATE()) > 0
                    THEN 1 ELSE 0
                END) as current_count,
                SUM(CASE
                    WHEN date_closed is NULL AND DATEDIFF(due_date, CURDATE()) BETWEEN -30 and -1
                    THEN 1 ELSE 0
                END) as thirty_days_count,
                SUM(CASE
                    WHEN date_closed is NULL AND DATEDIFF(due_date, CURDATE()) BETWEEN -60 and -31
                    THEN 1 ELSE 0
                END) as sixty_days_count,
                SUM(CASE
                    WHEN date_closed is NULL AND DATEDIFF(due_date, CURDATE()) BETWEEN -90 and -61
                    THEN 1 ELSE 0
                END) as ninety_days_count,
                SUM(CASE
                    WHEN date_closed is NULL AND DATEDIFF(due_date, CURDATE()) <= -91
                    THEN 1 ELSE 0
                END) as over_ninety_count,
                SUM(CASE
                    WHEN date_closed is NOT NULL
                    THEN 1 ELSE 0
                END) as closed_count,
                SUM(CASE
                    WHEN date_closed is NULL AND DATEDIFF(due_date, CURDATE()) > 0
                    THEN amount ELSE 0
                END) as current_total,
                SUM(CASE
                    WHEN date_closed is NULL AND DATEDIFF(due_date, CURDATE()) BETWEEN -30 and -1
                    THEN amount ELSE 0
                END) as thirty_days_total,
                SUM(CASE
                    WHEN date_closed is NULL AND DATEDIFF(due_date, CURDATE()) BETWEEN -60 and -31
                    THEN amount ELSE 0
                END) as sixty_days_total,
                SUM(CASE
                    WHEN date_closed is NULL AND DATEDIFF(due_date, CURDATE()) BETWEEN -90 and -61
                    THEN amount ELSE 0
                END) as ninety_days_total,
                SUM(CASE
                    WHEN date_closed is NULL AND DATEDIFF(due_date, CURDATE()) <= -91
                    THEN amount ELSE 0
                END) as over_ninety_total,
                SUM(CASE
                    WHEN date_closed is NOT NULL
                    THEN amount ELSE 0
                END) as closed_total
            ")
            ->first();
        
        $filterCounts = [
            "current" => $countsQuery->current_count ?? 0,
            "thirty_days" => $countsQuery->thirty_days_count ?? 0,
            "sixty_days" => $countsQuery->sixty_days_count ?? 0,
            "ninety_days" => $countsQuery->ninety_days_count ?? 0,
            "over_ninety" => $countsQuery->over_ninety_count ?? 0,
            "closed" => $countsQuery->closed_count ?? 0
        ];

        $filterTotals = [
            "current" => $countsQuery->current_total ?? 0,
            "thirty_days" => $countsQuery->thirty_days_total ?? 0,
            "sixty_days" => $countsQuery->sixty_days_total ?? 0,
            "ninety_days" => $countsQuery->ninety_days_total ?? 0,
            "over_ninety" => $countsQuery->over_ninety_total ?? 0,
            "closed" => $countsQuery->closed_total ?? 0
        ];

        $invoices = Invoice::query()
            ->with(["hospital", "creator", "latestHistory", "history.updater"])
            ->select("invoices.*")
            ->addSelect([
                "processing_days" => function ($query) {
                    $query->selectRaw("
                        CASE
                            WHEN date_closed IS NOT NULL
                                THEN DATEDIFF(due_date, date_closed)
                            ELSE
                                DATEDIFF(due_date, CURDATE())
                        END
                    ");
                }
            ])
            ->when($hospitalId, function ($query) use ($hospitalId) {
                $query->where("hospital_id", $hospitalId);
            })
            ->when($searchQuery, function ($query) use ($searchQuery) {
                $query->where("invoice_number", "like", "%{$searchQuery}%");
            })
            ->when(!$searchQuery && $processingFilter, function ($query) use ($processingFilter) {
                match ($processingFilter) {
                    "Current" => $query->having("processing_days", ">", 0)->whereNull("date_closed"),
                    "30-days" => $query->havingBetween("processing_days", [-30, -1])->whereNull("date_closed"),
                    "31-60-days" => $query->havingBetween("processing_days", [-60, -31])->whereNull("date_closed"),
                    "61-90-days" => $query->havingBetween("processing_days", [-90, -61])->whereNull("date_closed"),
                    "91-over" => $query->having("processing_days", "<=", -91)->whereNull("date_closed"),
                    "Closed" => $query->whereNotNull("date_closed"),
                    default => null,
                };
            })
            ->orderBy("due_date", "desc")
            ->paginate($perPage)
            ->withQueryString();
        
        $processingLabelMap = [
            "Current" => "Current",
            "30-days" => "30 days",
            "31-60-days" => "31-60 days",
            "61-90-days" => "61-90 days",
            "91-over" => "91-over",
            "Closed" => "Closed"
        ];

        $filteredParams = array_filter($queryParams, function($value) {
            return !is_null($value) && $value !== '' && $value !== [];
        });
        
        $queryString = http_build_query($filteredParams);
        $hospitalsUrl = '/hospitals' . ($queryString ? '?' . $queryString : '');
        
        return Inertia::render("Invoices/Index", [
            "invoices" => $invoices,
            "hospital" => $hospital,
            "searchQuery" => $searchQuery,
            "editor" => Auth::user()->name,
            "processingFilter" => $processingLabelMap[$processingFilter] ?? "Current",
            "filterCounts" => $filterCounts,
            "filterTotals" => $filterTotals,
            "breadcrumbs" => [
                ["label" => "Hospitals", "url" => $hospitalsUrl],
                ["label" => $hospital->hospital_name, "url" => null]
            ]
        ]);
    }

    public function store(StoreInvoiceRequest $request)
    {
        Gate::authorize("create", Invoice::class);

        $validated = $request->validated();
        $validated['created_by'] = Auth::id();

        $today = Carbon::today();
        $dueDate = Carbon::parse($validated["due_date"])->startOfDay();

        if (!empty($validated["date_closed"])) {
            $status = "closed";
        } else {
            $status = $today->greaterThan($dueDate)
                ? "overdue"
                : "open";
        }

        $invoice = Invoice::create($validated);

        $invoice->history()->create([
            "updated_by" => Auth::id(),
            "description" => "Invoice has been created manually",
            "status" => $status
        ]);

        return back()->with("success", true);
    }

    public function update(UpdateInvoiceRequest $request)
    {
        $invoiceId = $request->invoice_id;
        $invoice = Invoice::findOrFail($invoiceId);

        Gate::authorize("update", $invoice);

        $validated = $request->validated();

        $invoice->update($validated);

        return back()->with("success", true);
    }
    
    public function destroy(Request $request, $hospital_id)
    {
        Gate::authorize("delete", Invoice::class);

        $validated = $request->validate([
            "ids" => ["required", "array", "min:1"],
            "ids.*" => ["integer", "exists:invoices,id"]
        ]);

        Invoice::where("hospital_id", $hospital_id)
            ->whereIn("id", $validated["ids"])
            ->delete();

        return back()->with("success", true);
    }

    public function bulkUpdateHistory(Request $request, $hospital_id)
    {
        $validated = $request->validate([
            "ids" => ["required", "array", "min:1"],
            "ids.*" => ["integer", "exists:invoices,id"],
            "description" => ["required", "string"],
        ]);

        $invoices = Invoice::where("hospital_id", $hospital_id)
            ->whereIn("id", $validated["ids"])
            ->get();
        
        $today = Carbon::today();

        foreach ($invoices as $invoice) {
            if ($validated["description"] === "closed") {
                $description = "Invoice has been closed";
                $status = "closed";
            } else {
                $description = $validated["description"];
                $dueDate = Carbon::parse($invoice->due_date)->startOfDay();
                $status = $today->greaterThan($dueDate) ? "overdue" : "open";
            }

            $invoice->history()->create([
                "updated_by" => Auth::id(),
                "description" => $description,
                "status" => $status,
            ]);

            if ($status === "closed") {
                $invoice->update([
                    "date_closed" => Carbon::now(),
                ]);
            }
        }

        return back()->with("success", true);
    }

    public function viewHistory(Request $request)
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
}
