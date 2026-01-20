<?php

namespace App\Http\Controllers;

use App\Exports\TemplateExport;
use App\Imports\DataImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ImportDataController extends Controller
{
    public function index()
    {
        Gate::authorize("viewImportData");

        return Inertia::render("ImportData/Index");
    }

    public function downloadTemplate()
    {
        Gate::authorize("viewImportData");

        return Excel::download(new TemplateExport, "Invoice_Tracker_Template.xlsx");
    }

    public function store(Request $request)
    {
        Gate::authorize("importData");

        $request->validate([
            "file" => "required|mimes:xlsx,xls,csv"
        ]);

        try {
            Excel::import(new DataImport, $request->file("file"));

            return back()->with("success", true);
        } catch (\Exception $e) {
            return back()->withErrors([
                "error" => "Import failed: " . $e->getMessage()
            ]);
        }
    }
}
