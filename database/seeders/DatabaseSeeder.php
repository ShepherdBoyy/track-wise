<?php

namespace Database\Seeders;

use App\Models\Hospital;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()
            ->count(5)
            ->create();
        
        Hospital::factory()
            ->count(50)
            ->has(Invoice::factory()->count(15))
            ->create();
    }
}
