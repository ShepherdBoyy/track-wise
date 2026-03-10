<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'username',
        'password',
        "visible_password"
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function createdInvoices()
    {
        return $this->hasMany(Invoice::class, 'created_by');
    }

    public function invoiceHistories()
    {
        return $this->hasMany(InvoiceHistory::class, "updated_by");
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, "user_permissions");
    }

    public function areas()
    {
        return $this->belongsToMany(Area::class, "user_areas");
    }

    public function importHistories()
    {
        return $this->hasMany(ImportHistory::class);
    }

    public function hasPermission(string $permissionName)
    {
        return $this->permissions()->where("name", $permissionName)->exists();
    }

    public function hasAnyPermission(array $permissions)
    {
        return $this->permissions()->whereIn("name", $permissions)->exists();
    }

    public function getInitialsAttribute(): string
    {
        $words = explode(" ", trim($this->name));

        if (count($words) >= 3) {
            return strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1) . substr($words[2], 0, 1));
        } else if (count($words) == 2) {
            return strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1));
        } else {
            return strtoupper(substr($words[0], 0, 3));
        }
    }
}
