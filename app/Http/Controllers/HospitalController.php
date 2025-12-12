<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHospitalRequest;
use App\Http\Requests\UpdateHospitalRequest;
use App\Models\Area;
use App\Models\Hospital;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HospitalController extends Controller
{
    public function index(Request $request)
    {
        $searchQuery = $request->query("search");
        $perPage = $request->query("per_page", 10);
        $userAreaId = Auth::user()->area_id;
        $areas = Area::all();

        $hospitals = Hospital::withCount("invoices")
            ->with("area")
            ->where("area_id", $userAreaId)
            ->when($searchQuery, function ($query) use ($searchQuery) {
                $query->where(function ($q) use ($searchQuery) {
                    $q->where("hospital_name", "like", "%{$searchQuery}%")
                        ->orWhere("hospital_number", "like", "%{$searchQuery}%");
                });
            })
            ->orderBy("created_at", "desc")
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render("Hospitals/Index", [
            "hospitals" => $hospitals,
            "areas" => $areas
        ]);
    }

    public function store(StoreHospitalRequest $request)
    {
        $validated = $request->validated();

        Hospital::create($validated);

        return back()->with("success", true);
    }

    public function show(Request $request)
    {
        $hospitalId = $request->hospital_id;
        $searchQuery = $request->query("search");
        $processingFilter = $request->processing_days;
        $perPage = $request->query("per_page", 10);

        $invoices = Invoice::query()
            ->with(["hospital", "creator"])
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
            ->when($hospitalId, function ($query) use ($hospitalId) {
                $query->where("hospital_id", $hospitalId);
            })
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
            ->paginate($perPage)
            ->withQueryString();
        
        return Inertia::render("Invoices/Index", [
            "invoices" => $invoices,
            "hospital" => $hospitalId 
                ? Hospital::withCount("invoices")->find($hospitalId) 
                : null,
            "searchQuery" => $searchQuery,
            "processingFilter" => $processingFilter ?? "30-days",
        ]);
    }

    public function update(UpdateHospitalRequest $request, string $id)
    {
        $hospital = Hospital::findOrFail($id);

        $validated = $request->validated();

        $hospital->update($validated);

        return back()->with("success", true);
    }

    public function destroy(string $id)
    {
        $hospital = Hospital::findOrFail($id);
        $hospital->delete();

        return back()->with("success", true);
    }
}
