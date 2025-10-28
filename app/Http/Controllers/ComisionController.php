<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comision;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ComisionController extends Controller
{

    public function index()
    {
        try {
            $this->authorize('index', Materia::class);
        } catch (\Throwable $e) {
            // If no policy exists, ignore and continue
        }

        $comisiones = Comision::with('materia')->orderBy('id', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Comisiones/Index', [
            'comisiones' => $comisiones,
        ]);
    }

    public function show($id)
    {
        $comision = Comision::with('materia')->findOrFail($id);
        $docentes = $comision->dictas()->exists() 
            ? $comision->docentes_with_cargo
            : collect(); // colección vacía
        return Inertia::render('Comisiones/Show', [
            'comision' => $comision,
            'docentes' => $docentes,
        ]);
    }

    public function create()
    {
        $materias = \App\Models\Materia::where('estado', true)->get()->map(function ($materia) {
            return [
                'id' => $materia->id,
                'nombre' => $materia->nombre,
                'codigo' => $materia->codigo,
            ];
        });
        return Inertia::render('Comisiones/Create', [
            'materias' => $materias,
        ]);
    }
    
    public function edit($id)
    {
        $comision = Comision::with('materia')->findOrFail($id);
        $materias = \App\Models\Materia::where('estado', true)->get()->map(function ($materia) {
            return [
                'id' => $materia->id,
                'nombre' => $materia->nombre,
                'codigo' => $materia->codigo,
            ];
        });

        return Inertia::render('Comisiones/Edit', [
            'materias' => $materias,
            'comision' => $comision,
        ]);
    }


    public function update(Request $request, $id)
    {
        $comision = Comision::with('materia')->findOrFail($id);
        try {
            $validated = $request->validate([
                'codigo' => [
                    'required',
                    'string',
                    'max:50',
                    Rule::unique('comisiones', 'codigo')->ignore($comision->id),
                ],
                'nombre' => 'required|string|max:255',
                'turno' => 'required|in:Mañana,Tarde',
                'modalidad' => 'required|in:presencial,virtual,mixto',
                'cuatrimestre' => 'required|in:1ro,2do',
                'sede' => 'required|string|max:255',
                'anio' => 'required|integer|min:2000|max:2100',
                'id_materia' => 'required|exists:materias,id',
                'horas_teoricas' => 'required|integer|min:0',
                'horas_practicas' => 'required|integer|min:0',
                'horas_totales' => 'required|integer|min:0',               
            ], [
                'codigo.required' => 'El código es obligatorio',
                'codigo.unique' => 'Este código ya está en uso',
                'nombre.required' => 'El nombre es obligatorio',
                'turno.required' => 'Debe seleccionar el turno',
                'modalidad.required' => 'Debe seleccionar la modalidad',
                'cuatrimestre.required' => 'Debe seleccionar el cuatrimestre',
                'sede.required' => 'La sede es obligatoria',
                'anio.required' => 'El año es obligatorio',
                'id_materia.required' => 'Debe seleccionar una materia válida',
            ]);

            $materia = \App\Models\Materia::findOrFail($validated['id_materia']);
            $validated['horas_totales'] = $validated['horas_teoricas'] + $validated['horas_practicas'];

            if ($validated['horas_totales'] != $materia->horas_semanales) {
                return redirect()->back()
                    ->with(['error' => 'Las horas deben ser exactamente '.$materia->horas_semanales.'.'])
                    ->withInput();
            }

            $comision->update($validated);

            return redirect()->route('comisiones.index')->with('success', 'Comisión actualizada exitosamente.');

        } catch (\Throwable $e) {
            return redirect()->back()
                ->with(['error' => 'Ocurrió un error inesperado: ' . $e->getMessage()])
                ->withInput();
        }
    }

    
    public function store(Request $request) {
        try {
            $validated = $request->validate([
                'codigo' => 'required|string|max:50|unique:comisiones,codigo',
                'nombre' => 'required|string|max:255',
                'turno' => 'required|in:Mañana,Tarde',
                'modalidad' => 'required|in:presencial,virtual,mixto',
                'cuatrimestre' => 'required|in:1ro,2do',
                'sede' => 'required|string|max:255',
                'anio' => 'required|integer|min:2000|max:2100',
                'id_materia' => 'required|exists:materias,id',
                'horas_teoricas' => 'required|integer|min:0',
                'horas_practicas' => 'required|integer|min:0',
                'horas_totales' => 'required|integer|min:0',               
            ], [
                'codigo.required' => 'El código es obligatorio',
                'codigo.unique' => 'Este código ya está en uso',
                'nombre.required' => 'El nombre es obligatorio',
                'turno.required' => 'Debe seleccionar el turno',
                'modalidad.required' => 'Debe seleccionar la modalidad',
                'cuatrimestre.required' => 'Debe seleccionar el cuatrimestre',
                'sede.required' => 'La sede es obligatoria',
                'anio.required' => 'El año es obligatorio',
                'id_materia.required' => 'Debe seleccionar una materia válida',
            ]);

            $materia = \App\Models\Materia::findOrFail($validated['id_materia']);
            $validated['horas_totales'] = $validated['horas_teoricas'] + $validated['horas_practicas'];

            if ($validated['horas_totales'] > $materia->horas_semanales) {
                return redirect()->back()->withErrors(['horas_teoricas' => 'La suma de horas teóricas y prácticas no puede exceder las horas totales de la materia.'])->withInput();
            } else if ($validated['horas_totales'] < $materia->horas_semanales) {
                return redirect()->back()->withErrors(['horas_teoricas' => 'La suma de horas teóricas y prácticas no puede ser menor que las horas totales de la materia.'])->withInput();
            }



            Comision::create($validated);

            return redirect()->route('comisiones.index')->with('success', 'Comisión creada exitosamente.');

        }   catch (\Throwable $e) {
                return redirect()->route('comisiones.create')
                    ->with(['error' => 'Ocurrió un error inesperado: ' . $e->getMessage()])
                    ->withInput();
        }
    
    }

    public function destroy(Comision $comision)
    {
        try {
            $comision->delete();
            return redirect()->route('comisiones.index')->with('success', 'Comision eliminada.');
        } catch (\Exception $e) {
            return redirect()->route('comisiones.index')->with('error', 'No se puede eliminar la comision.');
        }
    }
}
