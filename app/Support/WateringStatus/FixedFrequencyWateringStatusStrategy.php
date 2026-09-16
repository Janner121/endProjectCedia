<?php

namespace App\Support\WateringStatus;

use App\Models\Watering;

/**
 * The default strategy: próximo riego = fecha del último riego + frecuencia_dias.
 * Sin riegos registrados se considera "atrasada", porque el sistema no tiene
 * una fecha base desde la cual calcular el próximo riego.
 */
class FixedFrequencyWateringStatusStrategy implements WateringStatusStrategy
{
    public function evaluate(?Watering $ultimoRiego, int $frecuenciaDias): WateringStatus
    {
        if ($ultimoRiego === null) {
            return new WateringStatus(null, 'atrasada');
        }

        $proximoRiego = $ultimoRiego->fecha->copy()->addDays($frecuenciaDias);

        $estado = match (true) {
            $proximoRiego->isToday() => 'hoy',
            $proximoRiego->isPast() => 'atrasada',
            default => 'al_dia',
        };

        return new WateringStatus($proximoRiego, $estado);
    }
}
