<?php

namespace App\Providers;

use App\Models\Hospital;
use App\Models\Invoice;
use App\Models\User;
use App\Policies\HospitalPolicy;
use App\Policies\InvoicePolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Hospital::class => HospitalPolicy::class,
        Invoice::class => InvoicePolicy::class,
        User::class => UserPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
