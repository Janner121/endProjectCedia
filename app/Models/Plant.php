<?php

namespace App\Models;

use App\Support\WateringStatus\WateringStatus;
use App\Support\WateringStatus\WateringStatusStrategy;
use Carbon\CarbonInterface;
use Database\Factories\PlantFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $species_id
 * @property string $apodo
 * @property string $ubicacion
 * @property string $maceta
 * @property int $frecuencia_dias
 * @property Carbon|null $fecha_adquisicion
 * @property bool $activa
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read CarbonInterface|null $proximo_riego
 * @property-read string $estado
 */
#[Fillable(['user_id', 'species_id', 'apodo', 'ubicacion', 'maceta', 'frecuencia_dias', 'fecha_adquisicion', 'activa'])]
class Plant extends Model
{
    /** @use HasFactory<PlantFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'frecuencia_dias' => 'integer',
            'fecha_adquisicion' => 'date',
            'activa' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Species, $this>
     */
    public function species(): BelongsTo
    {
        return $this->belongsTo(Species::class);
    }

    /**
     * @return HasMany<Watering, $this>
     */
    public function waterings(): HasMany
    {
        return $this->hasMany(Watering::class);
    }

    /**
     * @return HasOne<Watering, $this>
     */
    public function ultimoRiego(): HasOne
    {
        return $this->hasOne(Watering::class)->latestOfMany('fecha');
    }

    /**
     * @return Attribute<CarbonInterface|null, never>
     */
    protected function proximoRiego(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->wateringStatus()->proximoRiego,
        );
    }

    /**
     * @return Attribute<string, never>
     */
    protected function estado(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->wateringStatus()->estado,
        );
    }

    /**
     * Delegates to the bound WateringStatusStrategy (see AppServiceProvider)
     * so how "próximo riego" / "estado" are derived can change per care
     * regime without touching this model.
     */
    protected function wateringStatus(): WateringStatus
    {
        return app(WateringStatusStrategy::class)->evaluate($this->ultimoRiego, $this->frecuencia_dias);
    }

    /**
     * @param  Builder<Plant>  $query
     */
    #[Scope]
    protected function pendientes(Builder $query): void
    {
        $vencido = match ($this->getConnection()->getDriverName()) {
            'sqlite' => "date(fecha, '+' || plants.frecuencia_dias || ' days') <= date('now')",
            default => 'date_add(fecha, interval plants.frecuencia_dias day) <= curdate()',
        };

        $query->where(function (Builder $query) use ($vencido) {
            $query->whereDoesntHave('waterings')
                ->orWhereHas('ultimoRiego', function (Builder $query) use ($vencido) {
                    $query->whereRaw($vencido);
                });
        });
    }

    /**
     * @param  Builder<Plant>  $query
     */
    #[Scope]
    protected function delUsuario(Builder $query, User $user): void
    {
        $query->whereBelongsTo($user);
    }
}
