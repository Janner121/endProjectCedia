<?php

namespace App\Models;

use Database\Factories\WateringFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $plant_id
 * @property Carbon $fecha
 * @property int|null $cantidad_ml
 * @property bool $fertilizante
 * @property string|null $observacion
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['plant_id', 'fecha', 'cantidad_ml', 'fertilizante', 'observacion'])]
class Watering extends Model
{
    /** @use HasFactory<WateringFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'cantidad_ml' => 'integer',
            'fertilizante' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Plant, $this>
     */
    public function plant(): BelongsTo
    {
        return $this->belongsTo(Plant::class);
    }
}
