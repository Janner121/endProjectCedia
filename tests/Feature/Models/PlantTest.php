<?php

use App\Models\Plant;
use App\Models\User;
use App\Models\Watering;

test('proximo riego is null when the plant has no waterings', function () {
    $plant = Plant::factory()->create(['frecuencia_dias' => 7]);

    expect($plant->proximo_riego)->toBeNull();
});

test('proximo riego adds frecuencia dias to the last watering date', function () {
    $plant = Plant::factory()->create(['frecuencia_dias' => 5]);
    Watering::factory()->for($plant)->create(['fecha' => '2026-01-01']);
    Watering::factory()->for($plant)->create(['fecha' => '2026-01-10']);

    expect($plant->proximo_riego->toDateString())->toBe('2026-01-15');
});

test('estado is atrasada when the plant has no waterings', function () {
    $plant = Plant::factory()->create();

    expect($plant->estado)->toBe('atrasada');
});

test('estado is hoy when proximo riego falls today', function () {
    $plant = Plant::factory()->create(['frecuencia_dias' => 3]);
    Watering::factory()->for($plant)->create(['fecha' => now()->subDays(3)]);

    expect($plant->estado)->toBe('hoy');
});

test('estado is atrasada when proximo riego already passed', function () {
    $plant = Plant::factory()->create(['frecuencia_dias' => 3]);
    Watering::factory()->for($plant)->create(['fecha' => now()->subDays(10)]);

    expect($plant->estado)->toBe('atrasada');
});

test('estado is al dia when proximo riego is in the future', function () {
    $plant = Plant::factory()->create(['frecuencia_dias' => 7]);
    Watering::factory()->for($plant)->create(['fecha' => now()]);

    expect($plant->estado)->toBe('al_dia');
});

test('pendientes scope includes plants without waterings and overdue plants but excludes plants al dia', function () {
    $sinRiego = Plant::factory()->create(['frecuencia_dias' => 5]);

    $atrasada = Plant::factory()->create(['frecuencia_dias' => 3]);
    Watering::factory()->for($atrasada)->create(['fecha' => now()->subDays(10)]);

    $alDia = Plant::factory()->create(['frecuencia_dias' => 7]);
    Watering::factory()->for($alDia)->create(['fecha' => now()]);

    $pendientes = Plant::pendientes()->pluck('id');

    expect($pendientes)
        ->toContain($sinRiego->id, $atrasada->id)
        ->not->toContain($alDia->id);
});

test('del usuario scope only returns plants belonging to the given user', function () {
    $user = User::factory()->create();
    $ownPlant = Plant::factory()->for($user)->create();
    $otherPlant = Plant::factory()->create();

    $result = Plant::delUsuario($user)->pluck('id');

    expect($result)
        ->toContain($ownPlant->id)
        ->not->toContain($otherPlant->id);
});
