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
        $sortBy = $request->query("sort_by", "created_at");
        $sortOrder = $request->query("sort_order", "asc");
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
            ->orderBy($sortBy, $sortOrder)
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
        $validated = $request->validated();

        Hospital::create($validated);

        return back()->with("success", true);
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
