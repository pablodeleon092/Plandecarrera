<?php

namespace Database\Seeders;

use App\Models\Cargo;
use App\Models\Docente;
use App\Models\Dedicacion;
use Illuminate\Database\Seeder;

class CargosSeeder extends Seeder
{
    public function run()
    {
        $cargosDisponibles = [
            'Profesor Titular',
            'Profesor Asociado',
            'Profesor Adjunto',
            'Profesor Asistente',
            'Jefe de Trabajos Prácticos',
            'Ayudante de Primera',
        ];

        $docentes = Docente::all();

        foreach ($docentes as $docente) {
            // Determinar dedicaciones según modalidad
            if ($docente->modalidad_desempeño === 'Desarrollo') {
                $dedicaciones = Dedicacion::whereIn('nombre', ['Simple', 'SemiExclusiva(DP)'])->get();
            } elseif ($docente->modalidad_desempeño === 'Investigador') {
                $dedicaciones = Dedicacion::whereIn('nombre', ['SemiExclusiva(DI)', 'Exclusiva'])->get();
            } else {
                // Caso por defecto: usar todas las dedicaciones disponibles
                $dedicaciones = Dedicacion::all();
            }

            // Verificar que hay dedicaciones disponibles
            if ($dedicaciones->isEmpty()) {
                continue; // Saltar este docente si no hay dedicaciones
            }

            $dedicacion = $dedicaciones->random();

            Cargo::create([
                'nombre' => $cargosDisponibles[array_rand($cargosDisponibles)],
                'dedicacion_id' => $dedicacion->id,
                'nro_materias_asig' => 0,
                'sum_horas_frente_aula' => 0,
                'docente_id' => $docente->id,
            ]);
        }
    }
}