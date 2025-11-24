<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHospitalRequest extends FormRequest
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
            "hospital_number" => "sometimes|string|max:255",
            "hospital_name" => "sometimes|string|max:255|regex:/^[A-Za-z](?:[A-Za-z\s\.\'\-,]*[A-Za-z])?$/"
        ];
    }
}
