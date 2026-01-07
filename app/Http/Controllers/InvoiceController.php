<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Hospital;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $hospitalId = $request->hospital_id;
        $searchQuery = $request->query("search");
        $processingFilter = $request->processing_days;
        $perPage = $request->query("per_page", 10);
        $hospital = $hospitalId ? Hospital::withCount("invoices")->find($hospitalId) : null;

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
                END) as closed_count
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

        $invoices = Invoice::query()
            ->with(["hospital", "creator"])
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
        
        return Inertia::render("Invoices/Index", [
            "invoices" => $invoices,
            "hospital" => $hospital,
            "searchQuery" => $searchQuery,
            "processingFilter" => str_replace("-days", " days", $processingFilter),
            "filterCounts" => $filterCounts,
            "breadcrumbs" => [
                ["label" => "Hospitals", "url" => "/hospitals"],
                ["label" => $hospital->hospital_name, "url" => null]
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render("Invoices/Create", [
            "hospitalId" => request("hospital_id")
        ]);
    }

    public function store(StoreInvoiceRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();

        $today = Carbon::today();
        $dueDate = Carbon::parse($validated["due_date"])->startOfDay();

        if (!empty($validated["date_closed"])) {
            $validated["status"] = "closed";
        } else {
            $validated["status"] = $today->greaterThan($dueDate)
                ? "overdue"
                : "open";
        }

        $invoice = Invoice::create($validated);

        $invoice->history()->create([
            "updated_by" => Auth::id(),
            "description" => "Invoice has been created manually"
        ]);

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

    public function update(UpdateInvoiceRequest $request)
    {
        $invoiceId = $request->invoice_id;
        $invoice = Invoice::findOrFail($invoiceId);

        $validated = $request->validated();

        $invoice->update($validated);

        return back()->with("success", true);
    }
    
    public function destroy(Request $request, $hospital_id)
    {
        $validated = $request->validate([
            "ids" => ["required", "array", "min:1"],
            "ids.*" => ["integer", "exists:invoices,id"]
        ]);

        Invoice::where("hospital_id", $hospital_id)
            ->whereIn("id", $validated["ids"])
            ->delete();

        return back()->with("success", true);
    }
}
