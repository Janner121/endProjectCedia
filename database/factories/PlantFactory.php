<?php

namespace Database\Factories;

use App\Models\Plant;
use App\Models\Species;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Plant>
 */
class PlantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'species_id' => Species::factory(),
            'apodo' => fake()->firstName(),
            'ubicacion' => fake()->randomElement(['sala', 'balcón', 'oficina', 'cocina', 'dormitorio']),
            'maceta' => fake()->randomElement(['barro', 'plastico', 'suelo']),
            'frecuencia_dias' => fake()->numberBetween(2, 15),
            'fecha_adquisicion' => fake()->dateTimeBetween('-1 year', 'now'),
            'activa' => true,
        ];
    }
}
