<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Hospital;
use App\Models\Invoice;
use App\Models\InvoiceHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class UpdatesController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $searchQuery = $request->query("search");
        $filterArea = $request->query("selected_area");
        $perPage = $request->query("per_page", 10);
        $minAmount = $request->query("min_amount");
        $maxAmount = $request->query("max_amount");
        $sortBy = $request->query("sort_by", "hospital_name");
        $sortOrder = $request->query("sort_order", "asc");
        $filterProcessingDays = $request->query("processing_days");

        if ($filterProcessingDays === null) {
            $filterProcessingDays = ["61-90-days", "91-over"];
        } elseif ($filterProcessingDays === "none") {
            $filterProcessingDays = [];
        } else {
            $filterProcessingDays = is_array($filterProcessingDays)
                ? $filterProcessingDays
                : [$filterProcessingDays];
        }

        $userAreas = Gate::allows("viewAll", Hospital::class) ? Area::all() : $user->areas;

        // Get the latest history of an invoice
        $latestHistoryIds = InvoiceHistory::query()
            ->select("invoice_id", DB::raw("MAX(id) as latest_id"))
            ->groupBy("invoice_id");
        
        $latestUpdates = InvoiceHistory::query()
            ->joinSub($latestHistoryIds, "latest", function ($join) {
                $join->on("invoice_histories.id", "=", "latest.latest_id");
            })
            ->with([
                "invoice" => function ($query) {
                    $query->select("invoices.*")
                        ->with([
                            "hospital.area",
                            "history" => function ($q) {
                                $q->with(["updater"])->orderBy("created_at", "desc");
                            }
                        ])
                        ->addSelect([
                            "processing_days" => function ($subQuery) {
                                $subQuery->selectRaw("
                                    CASE
                                        WHEN date_closed IS NOT NULL
                                            THEN DATEDIFF(date_closed, due_date)
                                        ELSE
                                            DATEDIFF(CURDATE(), due_date)
                                    END
                                ");
                            }
                        ]);
                },
                "updater"
            ])
            ->when($searchQuery, function ($query) use ($searchQuery) {
                $normalizedAmount = str_replace(",", "", $searchQuery);

                $query->whereHas("invoice", function ($q) use($searchQuery, $normalizedAmount) {
                    $q->where("invoice_number", "like", "%{$searchQuery}%");

                    if (is_numeric($normalizedAmount)) {
                        $q->orWhereRaw("CAST(amount as CHAR) LIKE ?", ["%{$normalizedAmount}%"]);
                    }
                })
                ->orWhereHas("invoice.hospital", function ($q) use ($searchQuery) {
                    $q->where("hospital_name", "like", "%{$searchQuery}%")
                        ->orWhere("hospital_number", "like", "%{$searchQuery}%");
                });
            })
            ->whereHas("invoice.hospital", function ($query) use ($user, $filterArea) {
                if (!Gate::allows("viewAll", Hospital::class)) {
                    $userAreaIds = $user->areas->pluck("id");
                    $query->whereIn("area_id", $userAreaIds);
                }

                if ($filterArea) {
                    $query->where("area_id", $filterArea);
                }
            })
            ->when(!empty($filterProcessingDays), function ($query) use ($filterProcessingDays) {
                $query->whereHas("invoice", function ($q) use ($filterProcessingDays) {
                    $processingDaysRaw = "
                        CASE
                            WHEN date_closed IS NOT NULL
                                THEN DATEDIFF(date_closed, due_date)
                            ELSE
                                DATEDIFF(CURDATE(), due_date)
                        END
                    ";

                    $q->where(function ($sub) use ($filterProcessingDays, $processingDaysRaw) {
                        foreach ($filterProcessingDays as $days) {
                            match ($days) {
                                "current" => $sub->orWhereRaw("({$processingDaysRaw}) <= 0"),
                                "30-days" => $sub->orWhereRaw("({$processingDaysRaw}) BETWEEN 0 AND 30"),
                                "31-60-days" => $sub->orWhereRaw("({$processingDaysRaw}) BETWEEN 31 AND 60"),
                                "61-90-days" => $sub->orWhereRaw("({$processingDaysRaw}) BETWEEN 61 AND 90"),
                                "91-over" => $sub->orWhereRaw("({$processingDaysRaw}) >= 90"),
                                default => null
                            };
                        }
                    });
                });
            })
            ->when($minAmount !== null && $minAmount !== "negative", function ($query) use ($minAmount) {
                $query->whereHas("invoice", function ($q) use ($minAmount) {
                    $q->where("amount", ">=", $minAmount);
                });
            })
            ->when($maxAmount !== null, function ($query) use ($maxAmount) {
                $query->whereHas("invoice", function ($q) use ($maxAmount) {
                    $q->where("amount", "<=", $maxAmount);
                });
            })
            ->when($sortBy, function ($query) use ($sortBy, $sortOrder) {
                switch ($sortBy) {
                    case "hospital_name":
                        $query->orderBy(
                            Hospital::select("hospital_name")
                                ->join("invoices", "hospitals.id", "=", "invoices.hospital_id")
                                ->whereColumn("invoices.id", "invoice_histories.invoice_id")
                                ->limit(1),
                            $sortOrder
                        );
                        break;
                    
                    case "invoice_number":
                        $query->orderBy(
                            Invoice::select("invoice_number")
                                ->whereColumn("invoices.id", "invoice_histories.invoice_id")
                                ->limit(1),
                            $sortOrder
                        );
                        break;
                    
                    case "processing_days":
                        $query->orderByRaw("
                            (
                                SELECT CASE
                                    WHEN date_closed IS NOT NULL
                                        THEN DATEDIFF(date_closed, due_date)
                                    ELSE
                                        DATEDIFF(CURDATE(), due_date)
                                END
                                FROM invoices
                                WHERE invoices.id = invoice_histories.invoice_id
                                LIMIT 1     
                            ) $sortOrder
                        ");
                        break;
                    
                    case "updated_by":
                        $query->orderBy(
                            User::select("name")
                                ->whereColumn("id", "invoice_histories.updated_by")
                                ->limit(1),
                            $sortOrder
                        );
                        break;

                    case "amount":
                        $query->orderBy(
                            Invoice::select("amount")
                                ->whereColumn("invoices.id", "invoice_histories.invoice_id")
                                ->limit(1),
                            $sortOrder
                        );
                        break;

                    default:
                        $query->orderBy("invoice_histories.updated_at", $sortOrder);
                }
            })
            ->paginate($perPage)
            ->withQueryString();
        
        return Inertia::render("Updates/Index", [
            "latestUpdates" => $latestUpdates,
            "userAreas" => $userAreas,
            "filters" => [
                "search" => $searchQuery,
                "area" => $filterArea,
                "processing_days" => $filterProcessingDays,
                "sort_order" => $sortOrder,
                "sort_by" => $sortBy,
                "per_page" => $perPage,
                "min_amount" => $minAmount,
                "max_amount" => $maxAmount
            ]
        ]);
    }
}
