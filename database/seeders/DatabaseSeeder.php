<?php

namespace Database\Seeders;

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
            ['name' => 'update_invoices', 'display_name' => 'Update', 'category' => 'invoices'],
            ['name' => 'view_import_data', 'display_name' => 'View', 'category' => 'import_data'],
            ['name' => 'manage_import_data', 'display_name' => 'Manage', 'category' => 'import_data'],
            ['name' => 'view_export', 'display_name' => 'View', 'category' => 'export'],
            ['name' => 'manage_export', 'display_name' => 'Manage', 'category' => 'export'],
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
            ['username' => 'developer'],
            [
                'name' => 'Web Developer',
                'password' => Hash::make('developer'),
                'visible_password' => Crypt::encryptString('developer'),
            ]
        );

        $allPermissionIds = Permission::pluck('id');
        $admin->permissions()->sync($allPermissionIds);
    }
}
