<?php

use App\Models\Plant;
use App\Models\Species;
use App\Models\User;
use App\Models\Watering;
use Laravel\Sanctum\Sanctum;

describe('index', function () {
    test('rejects an unauthenticated request', function () {
        $response = $this->getJson('/api/plants');

        $response->assertUnauthorized();
    });

    test('only returns plants belonging to the authenticated user', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $ownPlant = Plant::factory()->for($user)->create();
        Plant::factory()->create();

        $response = $this->getJson('/api/plants');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $ownPlant->id);
    });

    test('filters by ubicacion', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $sala = Plant::factory()->for($user)->create(['ubicacion' => 'sala']);
        Plant::factory()->for($user)->create(['ubicacion' => 'balcón']);

        $response = $this->getJson('/api/plants?ubicacion=sala');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $sala->id);
    });

    test('filters by species_id', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $species = Species::factory()->create();
        $match = Plant::factory()->for($user)->create(['species_id' => $species->id]);
        Plant::factory()->for($user)->create();

        $response = $this->getJson("/api/plants?species_id={$species->id}");

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $match->id);
    });

    test('filters by estado', function () {
        $user = Sanctum::actingAs(User::factory()->create());

        $atrasada = Plant::factory()->for($user)->create(['frecuencia_dias' => 3]);
        Watering::factory()->for($atrasada)->create(['fecha' => now()->subDays(10)]);

        $alDia = Plant::factory()->for($user)->create(['frecuencia_dias' => 7]);
        Watering::factory()->for($alDia)->create(['fecha' => now()]);

        $response = $this->getJson('/api/plants?estado=atrasada');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $atrasada->id);
    });

    test('sorts by proximo_riego ascending, prioritizing plants with no waterings', function () {
        $user = Sanctum::actingAs(User::factory()->create());

        $alDia = Plant::factory()->for($user)->create(['frecuencia_dias' => 30]);
        Watering::factory()->for($alDia)->create(['fecha' => now()]);

        $sinRiego = Plant::factory()->for($user)->create();

        $response = $this->getJson('/api/plants?sort=proximo_riego');

        $response->assertOk()
            ->assertJsonPath('data.0.id', $sinRiego->id)
            ->assertJsonPath('data.1.id', $alDia->id);
    });
});

describe('store', function () {
    test('creates a plant owned by the authenticated user', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $species = Species::factory()->create();

        $response = $this->postJson('/api/plants', [
            'species_id' => $species->id,
            'apodo' => 'Frondosa',
            'ubicacion' => 'balcón',
            'maceta' => 'barro',
            'frecuencia_dias' => 5,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.apodo', 'Frondosa');

        $this->assertDatabaseHas('plants', [
            'apodo' => 'Frondosa',
            'user_id' => $user->id,
        ]);
    });

    test('defaults activa to true when omitted', function () {
        Sanctum::actingAs(User::factory()->create());
        $species = Species::factory()->create();

        $response = $this->postJson('/api/plants', [
            'species_id' => $species->id,
            'apodo' => 'Frondosa',
            'ubicacion' => 'balcón',
            'maceta' => 'barro',
            'frecuencia_dias' => 5,
        ]);

        $response->assertCreated()->assertJsonPath('data.activa', true);
    });

    test('requires the base fields', function () {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/plants', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['species_id', 'apodo', 'ubicacion', 'maceta', 'frecuencia_dias']);
    });
});

describe('show', function () {
    test('returns the plant with its watering history', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->for($user)->create();
        Watering::factory()->for($plant)->create();

        $response = $this->getJson("/api/plants/{$plant->id}");

        $response->assertOk()
            ->assertJsonCount(1, 'data.waterings');
    });

    test('forbids access to another user\'s plant', function () {
        Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->create();

        $response = $this->getJson("/api/plants/{$plant->id}");

        $response->assertForbidden();
    });
});

describe('update', function () {
    test('the owner can update their plant', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->for($user)->create(['apodo' => 'Vieja']);

        $response = $this->putJson("/api/plants/{$plant->id}", [
            'species_id' => $plant->species_id,
            'apodo' => 'Nueva',
            'ubicacion' => $plant->ubicacion,
            'maceta' => $plant->maceta,
            'frecuencia_dias' => $plant->frecuencia_dias,
        ]);

        $response->assertOk()->assertJsonPath('data.apodo', 'Nueva');
    });

    test('forbids updating another user\'s plant', function () {
        Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->create();

        $response = $this->putJson("/api/plants/{$plant->id}", [
            'species_id' => $plant->species_id,
            'apodo' => 'Nueva',
            'ubicacion' => $plant->ubicacion,
            'maceta' => $plant->maceta,
            'frecuencia_dias' => $plant->frecuencia_dias,
        ]);

        $response->assertForbidden();
    });
});

describe('destroy', function () {
    test('the owner can delete their plant', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->for($user)->create();

        $response = $this->deleteJson("/api/plants/{$plant->id}");

        $response->assertNoContent();
        $this->assertModelMissing($plant);
    });

    test('forbids deleting another user\'s plant', function () {
        Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->create();

        $response = $this->deleteJson("/api/plants/{$plant->id}");

        $response->assertForbidden();
        $this->assertModelExists($plant);
    });
});
