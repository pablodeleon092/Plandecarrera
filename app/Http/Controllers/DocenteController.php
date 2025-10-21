<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DocenteController extends Controller
{
    /**
     * Muestra la lista de docentes (READ).
     */
    public function index(Request $request)
    {
        // Si tienes la DB activa, esto funcionará. Si no, usa el mock data temporalmente.
        $docentes = Docente::orderBy('apellido')
                            ->paginate(10); 

        return Inertia::render('Docentes/Index', [
            'docentes' => $docentes,
            'success' => $request->session()->get('success'),
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo docente (CREATE View).
     */
    public function create()
    {
        // Simplemente renderiza la vista de React
        return Inertia::render('Docentes/Create');
    }

    /**
     * Almacena un docente recién creado en la base de datos (STORE).
     */
    public function store(Request $request)
    {
        // 1. Validación de Datos (Sincronizado con Create.jsx y tu Migración)
        $validated = $request->validate([
            // Validamos que sea un entero y que sea único en la tabla
            'legajo' => ['required', 'integer', 'unique:docentes,legajo'], 
            'nombre' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            // Usamos la regla 'Rule::in' para validar el ENUM
            'modalidad_desempeño' => ['required', Rule::in(['Investigador', 'Desarrollo'])],
            'carga_horaria' => ['required', 'integer'],
            'es_activo' => ['boolean'], 
            'telefono' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255', 'unique:docentes,email'],
        ]);

        // 2. Creación del Modelo
        Docente::create($validated);

        // 3. Redirección al listado con mensaje flash (Resuelve el problema de redirección)
        return redirect()->route('docentes.index')->with('success', '¡El Docente ha sido creado exitosamente!');
    }
    
    /**
     * Muestra el formulario para editar un docente existente (EDIT View).
     * @param  \App\Models\Docente  $docente Laravel hace Route Model Binding
     */
    public function edit(Docente $docente)
    {
        return Inertia::render('Docentes/Edit', [
            // Pasamos el docente encontrado por Route Model Binding
            'docente' => $docente,
        ]);
    }

    /**
     * Actualiza el docente en la base de datos (UPDATE).
     */
    public function update(Request $request, Docente $docente)
    {
        // 1. Validación de Datos (Ajustamos 'unique' para ignorar el registro actual)
        $validated = $request->validate([
            // Ignorar el legajo actual del check de unicidad
            'legajo' => ['required', 'integer', 'unique:docentes,legajo,' . $docente->id],
            'nombre' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'modalidad_desempeño' => ['required', Rule::in(['Investigador', 'Desarrollo'])],
            'carga_horaria' => ['required', 'integer'],
            'es_activo' => ['boolean'], 
            'telefono' => ['nullable', 'string', 'max:50'],
            // Ignorar el email actual del check de unicidad
            'email' => ['nullable', 'email', 'max:255', 'unique:docentes,email,' . $docente->id],
        ]);

        // 2. Actualización del Modelo
        $docente->update($validated);

        // 3. Redirección
        return redirect()->route('docentes.index')->with('success', '¡El Docente ha sido actualizado exitosamente!');
    }

    /**
     * Elimina el docente de la base de datos (DESTROY).
     */
    public function destroy(Docente $docente)
    {
        // 1. Eliminación del Modelo
        $docente->delete();

        // 2. Redirección
        return redirect()->route('docentes.index')->with('success', '¡El Docente ha sido eliminado exitosamente!');
    }
}