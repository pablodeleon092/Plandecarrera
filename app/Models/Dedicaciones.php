<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dedicaciones extends Model
{
    protected $table = 'dedicaciones';

    protected $fillable = [
        'nombre',
        'horas_frente_aula_min',
        'horas_frente_aula_max',
        'nro_materias_max',
    ];

    public function cargos()
    {
        return $this->hasMany(Cargo::class, 'dedicacion_id');
    }
}
