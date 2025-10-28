<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instituto extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'nombre',
        'siglas',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'nombre' => 'string',
        'siglas' => 'string',
    ];

    /**
     * Get the carreras for the instituto.
     */
    public function carreras()
    {
        return $this->hasMany(Carrera::class, 'instituto_id');
    }

    public function usuarios()
    {
        return $this->hasMany(User::class, 'instituto_id');
    }
}
