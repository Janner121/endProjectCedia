<?php

use App\Models\Plant;
use App\Models\User;

test('the owner can view, update and delete their plant', function (string $ability) {
    $user = User::factory()->create();
    $plant = Plant::factory()->for($user)->create();

    expect($user->can($ability, $plant))->toBeTrue();
})->with(['view', 'update', 'delete']);

test('a different user cannot view, update or delete someone else\'s plant', function (string $ability) {
    $owner = User::factory()->create();
    $plant = Plant::factory()->for($owner)->create();
    $otherUser = User::factory()->create();

    expect($otherUser->can($ability, $plant))->toBeFalse();
})->with(['view', 'update', 'delete']);
