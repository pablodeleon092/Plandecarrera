<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuncionAulica extends Model
{

    protected $table = 'funciones_aulicas';

    protected $fillable = [
        'nombre',
    ];

    // Relación con Dicta
    public function dictas()
    {
        return $this->hasMany(Dicta::class, 'funcion_aulica_id');
    }
}
