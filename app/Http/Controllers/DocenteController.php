<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\Dedicacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Docente::query();

        // Aplicar filtro de búsqueda
        if ($request->has('search') && $request->input('search')) {
            $search = $request->input('search');
            // Limpiar la búsqueda de comas y espacios extra, y dividir en términos
            $searchTerms = array_filter(explode(' ', str_replace(',', ' ', $search)));

            $query->where(function ($q) use ($searchTerms) {
                foreach ($searchTerms as $term) {
                    // Asegurarse de que CADA término de búsqueda exista en alguna de las columnas
                    $q->where(fn($subQuery) => $subQuery->where('nombre', 'ilike', "%{$term}%")
                        ->orWhere('apellido', 'ilike', "%{$term}%")
                        ->orWhere('legajo', 'like', "%{$term}%"));
                }
            });
        }

        // Aplicar filtro de estado
        if ($request->has('es_activo') && $request->input('es_activo') !== '') {
            $query->where('es_activo', $request->input('es_activo') === '1');
        }

        $docentes = $query->with('cargos')->orderBy('apellido')->paginate(15)->withQueryString();

        return Inertia::render('Docentes/Index', [
            'docentes' => $docentes,
            'filters' => $request->only(['search', 'es_activo']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Docentes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Aquí iría la lógica para guardar un nuevo docente
        // Por ejemplo:
        // Docente::create($request->validate([...]));
        return redirect()->route('docentes.index')->with('success', 'Docente creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Docente $docente)
    {
        return Inertia::render('Docentes/Show', [
            'docente' => $docente->load('cargos'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Docente $docente)
    {
        return Inertia::render('Docentes/Edit', [
            'docente' => $docente->load('cargos'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Docente $docente)
    {
        // Aquí iría la lógica para actualizar un docente
        // Por ejemplo:
        // $docente->update($request->validate([...]));
        return redirect()->route('docentes.index')->with('success', 'Docente actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Docente $docente)
    {
        try {
            $docente->delete();
            return redirect()->route('docentes.index')->with('success', 'Docente eliminado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->route('docentes.index')->with('error', 'No se puede eliminar el docente porque tiene registros asociados.');
        }
    }

    /**
     * Show the form for creating a new cargo.
     *
     * @param Docente $docente
     * @return \Inertia\Response
     */
    public function createCargo(Docente $docente)
    {
        return Inertia::render('Docentes/Cargos/Create', [
            'docente' => $docente->load('cargos'),
            'dedicaciones' => Dedicacion::all()
        ]);
    }

    /**
     * Add a cargo to a docente.
     *
     * @param Request $request
     * @param Docente $docente
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addCargo(Request $request, Docente $docente)
    {
        $validated = $request->validate([
            'cargo' => 'required|string|max:255',
            'dedicacion_id' => 'required|exists:dedicaciones,id',
            'docente_id' => 'required|exists:docentes,id',
        ]);

        // Usamos el docente que viene por la URL para asegurar la relación correcta.
        $cargo = $docente->cargos()->create([
            'nombre' => $validated['cargo'],
            'dedicacion_id' => $validated['dedicacion_id'],
            // Los valores por defecto se establecen aquí
            'nro_materias_asig' => 0,
            'sum_horas_frente_aula' => 0,
        ]);

        if ($cargo) {
            return redirect()->route('docentes.edit', $docente->id)->with('success', 'Cargo agregado exitosamente');
        }

        return redirect()->route('docentes.edit', $docente->id)->with('error', 'Error al agregar el cargo');
    }
}