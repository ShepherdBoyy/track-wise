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
            "hospital_number" => "sometimes|string|max:100",
            "hospital_name" => "sometimes|string|max:150",
            "area_id" => "sometimes|integer",
            "credit_term" => "required|string|max:100",
            "credit_limit" => "required|numeric"
        ];
    }
}
