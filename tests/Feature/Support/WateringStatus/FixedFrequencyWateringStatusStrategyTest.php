<?php

use App\Models\Watering;
use App\Support\WateringStatus\FixedFrequencyWateringStatusStrategy;

test('marks a plant with no waterings as atrasada with no proximo riego', function () {
    $strategy = new FixedFrequencyWateringStatusStrategy;

    $status = $strategy->evaluate(null, 7);

    expect($status->estado)->toBe('atrasada')
        ->and($status->proximoRiego)->toBeNull();
});

test('computes proximo riego as ultimo riego plus frecuencia dias', function () {
    $strategy = new FixedFrequencyWateringStatusStrategy;
    $ultimoRiego = new Watering(['fecha' => '2026-01-01']);

    $status = $strategy->evaluate($ultimoRiego, 5);

    expect($status->proximoRiego->toDateString())->toBe('2026-01-06');
});

test('marks a plant as hoy when proximo riego falls today', function () {
    $strategy = new FixedFrequencyWateringStatusStrategy;
    $ultimoRiego = new Watering(['fecha' => now()->subDays(3)]);

    $status = $strategy->evaluate($ultimoRiego, 3);

    expect($status->estado)->toBe('hoy');
});

test('marks a plant as atrasada when proximo riego already passed', function () {
    $strategy = new FixedFrequencyWateringStatusStrategy;
    $ultimoRiego = new Watering(['fecha' => now()->subDays(10)]);

    $status = $strategy->evaluate($ultimoRiego, 3);

    expect($status->estado)->toBe('atrasada');
});

test('marks a plant as al dia when proximo riego is in the future', function () {
    $strategy = new FixedFrequencyWateringStatusStrategy;
    $ultimoRiego = new Watering(['fecha' => now()]);

    $status = $strategy->evaluate($ultimoRiego, 7);

    expect($status->estado)->toBe('al_dia');
});
