<?php

namespace App\Http\Controllers;

use App\Models\InvoiceHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InvoiceHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $id)
    {
        $validated = $request->validate([
            "description" => "required|string"
        ]);

        InvoiceHistory::create([
            "invoice_id" => $id,
            "updated_by" => Auth::id(),
            "description" => $validated["description"]
        ]);

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
