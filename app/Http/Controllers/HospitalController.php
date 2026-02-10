<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHospitalRequest;
use App\Http\Requests\UpdateHospitalRequest;
use App\Models\Area;
use App\Models\Hospital;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class HospitalController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize("viewAny", Hospital::class);

        $searchQuery = $request->query("hospital_search");
        $perPage = $request->query("per_page", 10);
        $page = $request->query("page", 1);
        $sortBy = $request->query("sort_by", "area_name");
        $sortOrder = $request->query("sort_order", "asc");
        $filterArea = intval($request->query("selected_area"));
        $user = Auth::user();

        $userAreas = Gate::allows("viewAll", Hospital::class) 
            ? Area::orderBy("area_name")->get()
            : $user->areas->sortBy("area_name")->values()->toArray();

        $query = Hospital::withCount("invoices")
            ->withSum("invoices", "amount")
            ->with("area");

        if (!Gate::allows("viewAll", Hospital::class)) {
            $userAreaIds = $user->areas->pluck("id");
            $query->whereIn("area_id", $userAreaIds);
        }

        $hospitals = $query
            ->when($searchQuery, function ($query) use ($searchQuery) {
                $query->where(function ($q) use ($searchQuery) {
                    $q->where("hospital_name", "like", "%{$searchQuery}%")
                        ->orWhere("hospital_number", "like", "%{$searchQuery}%");
                });
            })
            ->when(!empty($filterArea), function ($query) use ($filterArea) {
                $query->where("area_id", $filterArea);
            })
            ->when($sortBy, function ($query) use ($sortBy, $sortOrder) {
                if ($sortBy === "area_name") {
                    $query->leftJoin("areas", "hospitals.area_id", "=", "areas.id")
                        ->orderBy("areas.area_name", $sortOrder);
                } else {
                    $query->orderBy($sortBy, $sortOrder);
                }
            })
            ->paginate($perPage, ["*"], "page", $page)
            ->withQueryString();

        $processingDaysTotals = $this->getProcessingDaysTotals($filterArea, $user);

        return Inertia::render("Hospitals/Index", [
            "hospitals" => $hospitals,
            "userAreas" => $userAreas,
            "processingDaysTotals" => $processingDaysTotals,
            "filters" => [
                "sort_by" => $sortBy,
                "sort_order" => $sortOrder,
                "area" => $filterArea,
                "search" => $searchQuery,
                "per_page" => $perPage,
                "page" => $page
            ],
            "breadcrumbs" => [
                ["label" => "Hospitals", "url" => null]
            ]
        ]);
    }

    public function getProcessingDaysTotals($filterArea, $user)
    {
        $baseQuery = DB::table("invoices")
            ->join("hospitals", "invoices.hospital_id", "=", "hospitals.id")
            ->join("areas", "hospitals.area_id", "=", "areas.id")
            ->whereNull("invoices.date_closed");
        
        if (!Gate::allows("viewAll", Hospital::class)) {
            $userAreaIds = $user->areas->pluck("id");
            $baseQuery->whereIn("hospitals.area_id", $userAreaIds);
        }

        if ($filterArea) {
            $baseQuery->where("hospitals.area_id", $filterArea);
        }

        $results = $baseQuery->selectRaw("
            areas.id as area_id,
            areas.area_name,
            SUM(CASE
                WHEN DATEDIFF(invoices.due_date, CURDATE()) > 0
                THEN invoices.amount
                ELSE 0
            END) as current,
            SUM(CASE
                WHEN DATEDIFF(invoices.due_date, CURDATE()) BETWEEN -30 AND -1
                THEN invoices.amount
                ELSE 0
            END) as thirty_days,
            SUM(CASE
                WHEN DATEDIFF(invoices.due_date, CURDATE()) BETWEEN -60 AND -31
                THEN invoices.amount
                ELSE 0
            END) as sixty_days,
            SUM(CASE
                WHEN DATEDIFF(invoices.due_date, CURDATE()) BETWEEN -90 AND -61
                THEN invoices.amount
                ELSE 0
            END) as ninety_days,
            SUM(CASE
                WHEN DATEDIFF(invoices.due_date, CURDATE()) <= -91
                THEN invoices.amount
                ELSE 0
            END) as over_ninety,
            SUM(invoices.amount) as total
        ")
        ->groupBy("areas.id", "areas.area_name")
        ->orderBy("areas.area_name")
        ->get();

        $overallTotals = [
            "current" => (float) $results->sum("current"),
            "thirty_days" => (float) $results->sum("thirty_days"),
            "sixty_days" => (float) $results->sum("sixty_days"),
            "ninety_days" => (float) $results->sum("ninety_days"),
            "over_ninety" => (float) $results->sum("over_ninety"),
            "total" => (float) $results->sum("total")
        ];

        return [
            "overall" => $overallTotals
        ];
    }

    public function store(StoreHospitalRequest $request)
    {
        Gate::authorize("create", Hospital::class);

        $validated = $request->validated();
        Hospital::create($validated);

        return back()->with("success", true);
    }

    public function update(UpdateHospitalRequest $request, string $id)
    {
        $hospital = Hospital::findOrFail($id);

        Gate::authorize("update", $hospital);

        $validated = $request->validated();

        $hospital->update($validated);

        return back()->with("success", true);
    }

    public function destroy(string $id)
    {
        $hospital = Hospital::findOrFail($id);

        Gate::authorize("delete", $hospital);

        $hospital->delete();

        return back()->with("success", true);
    }
}
