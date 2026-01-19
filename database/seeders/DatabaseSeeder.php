<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Hospital;
use App\Models\Invoice;
use App\Models\InvoiceHistory;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
    $areas = Area::factory()->count(12)->create();

    // Create all permissions first (if they don't exist)
    $permissions = [
        ['name' => 'view_all_hospitals', 'display_name' => 'View All Hospitals', 'category' => 'hospitals'],
        ['name' => 'view_area_hospitals', 'display_name' => 'View Area Hospitals', 'category' => 'hospitals'],
        ['name' => 'manage_hospitals', 'display_name' => 'Manage Hospitals', 'category' => 'hospitals'],
        ['name' => 'view_invoices', 'display_name' => 'View Invoices', 'category' => 'invoices'],
        ['name' => 'view_invoice_history', 'display_name' => 'View Invoice History', 'category' => 'invoice_history'],
        // ['name' => 'create_invoice_history', 'display_name' => 'Create Invoice History', 'category' => 'invoice_history'],
        // ['name' => 'view_import_data', 'display_name' => 'View Import Data Page', 'category' => 'import_data'],
        // ['name' => 'import_data', 'display_name' => 'Import Data', 'category' => 'import_data'],
        ['name' => 'view_users', 'display_name' => 'View Users', 'category' => 'users'],
        // ['name' => 'manage_users', 'display_name' => 'Manage Users', 'category' => 'users'],
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(
            ['name' => $permission['name']],
            $permission
        );
    }

    // Create SINGLE Admin User
    $admin = User::firstOrCreate(
        ['username' => 'admin'],
        [
            'name' => 'Admin User',
            'password' => Hash::make('password'),
            'visible_password' => Crypt::encryptString('password'),
        ]
    );

    // Attach ALL permissions to admin
    $allPermissionIds = Permission::pluck('id');
    $admin->permissions()->sync($allPermissionIds);

    // Optionally: Attach ALL areas to admin (if needed for testing)
    $admin->areas()->sync($areas->pluck('id'));

    // Create Hospitals + Invoices
    foreach ($areas as $area) {
        Hospital::factory()
            ->count(30)
            ->has(
                Invoice::factory()
                    ->count(15)
                    ->state(fn () => [
                        'created_by' => $admin->id,
                    ])
            )
            ->create([
                'area_id' => $area->id,
            ]);
    }

    // Create Invoice Histories
    Invoice::all()->each(function ($invoice) use ($admin) {
        InvoiceHistory::factory()->create([
            'invoice_id' => $invoice->id,
            'updated_by' => $admin->id,
        ]);
    });

    //     $areas = Area::factory()->count(13)->create();

    //     $roles = [
    //         ['username' => 'admin', 'name' => 'Admin User', 'role' => 'admin'],
    //         ['username' => 'purchasing', 'name' => 'Purchasing User', 'role' => 'purchasing'],
    //         ['username' => 'collector', 'name' => 'Collector User', 'role' => 'collector'],
    //         ['username' => 'agent', 'name' => 'Agent User', 'role' => 'agent'],
    //         ['username' => 'accounting', 'name' => 'Accounting User', 'role' => 'accounting'],
    //         ['username' => 'user1', 'name' => 'User 1', 'role' => 'staff'],
    //         ['username' => 'user2', 'name' => 'User 2', 'role' => 'staff'],
    //         ['username' => 'user3', 'name' => 'User 3', 'role' => 'staff'],
    //         ['username' => 'user4', 'name' => 'User 4', 'role' => 'staff'],
    //         ['username' => 'user5', 'name' => 'User 5', 'role' => 'staff'],
    //     ];

    //     $users = [];

    //     foreach ($roles as $index => $userData) {
    //         $users[] = User::firstOrCreate(
    //             ['username' => $userData['username']],
    //             [
    //                 'name' => $userData['name'],
    //                 'role' => $userData['role'],
    //                 'password' => Hash::make('password'),
    //                 'visible_password' => Crypt::encryptString('password'),
    //                 'area_id' => $areas[$index]->id,
    //             ]
    //         );
    //     }

    //     foreach ($areas as $area) {
    //         $hospitals = Hospital::factory()
    //             ->count(30)
    //             ->has(
    //                 Invoice::factory()
    //                     ->count(15)
    //                     ->state(fn() => ['created_by' => collect($users)->random()->id])
    //             )
    //             ->create([
    //                 'area_id' => $area->id,
    //             ]);
    //     }

    //     Invoice::all()->each(function ($invoice) use ($users) {
    //         InvoiceHistory::factory()->create([
    //             'invoice_id' => $invoice->id,
    //             'updated_by' => collect($users)->random()->id,
    //         ]);
    //     });

    

    }

}
