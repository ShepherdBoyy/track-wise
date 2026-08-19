<?php

namespace App\Http\Middleware;

use App\Models\Company;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class ResolveCompany
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $company = Company::where("domain", $host)->first();

        if (!$company) {
            $company = Company::where("slug", "pmc")->first();
        }

        if ($company) {
            Config::set("database.connections.tenant.database", $company->database);
            DB::purge("tenant");
            DB::setDefaultConnection("tenant");
        }

        app()->instance("currentCompany", $company);

        return $next($request);
    }
}