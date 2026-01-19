<?php

namespace App\Policies;

use App\Models\User;

class ImportDataPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission("view_import_data");
    }

    public function create(User $user): bool
    {
        return $user->hasPermission("import_data");
    }
}
