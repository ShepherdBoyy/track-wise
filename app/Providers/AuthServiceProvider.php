<?php

namespace App\Providers;

use App\Models\Hospital;
use App\Policies\HospitalPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Hospital::class => HospitalPolicy::class
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
