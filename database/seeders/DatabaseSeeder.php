<?php

namespace Database\Seeders;

use App\Models\Hospital;
use App\Models\Invoice;
use App\Models\InvoiceHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->count(5)->create();

        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrator',
                'role' => 'purchasing',
                'password' => Hash::make('password'),
            ]
        );

        Hospital::factory()
            ->count(50)
            ->has(Invoice::factory()->count(15))
            ->create();

        $users = User::pluck('id')->toArray();

        Invoice::all()->each(function ($invoice) use ($users) {
            InvoiceHistory::factory()
                ->count(rand(1, 5))
                ->create([
                    'invoice_id' => $invoice->id,
                    'updated_by' => collect($users)->random(),
                ]);
        });
    }
}
