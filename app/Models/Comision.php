<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comision extends Model
{
    use HasFactory;
    protected $table = 'comisiones';

    protected $fillable = [
        'id',
        'codigo',
        'nombre',
        'turno',
        'modalidad',
        'sede',
        'anio',
        'cuatrimestre',
        'horas_teoricas',
        'horas_practicas',
        'horas_totales',
        'id_materia',
        'estado', // <-- AGREGALO
    ];

    protected $attributes = [
        'estado' => true, // ahora sí, seguro
    ];

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'id_materia');
    }

    public function docentes()
    {
        return $this->belongsToMany(Docente::class, 'dictas', 'comision_id', 'docente_id')
                    ->withPivot('cargo_id', 'ano_inicio', 'año_fin', 'modalidad_presencia', 'horas_frente_aula', 'funcion_aulica_id')
                    ->withTimestamps();
    }

    public function dictas()
    {
        return $this->hasMany(Dicta::class, 'comision_id');
    }

    public function getDocentesWithCargoAttribute()
    {
        return $this->dictas()->with(['docente', 'cargo'])->get()->map(function($dicta) {
            return [
                'id' => $dicta->docente->id,
                'dicta_id' => $dicta->id,
                'nombre' => $dicta->docente->nombre,
                'apellido' => $dicta->docente->apellido,
                'cargo' => $dicta->cargo->nombre ?? null,
                'ano_inicio' => $dicta->ano_inicio,
                'año_fin' => $dicta->año_fin,
                'modalidad_presencia' => $dicta->modalidad_presencia,
                'horas_frente_aula' => $dicta->horas_frente_aula,
            ];
        });
    }

}
