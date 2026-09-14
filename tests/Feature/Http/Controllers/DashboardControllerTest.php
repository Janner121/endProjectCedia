<?php

use App\Models\Plant;
use App\Models\User;
use App\Models\Watering;
use Laravel\Sanctum\Sanctum;

test('rejects an unauthenticated request', function () {
    $response = $this->getJson('/api/dashboard');

    $response->assertUnauthorized();
});

test('separates the user\'s plants into pendientes_hoy and atrasadas, ignoring other users', function () {
    $user = Sanctum::actingAs(User::factory()->create());

    $hoy = Plant::factory()->for($user)->create(['frecuencia_dias' => 3]);
    Watering::factory()->for($hoy)->create(['fecha' => now()->subDays(3)]);

    $atrasada = Plant::factory()->for($user)->create(['frecuencia_dias' => 3]);
    Watering::factory()->for($atrasada)->create(['fecha' => now()->subDays(10)]);

    $alDia = Plant::factory()->for($user)->create(['frecuencia_dias' => 30]);
    Watering::factory()->for($alDia)->create(['fecha' => now()]);

    Plant::factory()->create(['frecuencia_dias' => 3]);

    $response = $this->getJson('/api/dashboard');

    $response->assertOk()
        ->assertJsonCount(1, 'pendientes_hoy')
        ->assertJsonPath('pendientes_hoy.0.id', $hoy->id)
        ->assertJsonCount(1, 'atrasadas')
        ->assertJsonPath('atrasadas.0.id', $atrasada->id);
});

test('counts waterings from the last 7 days for the user\'s plants only', function () {
    $user = Sanctum::actingAs(User::factory()->create());
    $plant = Plant::factory()->for($user)->create();

    Watering::factory()->for($plant)->create(['fecha' => now()->subDays(2)]);
    Watering::factory()->for($plant)->create(['fecha' => now()->subDays(6)]);
    Watering::factory()->for($plant)->create(['fecha' => now()->subDays(10)]);

    $otherPlant = Plant::factory()->create();
    Watering::factory()->for($otherPlant)->create(['fecha' => now()]);

    $response = $this->getJson('/api/dashboard');

    $response->assertOk()->assertJsonPath('riegos_ultimos_7_dias', 2);
});

test('totals plants per ubicacion for the authenticated user', function () {
    $user = Sanctum::actingAs(User::factory()->create());

    Plant::factory()->for($user)->count(2)->create(['ubicacion' => 'sala']);
    Plant::factory()->for($user)->create(['ubicacion' => 'balcón']);
    Plant::factory()->create(['ubicacion' => 'sala']);

    $response = $this->getJson('/api/dashboard');

    $response->assertOk()
        ->assertJsonPath('total_por_ubicacion.sala', 2)
        ->assertJsonPath('total_por_ubicacion.balcón', 1);
});
