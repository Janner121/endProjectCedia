<?php

namespace App\Http\Resources;

use App\Models\Watering;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Watering
 */
class WateringResource extends JsonResource
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
            'fecha' => $this->fecha->toDateString(),
            'cantidad_ml' => $this->cantidad_ml,
            'fertilizante' => $this->fertilizante,
            'observacion' => $this->observacion,
        ];
    }
}
