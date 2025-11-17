<?php

namespace Database\Factories;

use App\Models\Hospital;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{    
    public function definition(): array
    {
        $statuses = ["open", "overdue", "closed"];
        $status = $this->faker->randomElement($statuses);
        $transactionDate = $this->faker->dateTimeBetween("-1 year", "now");

        return [
            "hospital_id" => Hospital::factory(),
            "invoice_number" => "INV-" . $this->faker->unique()->numerify("######"),
            "amount" => $this->faker->randomFloat(2, 100, 50000),
            "description" => $this->faker->paragraph(3),
            "status" => $status,
            "transaction_date" => $transactionDate,
            "date_closed" => $status === "closed" ? $this->faker->dateTimeBetween($transactionDate, "now") : null,
            "created_by" => User::factory(),
            "updated_by" => User::factory()
        ];
    }
}
