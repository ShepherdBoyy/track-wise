<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

// class InvoiceHistoryFactory extends Factory
// {
//     public function definition(): array
//     {
//         return [
//             'invoice_id' => null,
//             'updated_by' => User::inRandomOrder()->first()->id ?? User::factory(),
//             'description' => $this->faker->sentence(),
//         ];
//     }
// }

class InvoiceHistoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'invoice_id' => null, // set in seeder
            'updated_by' => null, // set in seeder
            'description' => $this->faker->sentence(),
        ];
    }
}