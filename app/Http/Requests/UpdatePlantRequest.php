<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('plant')) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'species_id' => ['required', 'integer', 'exists:species,id'],
            'apodo' => ['required', 'string', 'max:60'],
            'ubicacion' => ['required', 'string', 'max:60'],
            'maceta' => ['required', Rule::in(['barro', 'plastico', 'suelo'])],
            'frecuencia_dias' => ['required', 'integer', 'min:1', 'max:255'],
            'fecha_adquisicion' => ['nullable', 'date'],
            'activa' => ['sometimes', 'boolean'],
        ];
    }
}
