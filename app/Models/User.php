<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

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

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, "user_permissions");
    }

    public function areas()
    {
        return $this->belongsToMany(Area::class, "user_areas");
    }

    public function hasPermission(string $permissionName)
    {
        return $this->permissions()->where("name", $permissionName)->exists();
    }

    public function hasAnyPermission(array $permissions)
    {
        return $this->permissions()->whereIn("name", $permissions)->exists();
    }

    public function hasAllPermissions(array $permissions)
    {
        return $this->permissions()->whereIn("name", $permissions)->count() === count($permissions);
    }

    public function canViewAllHospitals()
    {
        return $this->hasPermission("view_all_hospitals");
    }

    public function hasAreaRestrictions()
    {
        return !$this->canViewAllHospitals() && $this->areas()->exists();
    }
}
