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
    }

/**
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
*/
    public function create()
    {
        // 1. Simplemente renderiza la vista de React
        return Inertia::render('Docentes/Create');
    }

    /**
     * Almacena un docente recién creado en la base de datos.
     */
    public function store(Request $request)
    {
        // 🚨 Simulación de Guardado (para trabajar sin DB activa)
        if (env('APP_ENV') === 'local' && !config('database.connections.mysql.host')) {
             // 1. Solo validamos, no intentamos guardar.
            $request->validate([
                'dni' => ['required', 'string', 'max:20'],
                'nombre' => ['required', 'string', 'max:255'],
                'apellido' => ['required', 'string', 'max:255'],
                'caracter' => ['required', 'string', 'max:50'], 
                'dedicacion' => ['required', 'string', 'max:50'],
                'modalidad_desempeno' => ['required', 'string', 'max:50'],
            ]);
            
             // 2. Simulamos la redirección con mensaje de éxito
            return redirect()->route('docentes.index')->with('success', '¡Docente SIMULADO guardado exitosamente!');
        }

        // -----------------------------------------------------------
        // ✅ CÓDIGO REAL (Una vez que la base de datos esté activa)
        // -----------------------------------------------------------
        
        // 1. Validación de Datos (incluye reglas únicas, etc.)
        $validated = $request->validate([
            'dni' => ['required', 'string', 'max:20', 'unique:docentes,dni'],
            'nombre' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'caracter' => ['required', 'string', 'max:50'], 
            'dedicacion' => ['required', 'string', 'max:50'], 
            'modalidad_desempeno' => ['required', 'string', 'max:50'],
            'telefono' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255', 'unique:docentes,email'],
        ]);

        // 2. Creación del Modelo (gracias al $fillable que definiste)
        Docente::create($validated);

        // 3. Redirección al listado con mensaje flash
        return redirect()->route('docentes.index')->with('success', '¡El Docente ha sido creado exitosamente!');
    }
}
