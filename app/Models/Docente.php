<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Docente extends Model
{
    /**
     * Estos campos son seguros para ser llenados mediante Docente::create().
     * (El campo 'es_activo' es booleano, pero se maneja aquí.)
     */
    protected $fillable = [
        'legajo',
        'nombre',
        'apellido',
        'modalidad_desempeño',
        'carga_horaria',
        'es_activo',
        'telefono',
        'email',
    ];
    protected $table = 'docentes'; 
}