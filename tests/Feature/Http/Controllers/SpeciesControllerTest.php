<?php

use App\Models\Species;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('rejects an unauthenticated request', function () {
    $response = $this->getJson('/api/species');

    $response->assertUnauthorized();
});

test('returns the species catalog ordered by common name', function () {
    Sanctum::actingAs(User::factory()->create());

    Species::factory()->create(['nombre_comun' => 'Sábila']);
    Species::factory()->create(['nombre_comun' => 'Aloe']);

    $response = $this->getJson('/api/species');

    $response->assertOk()
        ->assertJsonPath('data.0.nombre_comun', 'Aloe')
        ->assertJsonPath('data.1.nombre_comun', 'Sábila')
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'nombre_comun', 'nombre_cientifico', 'frecuencia_riego_dias', 'luz', 'cuidados'],
            ],
        ]);
});
