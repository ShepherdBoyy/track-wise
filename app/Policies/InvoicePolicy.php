<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission("view_invoices");
    }

    public function view(User $user, Invoice $invoice): bool
    {
        return $user->hasPermission("view_invoices");
    }

    public function create(User $user): bool
    {
        return $user->hasPermission("manage_invoices");
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $user->hasPermission("manage_invoices");
    }

    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->hasPermission("manage_invoices");
    }
}
