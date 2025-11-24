<?php

namespace App\Services;

use App\Models\Docente;
use App\Models\Comision;
use App\Models\Dicta;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class NormativaAsignacion {

    public static function cargarHorasFrenteAlAula(Dicta $dicta)
    {
        $funcion_aulica = strtolower(trim($dicta->funcionAulica->nombre));
        $docente = $dicta->docente;
        $cargo = $dicta->cargo;
        $comision = $dicta->comision;


        $yaAsignado = self::docenteYaAsignado($docente, $comision, $cargo);

       
        if (
            $funcion_aulica === 'teorica' &&
            Str::contains($cargo->nombre, ['Titular', 'Adjunto', 'Asociado'])
        ) {
            self::SumarHoras($docente, $cargo, $dicta->horas_frente_aula, !$yaAsignado);
        } elseif (
            $funcion_aulica === 'practica' &&
            Str::contains($cargo->nombre, ['Jefe de Trabajos Practicos', 'Ayudante de Primera'])
        ) {
            self::sumarHoras($docente, $cargo, $dicta->horas_frente_aula, !$yaAsignado);
        } elseif ($funcion_aulica === 'teorica/practica') {
            self::sumarHoras($docente, $cargo, $dicta->horas_frente_aula, !$yaAsignado);
        } else {
            throw ValidationException::withMessages([
                'funcion_aulica' => 'La función áulica no es compatible con el cargo del docente.',
            ]);
        }

        $docente->save();
        $cargo->save();
    }

    public static function eliminarHorasFrenteAlAula(Dicta $dicta)
    {
        $funcion_aulica = strtolower(trim($dicta->funcionAulica->nombre));
        $docente = $dicta->docente;
        $cargo = $dicta->cargo;

        if (
            $funcion_aulica === 'teorica' &&
            Str::contains($cargo->nombre, ['Titular', 'Adjunto', 'Asociado'])
        ) {
            self::restarHoras($docente, $cargo, $dicta);
        } elseif (
            $funcion_aulica === 'practica' &&
            Str::contains($cargo->nombre, ['Jefe de Trabajos Practicos', 'Ayudante de Primera'])
        ) {
            self::restarHoras($docente, $cargo, $dicta);
        } elseif ($funcion_aulica === 'teorica/practica') {
            self::restarHoras($docente, $cargo, $dicta);
        } else {
            throw ValidationException::withMessages([
                'funcion_aulica' => 'La función áulica no es compatible con el cargo del docente.',
            ]);
        }

        $docente->save();
        $cargo->save();
    }

    private static function sumarHoras($docente, $cargo, $horas, $sumarMateria = true)
    {
        $docente->carga_horaria += $horas;
        $cargo->sum_horas_frente_aula += $horas;

        if ($sumarMateria) {
            $cargo->nro_materias_asig += 1;
        }
    }

    private static function restarHoras($docente, $cargo, $dicta)
    {
        $horas = $dicta->horas_frente_aula;
        $materiaId = $dicta->comision->id_materia;
        $docente->carga_horaria -= $horas;
        $cargo->sum_horas_frente_aula -= $horas;
        $aunDictaMateria = Dicta::where('docente_id', $docente->id)
            ->whereHas('comision', function ($q) use ($materiaId) {
                $q->where('id_materia', $materiaId);
            })
            ->where('id', '!=', $dicta->id)
            ->exists();

        if (!$aunDictaMateria) {
            $cargo->nro_materias_asig -= 1;
        }
    }

    private static function docenteYaAsignado($docente, $comision, $cargo)
    {
        return Dicta::where('docente_id', $docente->id)
            ->where(function ($q) use ($comision) {
                // Caso único: misma materia pero en otra comisión
                $q->where('comision_id', '!=', $comision->id)
                ->whereHas('comision', function ($c) use ($comision) {
                    $c->where('id_materia', $comision->id_materia);
                });
            })
            ->exists();
    }

}

