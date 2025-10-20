<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DocenteController extends Controller
{
    /**
     * Muestra la lista de docentes.
     */
    public function index(Request $request)
    {
        // 🚨 Simulación de Datos (Mock Data) para trabajar sin DB activa
        // **IMPORTANTE:** Cuando la DB esté activa, borra este bloque 'if'
        if (env('APP_ENV') === 'local' && !config('database.connections.mysql.host')) {
             $mockData = [
                'data' => [
                    ['id' => 1, 'dni' => '12345678', 'nombre' => 'Juan', 'apellido' => 'Pérez', 'dedicacion' => 'Exclusiva'],
                    ['id' => 2, 'dni' => '87654321', 'nombre' => 'Ana', 'apellido' => 'García', 'dedicacion' => 'Semiexclusiva'],
                    ['id' => 3, 'dni' => '11223344', 'nombre' => 'Pedro', 'apellido' => 'Gómez', 'dedicacion' => 'Simple'],
                ],
                'links' => [], // Simulación de links de paginación
                'current_page' => 1,
                'total' => 3,
            ];
            
            return Inertia::render('Docentes/Index', [
                'docentes' => $mockData,
                'success' => $request->session()->get('success'),
            ]);
        }
        
        // -----------------------------------------------------------
        // ✅ CÓDIGO REAL (Una vez que la base de datos esté activa y con registros)
        // -----------------------------------------------------------
        
        $docentes = Docente::orderBy('apellido')
                            ->paginate(10); // Pagina 10 resultados por tabla

        return Inertia::render('Docentes/Index', [
            'docentes' => $docentes,
            'success' => $request->session()->get('success'),
        ]);
    }

    // Los métodos create, store, edit, update, destroy van aquí
}
