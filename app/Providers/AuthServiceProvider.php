<?php

namespace App\Providers;

use App\Models\Hospital;
use App\Models\Invoice;
use App\Models\InvoiceHistory;
use App\Models\User;
use App\Policies\HospitalPolicy;
use App\Policies\InvoiceHistoryPolicy;
use App\Policies\InvoicePolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Hospital::class => HospitalPolicy::class,
        Invoice::class => InvoicePolicy::class,
        InvoiceHistory::class => InvoiceHistoryPolicy::class,
        User::class => UserPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define("viewImportData", function (User $user) {
            return $user->hasPermission("view_import_data");
        });

        Gate::define("importData", function (User $user) {
            return $user->hasPermission("manage_import_data");
        });
    }
}
