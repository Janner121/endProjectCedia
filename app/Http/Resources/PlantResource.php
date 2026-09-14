<?php

namespace App\Http\Resources;

use App\Models\Plant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Plant
 */
class PlantResource extends JsonResource
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
            'apodo' => $this->apodo,
            'ubicacion' => $this->ubicacion,
            'maceta' => $this->maceta,
            'frecuencia_dias' => $this->frecuencia_dias,
            'fecha_adquisicion' => $this->fecha_adquisicion?->toDateString(),
            'activa' => $this->activa,
            'estado' => $this->estado,
            'proximo_riego' => $this->proximo_riego?->toDateString(),
            'species' => SpeciesResource::make($this->whenLoaded('species')),
            'waterings' => WateringResource::collection($this->whenLoaded('waterings')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
