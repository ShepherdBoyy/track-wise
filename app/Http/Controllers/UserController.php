<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::orderBy("name")
            ->paginate(10);

        $users->getCollection()->transform(function ($user) {
            $user->plain_password = Crypt::decryptString($user->visible_password);
            return $user;
        });

        return Inertia::render("UserManagement/Index", [
            "users" => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        if (!empty($validated["password"])) {
            $plainPassword = $validated["password"];

            $validated["password"] = Hash::make($plainPassword);
            $validated["visible_password"] = Crypt::encryptString($plainPassword);
        } else {
            unset($validated["password"]);
            unset($validated["visible_password"]);
        }

        User::create($validated);

        return back()->with("success", true);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, string $id)
    {
        $user = User::findOrfail($id);

        $validated = $request->validated();

        if (!empty($validated["password"])) {
            $plainPassword = $validated["password"];

            $validated["password"] = Hash::make($plainPassword);
            $validated["visible_password"] = Crypt::encryptString($plainPassword);
        } else {
            unset($validated["password"]);
            unset($validated["visible_password"]);
        }

        $user->update($validated);

        return back()->with("success", true);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
