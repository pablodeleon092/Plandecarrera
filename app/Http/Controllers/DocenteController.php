<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocenteRequest;
use App\Models\Docente;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DocenteController extends Controller
{
    /**
     * Muestra la lista de docentes (READ).
     */
    public function index(Request $request) {
        // Si tienes la DB activa, esto funcionará. Si no, usa el mock data temporalmente.
        $docentes = Docente::with('cargos')
                            ->orderBy('apellido')
                            ->paginate(10); 

        return Inertia::render('Docentes/Index', [
            'docentes' => $docentes,
            'success' => $request->session()->get('success'),
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo docente (CREATE View).
     */
    public function create() {
        // Simplemente renderiza la vista de React
        return Inertia::render('Docentes/Create');
    }

    /**
     * Almacena un docente recién creado en la base de datos (STORE).
     */
    public function store(StoreDocenteRequest $request) {
        // 1. La validación ahora es manejada por StoreDocenteRequest.
        // Si la validación falla, Laravel redirige automáticamente.

        // 2. Creación del Modelo con los datos ya validados.
        Docente::create($request->validated());

        // 3. Redirección al listado con mensaje flash (Resuelve el problema de redirección)
        return redirect()->route('docentes.index')->with('success', '¡El Docente ha sido creado exitosamente!');
    }
    
    /**
     * Muestra el formulario para editar un docente existente (EDIT View).
     * @param  \App\Models\Docente  $docente Laravel hace Route Model Binding
     */
    public function edit(Docente $docente) {
        return Inertia::render('Docentes/Edit', [
            // Pasamos el docente encontrado por Route Model Binding
            'docente' => $docente,
        ]);
    }

    /**
     * Actualiza el docente en la base de datos (UPDATE).
     */
    public function update(StoreDocenteRequest $request, Docente $docente) {
        // 1. La validación también es manejada por StoreDocenteRequest.

        // 2. Actualización del Modelo
        $docente->update($request->validated());

        // 3. Redirección
        return redirect()->route('docentes.index')->with('success', '¡El Docente ha sido actualizado exitosamente!');
    }

    /**
     * Elimina el docente de la base de datos (DESTROY).
     */
    public function destroy(Docente $docente) {
        // 1. Eliminación del Modelo
        $docente->delete();

        // 2. Redirección
        return redirect()->route('docentes.index')->with('success', '¡El Docente ha sido eliminado exitosamente!');
    }

    public function addCargo(Docente $docente)
    {

        if ($docente->modalidad_desempeño === 'Desarrollo') {
            $dedicaciones = \App\Models\Dedicaciones::whereIn('nombre', ['Simple', 'SemiExclusiva(DP)'])->get();
        } elseif ($docente->modalidad_desempeño === 'Investigador') {
            $dedicaciones = \App\Models\Dedicaciones::whereIn('nombre', ['SemiExclusiva(DI)', 'Exclusiva'])->get();
        }

        return Inertia::render('Docentes/Cargos/Create', [
            'docente' => $docente,
            'dedicaciones' => $dedicaciones,
        ]);
    }

    public function storeCargo(Request $request)
    {
    try {
        \App\Models\Cargo::create([
            'nombre' => $request->cargo,
            'dedicacion_id' => $request->dedicacion_id,
            'docente_id' => $request->docente_id,
            'nro_materias_asig' => 0,
            'sum_horas_frente_aula' => 0,
        ]);
    } catch (\Exception $e) {
        \Log::error('Error al crear cargo: '.$e->getMessage());
        return redirect()
            ->route('docentes.addcargo', $request->docente_id)
            ->with('error', 'No se pudo asignar el Cargo. Intenta nuevamente.');    
    }
        return redirect()->route('docentes.edit', $request->docente_id)->with('success', '¡El Cargo ha sido asignado exitosamente!');
    }
}