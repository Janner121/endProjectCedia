<?php

namespace App\Http\Resources;

use App\Models\Species;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Species
 */
class SpeciesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre_comun' => $this->nombre_comun,
            'nombre_cientifico' => $this->nombre_cientifico,
            'frecuencia_riego_dias' => $this->frecuencia_riego_dias,
            'luz' => $this->luz,
            'cuidados' => $this->cuidados,
        ];
    }
}
