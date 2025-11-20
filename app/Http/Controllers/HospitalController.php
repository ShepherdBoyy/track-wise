<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHospitalRequest;
use App\Http\Requests\UpdateHospitalRequest;
use App\Models\Hospital;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HospitalController extends Controller
{
    public function index()
    {
        $hospitals = Hospital::withCount("invoices")
            ->orderBy("created_at", "desc")
            ->paginate(10);

        return Inertia::render("Hospitals/Index", [
            "hospitals" => $hospitals
        ]);
    }

    public function store(StoreHospitalRequest $request)
    {
        $validated = $request->validated();

        Hospital::create($validated);

        return back()->with("success", true);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $hospitalId = $request->hospital_id;
        $searchQuery = $request->query("search");
        $processingFilter = $request->processing_days;
        $invoicesCount = $request->invoices_count;

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
            ->orderBy("transaction_date", "desc")
            ->paginate(10)
            ->withQueryString();
        
        return Inertia::render("Hospitals/Show", [
            "invoices" => $invoices,
            "hospital" => $hospitalId ? Hospital::find($hospitalId) : null,
            "searchQuery" => $searchQuery,
            "processingFilter" => $processingFilter ?? "30-days",
            "invoicesCount" => $invoicesCount
        ]);
    }

    public function update(UpdateHospitalRequest $request, string $id)
    {
        $hospital = Hospital::findOrFail($id);

        if ($request->input("hospital_name") === $hospital->hospital_name) {
            return back()->withErrors(["hospital_name" => "Update requires a different value"]);
        }

        $validated = $request->validated();

        $hospital->update($validated);

        return back()->with("success", true);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $hospital = Hospital::findOrFail($id);
        $hospital->delete();

        return back()->with("success", true);
    }

    private function filterByProcessingDays($invoices, $range)
    {
        return $invoices->filter(function ($invoice) use ($range) {
            $days = $invoice->processing_days;

            return match($range) {
                "30-days" => $days >= 0 && $days <= 30,
                "31-60-days" => $days >= 31 && $days <= 60,
                "61-90-days" => $days >= 61 && $days <= 90,
                "91-over" => $days >= 91,
                default => true
            };
        })->values();
    }
}
