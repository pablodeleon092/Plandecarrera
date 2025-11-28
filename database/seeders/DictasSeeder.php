<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dicta;
use App\Models\Comision;
use App\Models\Docente;
use App\Models\Cargo;
use App\Models\FuncionAulica;

class DictasSeeder extends Seeder
{
    public function run()
    {
        $comisiones = Comision::all();
        $docentes = Docente::all();
        $cargos = Cargo::all();
        $funcionesAulicas = FuncionAulica::all();

        if ($docentes->isEmpty() || $cargos->isEmpty()) {
            $this->command->info('No hay docentes o cargos para asignar.');
            return;
        }

        foreach ($comisiones as $comision) {
            // Asignar entre 1 y 3 docentes por comisión
            $cantidadDocentes = rand(1, 3);
            
            // Obtener docentes aleatorios para esta comisión
            $docentesAsignados = $docentes->random(min($cantidadDocentes, $docentes->count()));

            foreach ($docentesAsignados as $docente) {
                Dicta::create([
                    'comision_id' => $comision->id,
                    'docente_id' => $docente->id,
                    'cargo_id' => $cargos->random()->id,
                    'ano_inicio' => '2025-03-01',
                    'año_fin' => null,
                    'modalidad_presencia' => collect(['presencial', 'virtual', 'mixta'])->random(),
                    'horas_frente_aula' => rand(2, 6),
                    'funcion_aulica_id' => $funcionesAulicas->isNotEmpty() ? $funcionesAulicas->random()->id : null,
                ]);
            }
        }
    }
}
