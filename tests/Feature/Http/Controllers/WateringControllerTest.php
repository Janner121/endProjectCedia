<?php

use App\Models\Plant;
use App\Models\User;
use App\Models\Watering;
use Laravel\Sanctum\Sanctum;

describe('store', function () {
    test('rejects an unauthenticated request', function () {
        $plant = Plant::factory()->create();

        $response = $this->postJson("/api/plants/{$plant->id}/waterings", [
            'fecha' => now()->toDateString(),
        ]);

        $response->assertUnauthorized();
    });

    test('forbids registering a watering on another user\'s plant', function () {
        Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->create();

        $response = $this->postJson("/api/plants/{$plant->id}/waterings", [
            'fecha' => now()->toDateString(),
        ]);

        $response->assertForbidden();
        $this->assertDatabaseCount('waterings', 0);
    });

    test('registers a watering for the owner\'s plant', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->for($user)->create();

        $response = $this->postJson("/api/plants/{$plant->id}/waterings", [
            'fecha' => now()->toDateString(),
            'cantidad_ml' => 200,
            'fertilizante' => true,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.cantidad_ml', 200)
            ->assertJsonPath('data.fertilizante', true);

        $this->assertDatabaseHas('waterings', ['plant_id' => $plant->id, 'cantidad_ml' => 200]);
    });

    test('defaults fertilizante to false when omitted', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->for($user)->create();

        $response = $this->postJson("/api/plants/{$plant->id}/waterings", [
            'fecha' => now()->toDateString(),
        ]);

        $response->assertCreated()->assertJsonPath('data.fertilizante', false);
    });

    test('rejects a future fecha', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->for($user)->create();

        $response = $this->postJson("/api/plants/{$plant->id}/waterings", [
            'fecha' => now()->addDay()->toDateString(),
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('fecha');
    });

    test('requires fecha', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->for($user)->create();

        $response = $this->postJson("/api/plants/{$plant->id}/waterings", []);

        $response->assertUnprocessable()->assertJsonValidationErrors('fecha');
    });
});

describe('destroy', function () {
    test('rejects an unauthenticated request', function () {
        $watering = Watering::factory()->create();

        $response = $this->deleteJson("/api/waterings/{$watering->id}");

        $response->assertUnauthorized();
    });

    test('the owner can delete a watering from their plant', function () {
        $user = Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->for($user)->create();
        $watering = Watering::factory()->for($plant)->create();

        $response = $this->deleteJson("/api/waterings/{$watering->id}");

        $response->assertNoContent();
        $this->assertModelMissing($watering);
    });

    test('forbids deleting a watering from another user\'s plant', function () {
        Sanctum::actingAs(User::factory()->create());
        $plant = Plant::factory()->create();
        $watering = Watering::factory()->for($plant)->create();

        $response = $this->deleteJson("/api/waterings/{$watering->id}");

        $response->assertForbidden();
        $this->assertModelExists($watering);
    });
});
