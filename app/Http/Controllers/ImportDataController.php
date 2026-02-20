<?php

namespace App\Http\Controllers;

use App\Exports\TemplateExport;
use App\Imports\DataValidationImport;
use App\Imports\DataImport;
use App\Models\ImportHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ImportDataController extends Controller
{
    public function index()
    {
        Gate::authorize("viewImportData");

        $importHistory = ImportHistory::with("importer")
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render("ImportData/Index", [
            "importHistory" => $importHistory
        ]);
    }

    public function downloadTemplate()
    {
        Gate::authorize("viewImportData");

        return Excel::download(new TemplateExport, "Track_Wise_Template.xlsx");
    }

    public function store(Request $request)
    {
        Gate::authorize("importData");

        $request->validate([
            "file" => "required|mimes:xlsx,xls,csv"
        ]);

        $file = $request->file("file");
        $fileName = $file->getClientOriginalName();

        set_time_limit(300);
        ini_set("memory_limit", "512M");

        try {
            // Validate each data in excel
            $validator = new DataValidationImport();
            Excel::import($validator, $file);

            if ($validator->failures()->isNotEmpty()) {
                $formattedErrors = $validator->failures()->map(function ($failure) {
                    return [
                        "row" => $failure->row(),
                        "header" => $failure->attribute(),
                        "errors" => $failure->errors(),
                        "value" => $failure->values()[$failure->attribute()]
                    ];
                })->values()->toArray();

                return redirect()->back()->with([
                    "import_errors" => $formattedErrors
                ]);
            }

            // If no errors in validation then import data
            Excel::import(new DataImport(), $file);

            ImportHistory::create([
                "file_name" => $fileName,
                "total_rows" => $validator->getRowCount(),
                "imported_by" => Auth::id()
            ]);

            return redirect()->back()->with("success", true);
        } catch (\Exception $e) {
            return redirect()->back()->with([
                "import_errors" => [[
                    "row" => "N/A",
                    "header" => "general",
                    "errors" => ["Import error: " . $e->getMessage()],
                    "value" => "N/A"
                ]]
            ]);
        }
    }
}