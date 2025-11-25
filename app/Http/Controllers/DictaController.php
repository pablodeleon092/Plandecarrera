<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comision;
use App\Models\FuncionAulica;
use Inertia\Inertia;
use App\Models\Dicta;
use App\Services\NormativaAsignacion;
use Illuminate\Validation\ValidationException;
use Exception;


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
        try {
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

            // Evitar duplicados
            $exists = Dicta::where('comision_id', $validated['comision_id'])
                ->where('docente_id', $validated['docente_id'])
                ->where('cargo_id', $validated['cargo_id'])
                ->exists();

            if ($exists) {
                return redirect()->back()
                    ->withInput()
                    ->with('error', 'Este docente ya está vinculado a la comisión con ese cargo.');
            }

            // Crear el registro
            $dicta = Dicta::create($validated);

            // Aplicar normativa (puede lanzar ValidationException)
            NormativaAsignacion::cargarHorasFrenteAlAula($dicta);

            // Si todo sale bien, redirigir al show
            return redirect()
                ->route('comisiones.show', $validated['comision_id'])
                ->with('success', 'Docente vinculado exitosamente a la comisión.');

        } catch (ValidationException $e) {
            // Si hay errores de validación de normativa o de request
            return redirect()
                ->route('comisiones.show', $request->comision_id)
                ->with('error', 'Error al asignar el docente: ' . collect($e->errors())->flatten()->first())
                ->withInput();

        } catch (Exception $e) {
            // Cualquier otro error inesperado
            return redirect()
                ->route('dictas.create', ['comision_id' => $request->comision_id, 'docente_id' => $request->docente_id])
                ->with('error', 'Ocurrió un error al intentar asignar el docente: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function destroy($id)
    {
        $dicta = \App\Models\Dicta::findOrFail($id);
        $comisionId = $dicta->comision_id;
        NormativaAsignacion::eliminarHorasFrenteAlAula($dicta);
        $dicta->delete();

        return redirect()->route('comisiones.show', $comisionId)
            ->with('success', 'Vinculación del docente eliminada exitosamente.');
    }


}
