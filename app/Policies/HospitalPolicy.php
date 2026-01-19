<?php

namespace App\Policies;

use App\Models\Hospital;
use App\Models\User;

class HospitalPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(["view_all_hospitals", "view_area_hospitals"]);
    }

    public function viewAll(User $user): bool
    {
        return $user->hasPermission("view_all_hospitals");
    }

    public function view(User $user, Hospital $hospital): bool
    {
        if ($user->hasPermission("view_all_hospitals")) {
            return true;
        } else if ($user->hasPermission("view_area_hospitals")) {
            return $user->areas()->where("areas.id", $hospital->area_id)->exists();
        } else {
            return false;
        }
    }

    public function create(User $user): bool
    {
        return $user->hasPermission("manage_hospitals");
    }

    public function update(User $user, Hospital $hospital): bool
    {
        return $user->hasPermission("manage_hospitals");
    }

    public function delete(User $user, Hospital $hospital): bool
    {
        return $user->hasPermission("manage_hospitals");
    }
}
