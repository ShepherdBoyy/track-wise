<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHospitalRequest;
use App\Models\Hospital;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HospitalController extends Controller
{
    public function index()
    {
        $hospitals = Hospital::withCount("invoices")
            ->orderBy("hospital_name")
            ->paginate(10);

        return Inertia::render("Hospitals/Index", [
            "hospitals" => $hospitals
        ]);
    }

    public function create()
    {
        return Inertia::render("Hospitals/Create");
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
