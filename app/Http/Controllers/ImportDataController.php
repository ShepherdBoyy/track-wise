<?php

namespace App\Http\Controllers;

use App\Exports\TemplateExport;
use App\Imports\DataImport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ImportDataController extends Controller
{
    public function index()
    {
        return Inertia::render("ImportData/Index");
    }

    public function downloadTemplate()
    {
        return Excel::download(new TemplateExport, "Invoice_Tracker_Template.xlsx");
    }

    public function store(Request $request)
    {
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
