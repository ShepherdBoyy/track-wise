<?php

namespace App\Http\Requests;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "username" => ["required", "string"],
            "password" => ["required", "string"]
        ];
    }

    public function throttleKey(): string
    {
        return mb_strtolower($this->input("username"))."|".$this->ip();
    }

    public function ensureIsNotRateLimited(): void
    {
        $key = $this->throttleKey();

        if (! RateLimiter::tooManyAttempts($key, 5)) {
            return;
        }

        Event::dispatch(new Lockout($this));

        $seconds = RateLimiter::availableIn($key);

        throw ValidationException::withMessages([
            "loginError" => "Too many login attempts.",
            "cooldownSeconds" => $seconds
        ]);
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->validated(), false)) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                "loginError" => "Invalid credentials. Please try again."
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }
}
