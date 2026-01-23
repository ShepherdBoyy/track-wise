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
    $permissions = [
        ['name' => 'view_all_hospitals', 'display_name' => 'View All Areas', 'category' => 'hospitals'],
        ['name' => 'view_area_hospitals', 'display_name' => 'View Specific Area', 'category' => 'hospitals'],
        ['name' => 'manage_hospitals', 'display_name' => 'Manage', 'category' => 'hospitals'],
        ['name' => 'view_invoices', 'display_name' => 'View', 'category' => 'invoices'],
        ['name' => 'manage_invoices', 'display_name' => 'Manage', 'category' => 'invoices'],
        ['name' => 'view_invoice_history', 'display_name' => 'View', 'category' => 'invoice_history'],
        ['name' => 'manage_invoice_history', 'display_name' => 'Manage', 'category' => 'invoice_history'],
        ['name' => 'view_import_data', 'display_name' => 'View', 'category' => 'import_data'],
        ['name' => 'manage_import_data', 'display_name' => 'Manage', 'category' => 'import_data'],
        ['name' => 'view_users', 'display_name' => 'View', 'category' => 'users'],
        ['name' => 'manage_users', 'display_name' => 'Manage', 'category' => 'users'],
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(
            ['name' => $permission['name']],
            $permission
        );
    }

    $admin = User::firstOrCreate(
        ['username' => 'admin'],
        [
            'name' => 'Admin User',
            'password' => Hash::make('password'),
            'visible_password' => Crypt::encryptString('password'),
        ]
    );

    $allPermissionIds = Permission::pluck('id');
    $admin->permissions()->sync($allPermissionIds);

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
