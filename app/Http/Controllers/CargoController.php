<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cargo;
use Inertia\Inertia;

class CargoController extends Controller
{

    public function show(Cargo $cargo)
    {
        $docente = $cargo->docente;

        return Inertia::render('Docentes/Cargos/Show', [
            'cargo' => $cargo,
            'docente' => $docente,
        ]);        
    }

    public function destroy(Cargo $cargo)
    {

        $cargo->delete();


        return redirect()->route('docentes.index')->with('success', '¡El Cargo ha sido eliminado exitosamente!');    
    }

}
