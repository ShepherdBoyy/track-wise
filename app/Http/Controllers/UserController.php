<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Area;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize("viewAny", User::class);

        $searchQuery = $request->query("search");
        $perPage = $request->query("per_page", 10);
        $sortBy = $request->query("sort_by");
        $sortOrder = $request->query("sort_order", "asc");

        $users = User::query()
            ->with(["permissions", "areas"])
            ->when($searchQuery, function ($query) use ($searchQuery) {
                $query->where("name", "like", "%{$searchQuery}%");
            })
            ->when($sortBy, function ($query) use ($sortBy, $sortOrder) {
                    if ($sortBy === "area_name") {
                        $query->join("areas", "users.area_id", "=", "areas.id")
                            ->orderBy("areas.area_name", $sortOrder)
                            ->select("users.*");
                    } else {
                        $query->orderBy($sortBy, $sortOrder);
                    }   
                },
            )
            ->paginate($perPage)
            ->withQueryString();
        
        $areas = Area::all();
        $permissions = Permission::all()->groupBy("category");

        $users->getCollection()->transform(function ($user) {
            $user->plain_password = Crypt::decryptString($user->visible_password);
            $user->permission_ids = $user->permissions->pluck("id")->toArray();
            $user->area_ids = $user->areas->pluck("id")->toArray();
            return $user;
        });

        return Inertia::render("UserManagement/Index", [
            "users" => $users,
            "areas" => $areas,
            "permissionList" => $permissions,
            "filters" => [
                "sort_by" => $sortBy,
                "sort_order" => $sortOrder
            ]
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        Gate::authorize("create", User::class);

        $validated = $request->validated();

        $plainPassword = $validated["password"];
        $validated["password"] = Hash::make($plainPassword);
        $validated["visible_password"] = Crypt::encryptString($plainPassword);

        $user = User::create([
            "name" => $validated["name"],
            "username" => $validated["username"],
            "password" => $validated["password"],
            "visible_password" => $validated["visible_password"]
        ]);

        $user->permissions()->attach($validated["permissions"]);

        if (!empty($validated["areas"])) {
            $user->areas()->attach($validated["areas"]);
        }

        return back()->with("success", true);
    }

    public function update(UpdateUserRequest $request, string $id)
    {
        $user = User::findOrfail($id);

        Gate::authorize("update", $user);

        $validated = $request->validated();

        $plainPassword = $validated["password"];
        $validated["password"] = Hash::make($plainPassword);
        $validated["visible_password"] = Crypt::encryptString($plainPassword);

        $user->update([
            "name" => $validated["name"],
            "username" => $validated["username"],
            "password" => $validated["password"],
            "visible_password" => $validated["visible_password"]
        ]);

        $user->permissions()->sync($validated["permissions"]);

        if(!empty($validated["areas"])) {
            $user->areas()->sync($validated["areas"]);
        }

        return back()->with("success", true);
    }

    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        Gate::authorize("delete", $user);

        $user->permissions()->detach();
        $user->areas()->detach();

        $user->delete();

        return back()->with("success", true);
    }
}
