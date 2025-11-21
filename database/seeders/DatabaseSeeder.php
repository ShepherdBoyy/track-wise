<?php

namespace Database\Seeders;

use App\Models\Hospital;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->count(5)->create();

        User::firstOrCreate(
            ['username' => 'jheymarc'],
            [
                'name' => 'Jhey Marc',
                'role' => 'purchasing',
                'password' => Hash::make('password'),
            ]
        );

        // Hospitals with invoices
        Hospital::factory()
            ->count(50)
            ->has(Invoice::factory()->count(15))
            ->create();
    }
}