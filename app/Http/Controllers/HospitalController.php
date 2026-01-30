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

        $searchQuery = $request->query("search");
        $perPage = $request->query("per_page", 10);
        $sortBy = $request->query("sort_by", "hospital_name");
        $sortOrder = $request->query("sort_order", "asc");
        $user = Auth::user();
        $areas = Area::all();

        $query = Hospital::withCount("invoices")->with("area");

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
            ->when($sortBy, function ($query) use ($sortBy, $sortOrder) {
                if ($sortBy === "area_name") {
                    $query->leftJoin("areas", "hospitals.area_id", "=", "areas.id")
                        ->orderBy("areas.area_name", $sortOrder);
                } else {
                    $query->orderBy($sortBy, $sortOrder);
                }
            })
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render("Hospitals/Index", [
            "hospitals" => $hospitals,
            "areas" => $areas,
            "filters" => [
                "sort_by" => $sortBy,
                "sort_order" => $sortOrder
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
