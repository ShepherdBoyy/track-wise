<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            "auth" => [
                "user" => $request->user()
            ],
            "permissions" => $user ? [
                "canAccessHospitals" => $user->hasAnyPermission(["view_all_hospitals", "view_area_hospitals"]),
                "canViewAllHospitals" => $user->hasPermission("view_all_hospitals"),
                "canViewAreaHospitals" => $user->hasPermission("view_area_hospitals"),
                "canManageHospitals" => $user->hasPermission("manage_hospitals"),
                "canViewInvoices" => $user->hasPermission("view_invoices"),
                "canManageInvoices" => $user->hasPermission("manage_invoices"),
                "canViewInvoiceHistory" => $user->hasPermission("view_invoice_history"),
                "canManageInvoiceHistory" => $user->hasPermission("create_invoice_history"),
                "canViewImportData" => $user->hasPermission("view_import_data"),
                "canImportData" => $user->hasPermission("import_data"),
                "canViewUsers" => $user->hasPermission("view_users"),
                "canManageUsers" => $user->hasPermission("manage_users"),
            ] : null
        ]);
    }
}
