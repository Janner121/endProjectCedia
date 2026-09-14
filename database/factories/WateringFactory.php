<?php

namespace Database\Factories;

use App\Models\Plant;
use App\Models\Watering;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Watering>
 */
class WateringFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'plant_id' => Plant::factory(),
            'fecha' => fake()->dateTimeBetween('-1 month', 'now'),
            'cantidad_ml' => fake()->numberBetween(50, 500),
            'fertilizante' => fake()->boolean(20),
            'observacion' => null,
        ];
    }
}
