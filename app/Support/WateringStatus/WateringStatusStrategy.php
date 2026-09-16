<?php

namespace App\Support\WateringStatus;

use App\Models\Watering;

/**
 * Determines a plant's watering status (próximo riego / estado) from its
 * last watering and configured frequency.
 *
 * Different plant care regimes (fixed frequency, weather-dependent outdoor
 * plants, automatic irrigation that never goes "atrasada", etc.) can each
 * provide their own implementation without touching the Plant model.
 */
interface WateringStatusStrategy
{
    public function evaluate(?Watering $ultimoRiego, int $frecuenciaDias): WateringStatus;
}
