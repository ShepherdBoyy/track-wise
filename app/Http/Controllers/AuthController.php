<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function index()
    {
        return Inertia::render("Authentication/Login");
    }

    public function store(AuthRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended("/updates");
    }

    public function update(UpdateProfileRequest $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validated();

        if (array_key_exists("password", $validated)) {
            $plainPassword = $validated["password"];
            $validated["password"] = Hash::make($plainPassword);
            $validated["visible_password"] = Crypt::encryptString($plainPassword);
        }

        $user->fill($validated);
        $user->save();

        return back()->with("success", true);
    }

    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();
        
        return redirect('/login');
    }
}
