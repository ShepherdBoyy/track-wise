<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHospitalRequest;
use App\Http\Requests\UpdateHospitalRequest;
use App\Models\Area;
use App\Models\Hospital;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $filterAreas = $request->query("selected_areas", []);
        $user = Auth::user();

        if (is_array($filterAreas)) {
            $filterAreas = array_map('intval', $filterAreas);
        }

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
            ->when(!empty($filterAreas), function ($query) use ($filterAreas) {
                $query->whereIn("area_id", $filterAreas);
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

        return Inertia::render("Hospitals/Index", [
            "hospitals" => $hospitals,
            "userAreas" => $userAreas,
            "filters" => [
                "sort_by" => $sortBy,
                "sort_order" => $sortOrder,
                "areas" => $filterAreas,
                "search" => $searchQuery,
                "per_page" => $perPage,
                "page" => $page
            ],
            "breadcrumbs" => [
                ["label" => "Hospitals", "url" => null]
            ]
        ]);
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
