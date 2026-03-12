<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHospitalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "hospital_number" => "required|string|max:100|unique:hospitals,hospital_number",
            "hospital_name" => "required|string|max:150|regex:/^[A-Za-z](?:[A-Za-z\s\.\'\-,]*[A-Za-z])?$/",
            "area_id" => "required|integer",
            "credit_terms" => "required|string|max:100",
            "credit_limit" => "required|numeric"
        ];
    }
}
