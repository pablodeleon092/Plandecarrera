<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dedicacion extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'horas_frente_aula_min',
        'horas_frente_aula_max',
        'nro_materias_max',
    ];

    protected $table = 'dedicaciones';

    public function cargos() {
        return $this->hasMany(Cargo::class, 'dedicacion_id');
    }
}