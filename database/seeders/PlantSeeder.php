<?php

namespace Database\Seeders;

use App\Models\Plant;
use App\Models\Species;
use App\Models\User;
use App\Models\Watering;
use Illuminate\Database\Seeder;

class PlantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'user@demo.test')->firstOrFail();
        $speciesIds = Species::pluck('id');

        Plant::factory()
            ->count(25)
            ->for($user)
            ->state(fn () => ['species_id' => $speciesIds->random()])
            ->create()
            ->each(function (Plant $plant) {
                Watering::factory()
                    ->count(fake()->numberBetween(0, 5))
                    ->for($plant)
                    ->create();
            });
    }
}
