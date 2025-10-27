<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dicta extends Model
{
    protected $fillabe = [
        'id_comision',
        'id_docente',
        'id_cargo',
        'ano_inicio',
        'año_fin',
        'modalidad_presencia',
        'horas_frente_aula',
        'funcion_aulica_id',
    ];

    public function comision()
    {
        return $this->belongsTo(Comision::class, 'id_comision');
    }

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'id_docente');
    }

    public function cargo()
    {
        return $this->belongsTo(Cargo::class, 'id_cargo');
    }

    public function funcionAulica()
    {
        return $this->belongsTo(FuncionAulica::class, 'funcion_aulica_id');
    }
}
