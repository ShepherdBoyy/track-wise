<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "name" => ["sometimes", "string", "max:50",],
            'username' => ["sometimes", "string", "max:30", "regex:/^[A-za-z0-9.]+$/", Rule::unique("users", "username")->ignore($this->user()->id)],
            "password" => ["sometimes", "nullable", "string", "min:8", "confirmed"],
        ];
    }
}
