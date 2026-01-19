<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission("view_users");
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasPermission("view_users");
    }

    public function create(User $user): bool
    {
        return $user->hasPermission("manage_users");
    }

    public function update(User $user, User $model): bool
    {
        return $user->hasPermission("manage_users");
    }

    public function delete(User $user, User $model): bool
    {
        return $user->hasPermission("manage_users");
    }
}
