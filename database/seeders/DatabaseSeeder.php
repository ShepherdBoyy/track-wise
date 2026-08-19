<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Company::updateOrCreate(
            ['slug' => 'pmc'],
            [
                'name' => 'Progressive Medical Corp.',
                'domain' => env('PMC_DOMAIN', 'pmc.trackwise.test'),
                'database' => env('PMC_DATABASE', 'trackwise_pmc'),
                'address_line1' => '200 C. Raymundo Avenue Caniogan,',
                'address_line2' => 'Pasig City 1606 Philippines',
                'logo_path' => 'images/pmc-logo.jpg',
                'favicon_path' => 'images/pmc-favicon.png',
                'color_one' => '#55548F',
                'color_two' => '#FFC375',
                'color_three' => '#F28F77',
                'color_four' => '#53A3BD',
                'color_five' => '#B9E69E',
            ]
        );

        Company::updateOrCreate(
            ['slug' => 'panamed'],
            [
                'name' => 'Panamed Philippines Inc.',
                'domain' => env('PANAMED_DOMAIN', 'panamed.trackwise.test'),
                'database' => env('PANAMED_DATABASE', 'trackwise_panamed'),
                'address_line1' => '5F Meriton One Building 1668 Quezon Avenue',
                'address_line2' => 'Quezon City 1103 Philippines',
                'logo_path' => 'images/panamed-logo.png',
                'favicon_path' => 'images/panamed-favicon.png',
                'color_one' => '#1F6F5C',
                'color_two' => '#F2B134',
                'color_three' => '#ED553B',
                'color_four' => '#3C91E6',
                'color_five' => '#9BC53D',
            ]
        );
    }
}
