<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dicta extends Model
{
    protected $fillable  = [
        'comision_id',
        'docente_id',
        'cargo_id',
        'ano_inicio',
        'año_fin',
        'modalidad_presencia',
        'horas_frente_aula',
        'funcion_aulica_id',
    ];

    public function comision()
    {
        return $this->belongsTo(Comision::class, 'comision_id');
    }

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'docente_id');
    }

    public function cargo()
    {
        return $this->belongsTo(Cargo::class, 'cargo_id');
    }

    public function funcionAulica()
    {
        return $this->belongsTo(FuncionAulica::class, 'funcion_aulica_id');
    }
}
