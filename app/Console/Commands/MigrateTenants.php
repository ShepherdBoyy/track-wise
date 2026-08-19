<?php

namespace App\Console\Commands;

use App\Models\Company;
use Database\Seeders\TenantDatabaseSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class MigrateTenants extends Command
{
    protected $signature = 'tenants:migrate {--fresh : Drop all tables first} {--seed : Run seeders after migrating} {--company= : Only run against a single company\'s slug (e.g. pmc, panamed)}';

    protected $description = 'Run the tenant migrations (database/migrations/tenant) against every company\'s own database.';

    public function handle(): int
    {
        $companies = Company::all();

        if ($slug = $this->option("company")) {
            $companies = $companies->where("slug", $slug);

            if ($companies->isEmpty()) {
                $this->error("No company found with slug \"{$slug}\".");
                return self::FAILURE;
            }
        }

        if ($companies->isEmpty()) {
            $this->error("No companies found. Run the CompanySeeder first.");
            return self::FAILURE;
        }

        foreach ($companies as $company) {
            if ($this->option("fresh") && $company->slug === "pmc") {
                $this->error("Refusing to run --fresh against the 'pmc' company. This would drop live production data.");
                return self::FAILURE;
            }

            $this->info("Migrating tenant database for {$company->name} ({$company->database})...");

            DB::connection("mysql")->statement(
                "CREATE DATABASE IF NOT EXISTS `{$company->database}`"
            );

            Config::set("database.connections.tenant.database", $company->database);
            DB::purge("tenant");

            $command = $this->option("fresh") ? "migrate:fresh" : "migrate";

            Artisan::call($command, [
                "--database" => "tenant",
                "--path" => "database/migrations/tenant",
                "--realpath" => false,
                "--force" => true,
            ]);

            $this->line(Artisan::output());

            if ($this->option("seed")) {
                Artisan::call("db:seed", [
                    "--database" => "tenant",
                    "--class" => TenantDatabaseSeeder::class,
                    "--force" => true,
                ]);

                $this->line(Artisan::output());
            }
        }

        $this->info("All tenant databases migrated.");

        return self::SUCCESS;
    }
}