<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Hospital;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExportController extends Controller
{
    public function index()
    {
        $areas = Area::orderBy("area_name")->get(["id", "area_name"]);
        $hospitals = Hospital::orderBy("hospital_name")->get(["id", "hospital_name", "area_id"]);

        return Inertia::render("Export/Index", [
            "areas" => $areas,
            "hospitals" => $hospitals
        ]);
    }

    public function invoiceAging(Request $request)
    {
        ini_set('memory_limit', '1024M');

        $validated = $request->validate([
            "filter_type" => "required|in:overall,area,hospital",
            "area_id" => "required_if:filter_type,area|array|min:1",
            "area_id.*" => "exists:areas,id",
            "hospital_id" => "required_if:filter_type,hospital|array|min:1",
            "hospital_id.*" => "exists:hospitals,id",
            "aging_filter" => "required|array|min:1",
            "aging_filter.*" => "in:current,30,31-60,61-90,over_90"
        ]);

        $filterType = $validated["filter_type"];
        $agingFilter = $validated["aging_filter"];

        $query = Invoice::query()
            ->select("invoices.*")
            ->addSelect([
                "processing_days" => function ($q) {
                    $q->selectRaw("
                        CASE
                            WHEN date_closed IS NOT NULL
                                THEN DATEDIFF(date_closed, due_date)
                            ELSE
                                DATEDIFF(CURDATE(), due_date)
                        END
                    ");
                }
            ])
            ->with(["hospital.area", "latestHistory"])
            ->orderBy("document_date");

        if ($filterType === "area") {
            $query->whereHas("hospital", function ($q) use ($validated) {
                $q->whereIn("area_id", $validated["area_id"]);
            });
        } elseif ($filterType === "hospital") {
            $query->whereIn("hospital_id", $validated["hospital_id"]);
        }

        foreach ($agingFilter as $bucket) {
            match ($bucket) {
                "current" => $query->orHaving("processing_days", "<=", 0),
                "30" => $query->orHavingBetween("processing_days", [1, 30]),
                "31-60" => $query->orHavingBetween("processing_days", [31, 60]),
                "61-90" => $query->orHavingBetween("processing_days", [61, 90]),
                "over_90" => $query->orHaving("processing_days", ">=", 91),
                default => null
            };
        }
            
        $invoices = $query->get();

        $invoices->each(function ($invoice) {
            $days = (int) $invoice->processing_days;

            $invoice->aging_bucket = match (true) {
                $days <= 0 => "current",
                $days <= 30 => "30",
                $days <= 60 => "31-60",
                $days <= 90 => "61-90",
                default => "over_90"
            };
        });

        $orderedBuckets = ["current", "30", "31-60", "61-90", "over_90"];
        $agingFilter = collect($orderedBuckets)
            ->filter(fn($b) => in_array($b, $agingFilter))
            ->values()
            ->all();

        $grouped = $invoices->groupBy("hospital_id");

        $hospitalBlocks = $grouped->map(function ($hospitalInvoices) use ($agingFilter) {
            $hospital = $hospitalInvoices->first()->hospital;

            $subTotals = [];
            foreach ($agingFilter as $bucket) {
                $subTotals[$bucket] = $hospitalInvoices->where("aging_bucket", $bucket)->sum("amount");
            }

            $subTotals["total"] = collect($agingFilter)
                ->sum(fn($bucket) => $hospitalInvoices->where("aging_bucket", $bucket)->sum("amount"));

            return [
                "hospital" => $hospital,
                "invoices" => $hospitalInvoices->values(),
                "subTotals" => $subTotals
            ];
        })->sortBy(fn($block) => $block["hospital"]->hospital_name)
        ->values();

        $grandTotals = [];
        foreach ($agingFilter as $bucket) {
            $grandTotals[$bucket] = $invoices->where("aging_bucket", $bucket)->sum("amount");
        }
        $grandTotals["total"] = collect($agingFilter)
            ->sum(fn($bucket) => $invoices->where("aging_bucket", $bucket)->sum("amount"));

        $bucketLabels = [
            "current" => "Current",
            "30" => "1-30 Days",
            "31-60" => "31-60 Days",
            "61-90" => "61-90 Days",
            "over_90" => "91 Over"
        ];

        $allBuckets = ["current", "30", "31-60", "61-90", "over_90"];
        $isAll = empty(array_diff($allBuckets, $agingFilter));
        $agingLabel = $isAll
            ? "All"
            : collect($agingFilter)->map(fn($b) => $bucketLabels[$b])->join(", ");

        $filterLabel = match ($filterType) {
            "overall" => "Overall - All Areas & Hospitals",
            "area" => "By Area - " . Area::whereIn("id", $validated["area_id"])->pluck("area_name")->join(", "),
            "hospital" => "By Hospital - " . Hospital::whereIn("id", $validated["hospital_id"])->pluck("hospital_name")->join(", ")
        };

        $pdf = Pdf::loadView("pdf.invoice-aging-report", [
            "hospitalBlocks" => $hospitalBlocks,
            "grandTotals" => $grandTotals,
            "filterLabel" => $filterLabel,
            "agingLabel" => $agingLabel,
            "agingFilter" => $agingFilter,
            "generatedAt" => Carbon::today()->format("F d, Y"),
        ])->setPaper("a4", "portrait");

        $filename = "Invoice-Aging-Report-" . Carbon::today()->format("Y-m-d") . ".pdf";

        return $pdf->download($filename);
    }
}
