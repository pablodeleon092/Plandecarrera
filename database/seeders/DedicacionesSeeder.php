<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

use Carbon\Carbon;

class DedicacionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $items = [
            [
                'nombre' => 'Simple',
                'horas_frente_aula_min' => 8,
                'horas_frente_aula_max' => 12,
                'nro_materias_max' => 3,
            ],
            [
                'nombre' => 'SemiExclusiva(DP)',
                'horas_frente_aula_min' => 16,
                'horas_frente_aula_max' => 20,
                'nro_materias_max' => 4,
            ],
            [
                'nombre' => 'SemiExclusiva(DI)',
                'horas_frente_aula_min' => 20,
                'horas_frente_aula_max' => 24,
                'nro_materias_max' => 5,
            ],
            [
                'nombre' => 'Exclusiva',
                'horas_frente_aula_min' => 32,
                'horas_frente_aula_max' => 40,
                'nro_materias_max' => 8,
            ],
        ];

        foreach ($items as $item) {
            DB::table('dedicaciones')->updateOrInsert(
                ['nombre' => $item['nombre']],
                array_merge($item, ['created_at' => $now, 'updated_at' => $now])
            );
        }
    }
}
