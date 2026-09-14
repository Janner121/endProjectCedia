<?php

namespace Database\Factories;

use App\Models\Species;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Species>
 */
class SpeciesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre_comun' => fake()->unique()->words(2, true),
            'nombre_cientifico' => fake()->words(2, true),
            'frecuencia_riego_dias' => fake()->numberBetween(2, 15),
            'luz' => fake()->randomElement(['sol_directo', 'luz_indirecta', 'sombra']),
            'cuidados' => fake()->sentence(),
        ];
    }
}
