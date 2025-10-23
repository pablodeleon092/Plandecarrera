<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Carrera extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'nombre',
        'instituto_id',
        'modalidad',
        'sede',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'nombre' => 'string',
        'instituto_id' => 'integer',
        'modalidad' => 'string',
        'sede' => 'string',
    ];

    /**
     * Get the instituto that owns the carrera.
     */
    public function instituto()
    {
        return $this->belongsTo(Instituto::class, 'instituto_id');
    }
}
