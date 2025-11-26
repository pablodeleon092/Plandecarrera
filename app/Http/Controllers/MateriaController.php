<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MateriaController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $filters = request()->only(['search', 'regimen', 'estado']);

        // --- Aplicación del Filtro de Acceso por Rol ---
        $query = Materia::query();

        // 1. Admin y Admin_global: Ven todo.
        if ($user->hasAnyRole(['Admin', 'Admin_global'])) {
            // No se aplica restricción.
        } 
        
        // 2. Admin_instituto y Consulta_instituto: Solo materias de su Instituto.
        elseif ($user->hasAnyRole(['Admin_instituto', 'Consulta_instituto'])) {
            if ($user->instituto_id) {
                // Aplica el Scope actualizado que usa la relación Many-to-Many
                $query->byInstituto($user->instituto_id);
            } else {
                $query->whereRaw('1 = 0'); // Denegar acceso si no tiene instituto asignado.
            }
        } 
        
        // 3. Coordinador_carrera: Solo materias asociadas a sus carreras.
        elseif ($user->hasRole('Coord_carrera')) {
       
            $carreraIds = $user->carreras->pluck('id')->toArray(); 
            
            if (!empty($carreraIds)) {
                // Aplica el Scope actualizado que usa la relación Many-to-Many
                $query->byCarreras($carreraIds);
            } else {
                $query->whereRaw('1 = 0'); // Denegar acceso si no tiene carreras asignadas.
            }
        } 
        else {
            $query->whereRaw('1 = 0'); // Denegar acceso por defecto.
        }

        $materias = $query
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('nombre', 'like', '%' . $search . '%')
                          ->orWhere('codigo', 'like', '%' . $search . '%');
                });
            })
            ->when($filters['regimen'] ?? null, function ($query, $regimen) {
                $query->where('regimen', $regimen);
            })
            ->when(isset($filters['estado']) && $filters['estado'] !== '', function ($query) use ($filters) {
                $query->where('estado', $filters['estado'] === 'true');
            })
            ->orderBy('id', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Materias/Index', [
            'materias' => $materias,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Materias/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo' => 'required|string|max:50|unique:materias,codigo',
            'estado' => 'boolean',
            'regimen' => 'required|in:anual,cuatrimestral',
            'cuatrimestre' => [
                'nullable',
                'integer',
                'min:1',
                Rule::when($request->regimen === 'cuatrimestral', [
                    'required',
                    'max:10', 
                ]),
                Rule::when($request->regimen === 'anual', [
                    'max:5', 
                ]),
            ],
            'horas_semanales' => 'required|integer|min:1|max:40',
            'horas_totales' => 'nullable|integer|min:1'
        ], [
            'nombre.required' => 'El nombre es obligatorio',
            'codigo.required' => 'El código es obligatorio',
            'codigo.unique' => 'Este código ya está en uso',
            'regimen.required' => 'Debe seleccionar el régimen',
            'cuatrimestre.required' => 'Debe especificar el cuatrimestre para materias cuatrimestrales',
            'horas_semanales.required' => 'Las horas semanales son obligatorias',
            'horas_semanales.max' => 'Las horas semanales no pueden exceder 40'
        ]);

        // Si es anual, cuatrimestre debe ser null
        if ($validated['regimen'] === 'anual') {
            $validated['cuatrimestre'] = null;
        }

        // Calcular horas totales si no se proporcionaron
        if (!isset($validated['horas_totales'])) {
            $semanas = $validated['regimen'] === 'anual' ? 32 : 16;
            $validated['horas_totales'] = $validated['horas_semanales'] * $semanas;
        }

        // Establecer estado por defecto
        if (!isset($validated['estado'])) {
            $validated['estado'] = true;
        }

        Materia::create($validated);

        return redirect()->route('materias.index')
            ->with('success', 'Materia creada exitosamente');
    }

    public function show(Materia $materia)
    {
        return Inertia::render('Materias/Show', [
            'materia' => $materia,
            'comisiones' => $materia->comisiones()->get(),
        ]);
    }

    public function edit(Materia $materia)
    {
        return Inertia::render('Materias/Edit', [
            'materia' => $materia
        ]);
    }

    public function update(Request $request, Materia $materia)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo' => 'required|string|max:50|unique:materias,codigo,' . $materia->id,
            'estado' => 'boolean',
            'regimen' => 'required|in:anual,cuatrimestral',
            'cuatrimestre' => 'nullable|integer|min:1|max:2|required_if:regimen,cuatrimestral',
            'horas_semanales' => 'required|integer|min:1|max:40',
            'horas_totales' => 'nullable|integer|min:1'
        ]);

        // Si es anual, cuatrimestre debe ser null
        if ($validated['regimen'] === 'anual') {
            $validated['cuatrimestre'] = null;
        }

        // Recalcular horas totales si se modificaron las horas semanales o el régimen
        if (!isset($validated['horas_totales'])) {
            $semanas = $validated['regimen'] === 'anual' ? 32 : 16;
            $validated['horas_totales'] = $validated['horas_semanales'] * $semanas;
        }

        $materia->update($validated);

        return redirect()->route('materias.index')
            ->with('success', 'Materia actualizada exitosamente');
    }

    public function destroy(Materia $materia)
    {
        try {
            $materia->delete();
            
            return redirect()->route('materias.index')
                ->with('success', 'Materia eliminada exitosamente');
        } catch (\Exception $e) {
            return redirect()->route('materias.index')
                ->with('error', 'No se puede eliminar la materia porque tiene registros asociados');
        }
    }

    public function toggleStatus(Materia $materia)
    {
        $materia->estado = !$materia->estado;
        $materia->save();

        return redirect()->route('materias.index')
            ->with('success', 'Estado de la materia actualizado exitosamente.');
    }
}