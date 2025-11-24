<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrera;
use App\Models\Instituto;
use App\Models\Materia;
use App\Models\Plan;
use Inertia\Inertia;
class CarreraController extends Controller
{
    public function index()
    {
        // Authorize if a policy exists for Carrera
        try {
            $this->authorize('index', Carrera::class);
        } catch (\Throwable $e) {
            // If no policy exists, ignore and continue
        }

        $carreras = Carrera::with('instituto')->orderBy('id', 'desc')->paginate(15)->withQueryString();
        
        $institutos = Instituto::select('id', 'siglas')->get();

        return Inertia::render('Carreras/Index', [
            'carreras' => $carreras,
            'institutos' => $institutos,
        ]);
    }

    public function edit(Carrera $carrera)
    {
        // Authorize if a policy exists for Carrera
        try {
            $this->authorize('edit', Carrera::class);
        } catch (\Throwable $e) {
            // If no policy exists, ignore and continue
        }

        $plan = $carrera->planActual()->first();

        $materiasEnPlan = $plan ? $plan->materias()->get() : collect();

        $materiasDisponibles = Materia::whereNotIn('id', $materiasEnPlan->pluck('id'))->get();


        return Inertia::render('Carreras/Edit', [
            'carrera' => $carrera,
            'plan' => $plan,
            'materiasEnPlan' => $materiasEnPlan,
            'materiasDisponibles' => $materiasDisponibles,
        ]);
    }

    public function update(Request $request)
    {
        $plan_id = $request->input('plan');
        $plan = Plan::findOrFail($plan_id);
        $materiasRecibidas = $request->input('materias', []);

        $plan->materias()->sync($materiasRecibidas);

        return redirect()->back()->with('success', 'Cambios al plan exitosamente guardados.');
    }

    private function addMateriaToPlan(Plan $plan, integer $materia)
    {
        $plan->materias()->attach($materia->id);
    }

    private function removeMateriaFromPlan(Plan $plan, Materia $materia)
    {
        $plan->materias()->detach($materia->id);
    }
}
