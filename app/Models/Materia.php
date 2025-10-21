<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{

    
    public function comisiones()
    {
        return $this->hasMany(Dicta:class);
    }
}
