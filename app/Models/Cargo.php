<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cargo extends Model
{
    use HasFactory;
    protected $table = 'cargos';

    protected $fillable = [
        'nombre',
        'docente_id',
        'dedicacion_id',
        'nro_materias_asig',
        'sum_horas_frente_aula',
    ];

    public function docente()
    {
        return $this->belongsTo(Docente::class);
    }

    public function dedicacion()
    {
        return $this->belongsTo(Dedicacion::class);
    }

    /*Utiliza las relaciones dicta del docente para calcular las horas frente a aula, 
    */
    public function calcularHorasFrenteAula()
    {

    }
     /*Utiliza las relaciones dicta del docente para calcular el nro de materias asignadas,
    */   
    public function calcularNroMateriasAsignadas()
    {

    }
}
