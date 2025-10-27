<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comision extends Model
{
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

}
