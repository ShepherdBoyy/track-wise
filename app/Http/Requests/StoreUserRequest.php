<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            "name" => "required|string|min:2|max:50",
            "role" => "required|in:Purchasing,Agent,Collector,Accounting",
            "area_id" => "required|integer",
            'username' => "required|string|min:4|max:30|regex:/^[A-za-z0-9.]+$/",
            "password" => "required|string|min:8"
        ];
    }
}
