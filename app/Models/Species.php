<?php

namespace App\Models;

use Database\Factories\SpeciesFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $nombre_comun
 * @property string|null $nombre_cientifico
 * @property int $frecuencia_riego_dias
 * @property string $luz
 * @property string|null $cuidados
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['nombre_comun', 'nombre_cientifico', 'frecuencia_riego_dias', 'luz', 'cuidados'])]
class Species extends Model
{
    /** @use HasFactory<SpeciesFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'frecuencia_riego_dias' => 'integer',
        ];
    }

    /**
     * @return HasMany<Plant, $this>
     */
    public function plants(): HasMany
    {
        return $this->hasMany(Plant::class);
    }
}
