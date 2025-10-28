<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FuncionAulicaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $funciones = [
            ['nombre' => 'teorica'],
            ['nombre' => 'practica'],
            ['nombre' => 'teorica/practica'],
        ];

        foreach ($funciones as $funcion) {
            DB::table('funciones_aulicas')->updateOrInsert(
                ['nombre' => $funcion['nombre']],
                array_merge($funcion, ['created_at' => $now, 'updated_at' => $now])
            );
        }
    }
}