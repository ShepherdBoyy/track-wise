<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Hospital;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $baseQuery = Invoice::query();

        if (!Gate::allows("viewAll", Hospital::class)) {
            $userAreaIds = $user->areas->pluck("id");
            $baseQuery->whereHas("hospital", function ($query) use ($userAreaIds) {
                $query->whereIn("area_id", $userAreaIds);
            });
        }
        
        $totalOutstanding = (clone $baseQuery)
            ->whereNull("date_closed")
            ->sum("amount");
        
        $totalOverdue = (clone $baseQuery)
            ->whereNull("date_closed")
            ->whereRaw("CURDATE() > due_date")
            ->sum("amount");
        
        $overduePercentage = $totalOutstanding > 0
            ? round(($totalOverdue / $totalOutstanding) * 100, 1)
            : 0;

        $invoiceCounts = (clone $baseQuery)
            ->whereNull("date_closed")
            ->selectRaw("
                SUM(CASE WHEN CURDATE() <= due_date THEN 1 ELSE 0 END) as open_count,
                SUM(CASE WHEN CURDATE() > due_date THEN 1 ELSE 0 END) as overdue_count,
                COUNT(*) as total_count
            ")
            ->first();
        
        $avgInvoiceAmount = $invoiceCounts->total_count > 0
            ? $totalOutstanding / $invoiceCounts->total_count
            : 0;
        
        $agingBreakdown = $this->getAgingBreakdown($baseQuery);
        $topAreas = $this->getTopAreas($baseQuery);

        $topHospitals = $this->getTopHospitals($baseQuery);

        return Inertia::render("Home/Index", [
            "kpi" => [
                "totalOutstanding" => $totalOutstanding,
                "totalOverdue" => $totalOverdue,
                "overduePercentage" => $overduePercentage,
                "openCount" => $invoiceCounts->open_count ?? 0,
                "overdueCount" => $invoiceCounts->overdue_count ?? 0,
                "totalCount" => $invoiceCounts->total_count ?? 0,
                "avgInvoiceAmount" => round($avgInvoiceAmount, 2),
            ],
            "agingBreakdown" => $agingBreakdown,
            "topAreas" => $topAreas,
            "topHospitals" => $topHospitals
        ]);
    }

    private function getAgingBreakdown($baseQuery)
    {
        $subQuery = (clone $baseQuery)
            ->whereNull("date_closed")
            ->select("invoices.*")
            ->selectRaw("DATEDIFF(due_date, CURDATE()) as processing_days");
        
        $sql = $subQuery->toSql();
        $bindings = $subQuery->getBindings();

        $results = DB::table(DB::raw("({$sql}) as sub"))
            ->addBinding($bindings, "where")
            ->selectRaw("
                SUM(CASE WHEN processing_days > 0 AND date_closed IS NULL THEN 1 ELSE 0 END) as current_count,
                SUM(CASE WHEN processing_days > 0 AND date_closed IS NULL THEN amount ELSE 0 END) as current_amount,

                SUM(CASE WHEN processing_days BETWEEN -30 AND -1 AND date_closed IS NULL THEN 1 ELSE 0 END) as thirty_days_count,
                SUM(CASE WHEN processing_days BETWEEN -30 AND -1 AND date_closed IS NULL THEN amount ELSE 0 END) as thirty_days_amount,

                SUM(CASE WHEN processing_days BETWEEN -60 AND -31 AND date_closed IS NULL THEN 1 ELSE 0 END) as sixty_days_count,
                SUM(CASE WHEN processing_days BETWEEN -60 AND -31 AND date_closed IS NULL THEN amount ELSE 0 END) as sixty_days_amount,

                SUM(CASE WHEN processing_days BETWEEN -90 AND -61 AND date_closed IS NULL THEN 1 ELSE 0 END) as ninety_days_count,
                SUM(CASE WHEN processing_days BETWEEN -90 AND -61 AND date_closed IS NULL THEN amount ELSE 0 END) as ninety_days_amount,

                SUM(CASE WHEN processing_days <= -91 AND date_closed IS NULL THEN 1 ELSE 0 END) as over_ninety_count,
                SUM(CASE WHEN processing_days <= -91 AND date_closed IS NULL THEN amount ELSE 0 END) as over_ninety_amount
            ")
            ->first();
        
        return [
            [
                "category" => "Current",
                "count" => $results->current_count ?? 0,
                "amount" => $results->current_amount ?? 0,
            ],
            [
                "category" => "1-30 days",
                "count" => $results->thirty_days_count ?? 0,
                "amount" => $results->thirty_days_amount ?? 0,
            ],
            [
                "category" => "31-60 days",
                "count" => $results->sixty_days_count ?? 0,
                "amount" => $results->sixty_days_amount ?? 0,
            ],
            [
                "category" => "61-90 days",
                "count" => $results->ninety_days_count ?? 0,
                "amount" => $results->ninety_days_amount ?? 0,
            ],
            [
                "category" => "91 over",
                "count" => $results->over_ninety_count ?? 0,
                "amount" => $results->over_ninety_amount ?? 0,
            ],
        ];
    }

    private function getTopAreas($baseQuery)
    {
        $invoiceIds = (clone $baseQuery)
            ->whereNull("date_closed")
            ->pluck("id");

        $areaQuery = Area::select("areas.id", "areas.area_name")
            ->selectRaw("COUNT(DISTINCT invoices.id) as invoice_count")
            ->join("hospitals", "hospitals.area_id", "=", "areas.id")
            ->join("invoices", "invoices.hospital_id", "=", "hospitals.id")
            ->whereIn("invoices.id", $invoiceIds)
            ->groupBy("areas.id", "areas.area_name")
            ->having("invoice_count", ">", 0)
            ->orderByDesc("invoice_count")
            ->take(5)
            ->get();
        
        $colors = ['#55548F', '#FFC375', '#F28F77', '#53A3BD', '#B9E69E'];

        $totalInvoices = $areaQuery->sum("invoice_count");

        return $areaQuery->map(function ($area, $index) use ($colors, $totalInvoices) {
            return [
                "name" => $area->area_name,
                "value" => $area->invoice_count,
                "percentage" => $totalInvoices > 0
                    ? round(($area->invoice_count / $totalInvoices) * 100, 1)
                    : 0,
                "fill" => $colors[$index] ?? "#6b7280"
            ];
        })->toArray();
    }

    private function getTopHospitals($baseQuery)
    {
        $invoiceIds = (clone $baseQuery)
            ->whereNull("date_closed")
            ->pluck("id");
        
        $hospitals = Hospital::select(
                "hospitals.id",
                "hospitals.hospital_name",
                "hospitals.hospital_number",
                "areas.area_name",
                "areas.id as area_id"
            )
            ->join("areas", "hospitals.area_id", "=", "areas.id")
            ->selectRaw("
                SUM(invoices.amount) as outstanding_amount,
                COUNT(invoices.id) as invoice_count,
                SUM(CASE WHEN invoices.due_date < CURDATE() THEN 1 ELSE 0 END) as overdue_count,
                MAX(DATEDIFF(CURDATE(), invoices.due_date)) as oldest_overdue_days
            ")
            ->join("invoices", "hospitals.id", "=", "invoices.hospital_id")
            ->whereIn("invoices.id", $invoiceIds)
            ->groupBy("hospitals.id", "hospitals.hospital_name", "hospitals.hospital_number", "areas.area_name", "areas.id")
            ->orderByDesc("outstanding_amount")
            ->take(10)
            ->get();
        
        $areaColors = [
            '#8b5cf6', // purple
            '#3b82f6', // blue
            '#10b981', // green
            '#f59e0b', // amber
            '#ef4444', // red
            '#ec4899', // pink
            '#14b8a6', // teal
            '#f97316', // orange
        ];

        $areas = $hospitals->pluck("area_name")->unique()->values();
        $colorMap = [];
        foreach ($areas as $index => $areaName) {
            $colorMap[$areaName] = $areaColors[$index % count($areaColors)];
        }

        return $hospitals->map(function ($hospital, $index) use ($colorMap) {
            $overduePercentage = $hospital->invoice_count > 0
                ? round(($hospital->overdue_count / $hospital->invoice_count) * 100, 0)
                : 0;
        
            $status = $overduePercentage > 70 ? "critical" : ($overduePercentage > 30 ? "warning" : "ok");

            return [
                "rank" => $index + 1,
                "id" => $hospital->id,
                "hospital_number" => $hospital->hospital_number,
                "hospital_name" => $hospital->hospital_name,
                "area_name" => $hospital->area_name,
                "area_color" => $colorMap[$hospital->area_name] ?? "#6b7280",
                "outstanding_amount" => $hospital->outstanding_amount,
                "invoice_count" => $hospital->invoice_count,
                "overdue_count" => $hospital->overdue_count,
                "overdue_percentage" => $overduePercentage,
                "oldest_overdue_days" => $hospital->oldest_overdue_days ?? 0,
                "status" => $status
            ];
        })->toArray();
    }
}
