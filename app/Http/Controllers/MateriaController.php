<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MateriaController extends Controller
{
    public function index()
    {
        $materias = Materia::latest()
            ->get()
            ->map(function ($materia) {
                return [
                    'id' => $materia->id,
                    'nombre' => $materia->nombre,
                    'codigo' => $materia->codigo,
                    'estado' => $materia->estado,
                    'estado_nombre' => $materia->estado_nombre,
                    'regimen' => $materia->regimen,
                    'regimen_nombre' => $materia->regimen_nombre,
                    'cuatrimestre' => $materia->cuatrimestre,
                    'horas_semanales' => $materia->horas_semanales,
                    'horas_totales' => $materia->horas_totales,
                    'created_at' => $materia->created_at->format('d/m/Y'),
                ];
            });

        return Inertia::render('Materias/Index', [
            'materias' => $materias
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
            'cuatrimestre' => 'nullable|integer|min:1|max:2|required_if:regimen,cuatrimestral',
            'horas_semanales' => 'required|integer|min:1|max:40',
            'horas_totales' => 'nullable|integer|min:1'
        ], [
            'nombre.required' => 'El nombre es obligatorio',
            'codigo.required' => 'El código es obligatorio',
            'codigo.unique' => 'Este código ya está en uso',
            'regimen.required' => 'Debe seleccionar el régimen',
            'cuatrimestre.required_if' => 'Debe especificar el cuatrimestre para materias cuatrimestrales',
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
            'materia' => [
                'id' => $materia->id,
                'nombre' => $materia->nombre,
                'codigo' => $materia->codigo,
                'estado' => $materia->estado,
                'estado_nombre' => $materia->estado_nombre,
                'regimen' => $materia->regimen,
                'regimen_nombre' => $materia->regimen_nombre,
                'cuatrimestre' => $materia->cuatrimestre,
                'horas_semanales' => $materia->horas_semanales,
                'horas_totales' => $materia->horas_totales,
                'created_at' => $materia->created_at->format('d/m/Y H:i'),
            ]
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
}