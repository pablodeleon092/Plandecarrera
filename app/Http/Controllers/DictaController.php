<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comision;
use App\Models\FuncionAulica;
use Inertia\Inertia;

class DictaController extends Controller
{
    public function create(Request $request)
    {
        // Validar que se pase la comisión
        $request->validate([
            'comision_id' => 'required|exists:comisiones,id',
        ]);

        // Obtener la comisión
        $comision = Comision::with('materia')->findOrFail($request->comision_id);


        $docente = \App\Models\Docente::with('cargos')->findOrFail($request->docente_id);

        $funcionesAulicas = FuncionAulica::all();

        return Inertia::render('Comisiones/Dictas/Create', [
            'comision' => $comision,
            'docente' => $docente,
            'funcionesAulicas' => $funcionesAulicas,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'comision_id' => 'required|exists:comisiones,id',
            'docente_id' => 'required|exists:docentes,id',
            'cargo_id' => 'required|exists:cargos,id',
            'horas_frente_aula' => 'required|integer|min:0',
            'modalidad_presencia' => 'required|in:presencial,virtual,mixta',
            'ano_inicio' => 'required|date',
            'año_fin' => 'nullable|date|after_or_equal:ano_inicio',
            'funcion_aulica_id' => 'nullable|exists:funciones_aulicas,id',
        ], [
            'comision_id.required' => 'La comisión es obligatoria',
            'docente_id.required' => 'El docente es obligatorio',
            'cargo_id.required' => 'El cargo es obligatorio',
            'horas_frente_aula.required' => 'Debe ingresar las horas frente al aula',
            'modalidad_presencia.required' => 'Debe seleccionar la modalidad de presencia',
            'ano_inicio.required' => 'El año de inicio es obligatorio',
        ]);

        // Evitar duplicados: mismo docente y cargo en la misma comisión
        $exists = \App\Models\Dicta::where('comision_id', $validated['comision_id'])
            ->where('docente_id', $validated['docente_id'])
            ->where('cargo_id', $validated['cargo_id'])
            ->exists();

        if ($exists) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Este docente ya está vinculado a la comisión con ese cargo.');
        }

        // Crear el registro en dictas
        \App\Models\Dicta::create($validated);

        return redirect()->route('comisiones.show', $validated['comision_id'])
            ->with('success', 'Docente vinculado exitosamente a la comisión.');
    }

    public function destroy($id)
    {
        $dicta = \App\Models\Dicta::findOrFail($id);
        $comisionId = $dicta->comision_id;
        $dicta->delete();

        return redirect()->route('comisiones.show', $comisionId)
            ->with('success', 'Vinculación del docente eliminada exitosamente.');
    }

}
