<?php

namespace Database\Factories;

use App\Models\Docente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Docente>
 */
class DocenteFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Docente::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'legajo' => $this->faker->unique()->numberBetween(10000, 99999),
            'nombre' => $this->faker->firstName,
            'apellido' => $this->faker->lastName,
            'modalidad_desempeño' => $this->faker->randomElement(['Investigador', 'Desarrollo']),
            'carga_horaria' => $this->faker->randomElement([10, 20, 30, 40]),
            'es_activo' => $this->faker->boolean(90), // 90% de probabilidad de que sea true
            'telefono' => $this->faker->unique()->optional()->phoneNumber,
            'email' => $this->faker->unique()->optional()->safeEmail,
        ];
    }
}