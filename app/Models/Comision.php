<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comision extends Model
{
    protected $table = 'comisiones';

    protected $fillable = [
        'nombre',
        'turno',
        'modalidad',
        'sede',
        'anio',

    ]

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'id_materia');
    }

}
