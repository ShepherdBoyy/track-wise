<?php

namespace App\Policies;

use App\Models\User;

class NavigationPolicy
{
    public function viewHospitals(User $user): bool
    {
        return in_array($user->role, ["admin", "purchasing", "collector", "accounting", "agent"]);
    }

    public function viewImportData(User $user): bool
    {
        return in_array($user->role, ["admin", "purchasing", "collector", "accounting"]);
    }

    public function viewUserManagement(User $user): bool
    {
        return $user->role === "admin";
    }
}
