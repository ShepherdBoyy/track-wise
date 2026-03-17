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
        $filterStatus = $request->query("selected_status");
        $filterUser = $request->query("selected_user");
        $perPage = $request->query("per_page", 10);
        $sortBy = $request->query("sort_by", "updated_at");
        $sortOrder = $request->query("sort_order", "desc");

        $userAreas = Gate::allows("viewAll", Hospital::class) ? Area::all() : $user->areas;

        $users = User::query()
            ->where("username", "!=", "developer")
            ->when(!Gate::allows("viewAll", Hospital::class), function ($query) use ($user) {
                $userAreaIds = $user->areas->pluck("id");
                $query->whereHas("areas", function ($q) use ($userAreaIds) {
                    $q->whereIn("areas.id", $userAreaIds);
                });
            })
            ->orderBy("name")
            ->get(["id", "name"]);

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
                                            THEN DATEDIFF(due_date, date_closed)
                                        ELSE
                                            DATEDIFF(due_date, CURDATE())
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
            ->when($filterUser, function ($query) use ($filterUser) {
                $query->where("updated_by", $filterUser);
            })
            ->when($filterStatus, function ($query) use ($filterStatus) {
                $query->where("status", $filterStatus);
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
                                        THEN DATEDIFF(due_date, date_closed)
                                    ELSE
                                        DATEDIFF(due_date, CURDATE())
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
            "users" => $users,
            "filters" => [
                "search" => $searchQuery,
                "area" => $filterArea,
                "status" => $filterStatus,
                "user" => $filterUser,
                "sort_order" => $sortOrder,
                "sort_by" => $sortBy,
                "per_page" => $perPage
            ]
        ]);
    }
}
