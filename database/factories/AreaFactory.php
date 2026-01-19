<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AreaFactory extends Factory
{
    public function definition(): array
    {
        $areas = [
            "Central Luzon",
            "South Luzon",
            "North Luzon",
            "Manila",
            "North Luzon 2",
            "Bicol Region",
            "Cebu",
            "CDO",
            "Davao",
            "Iloilo",
            "Bacolod",
            "Zamboanga",
            "All"
        ];

        return [
            "area_name" => $this->faker->unique()->randomElement($areas),
        ];
    }

}
