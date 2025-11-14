<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrera;
use App\Models\Instituto;
use App\Models\Materia;
use App\Models\Plan;
use Inertia\Inertia;
// ¡Importante! Agregar esto para la validación
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class CarreraController extends Controller
{
    public function index()
    {
        // ... (Tu código de index)
        // ...
        $carreras = Carrera::with('instituto')->orderBy('id', 'desc')->paginate(15)->withQueryString();
        $institutos = Instituto::select('id', 'siglas')->get();

        return Inertia::render('Carreras/Index', [
            'carreras' => $carreras,
            'institutos' => $institutos,
        ]);
    }

    // --- NUEVO MÉTODO 'CREATE' ---
    // Muestra la vista para crear una nueva carrera
    public function create()
    {
        // Pasamos los institutos para poder mostrarlos en un <select>
        return Inertia::render('Carreras/Create', [
            'institutos' => Instituto::select('id', 'siglas')->get()
        ]);
    }

    // --- NUEVO MÉTODO 'STORE' ---
    // Guarda la nueva carrera en la base de datos
    public function store(Request $request)
    {
        // Validación de los datos
        $request->validate([
            'nombre' => 'required|string|max:255|unique:carreras',
            'codigo' => 'required|string|max:50|unique:carreras',
            'duracion_anios' => 'required|integer|min:1|max:10',
            'titulo_que_otorga' => 'required|string|max:255',
            'instituto_id' => 'required|integer|exists:institutos,id',
        ]);

        // Creación de la carrera
        Carrera::create([
            'nombre' => $request->nombre,
            'codigo' => $request->codigo,
            'duracion_anios' => $request->duracion_anios,
            'titulo_que_otorga' => $request->titulo_que_otorga,
            'instituto_id' => $request->instituto_id,
        ]);

        // Redireccionamos al index (o a donde quieras) con un mensaje
        return Redirect::route('carreras.index')->with('success', 'Carrera creada exitosamente.');
    }

    // --- NUEVO MÉTODO 'SHOW' ---
    // Muestra una carrera específica
    public function show(Carrera $carrera)
    {
        // Cargamos la relación con instituto (si no viene por defecto)
        $carrera->load('instituto');

        return Inertia::render('Carreras/Show', [
            'carrera' => $carrera
        ]);
    }

    public function toggleStatus(Carrera $carrera)
    {
        // Cambia el estado: si es 'activa', lo pone 'inactiva', y viceversa.
        $nuevoEstado = $carrera->estado === 'activa' ? 'inactiva' : 'activa';
        $carrera->update(['estado' => $nuevoEstado]);

        $accion = $nuevoEstado === 'activa' ? 'activada' : 'desactivada';
        $mensaje = "La carrera '{$carrera->nombre}' ha sido {$accion}.";

        // Redirige a la página anterior con un mensaje de éxito.
        return back()->with('success', $mensaje);
    }


    public function edit(Carrera $carrera)
    {
        // Buscamos el primer plan de la carrera. Si no existe, lo creamos.
        $plan = $carrera->planes()->firstOrCreate([]);

        // Obtenemos las materias que ya están en el plan
        $materiasEnPlan = $plan->materias()->get();

        // Obtenemos los IDs de las materias que ya están en el plan
        $materiasEnPlanIds = $materiasEnPlan->pluck('id');

        // Obtenemos las materias que NO están en el plan para mostrarlas como disponibles
        $materiasDisponibles = Materia::whereNotIn('id', $materiasEnPlanIds)->get();

        return Inertia::render('Carreras/Edit', [
            'carrera' => $carrera,
            'plan' => $plan,
            'materiasEnPlan' => $materiasEnPlan,
            'materiasDisponibles' => $materiasDisponibles,
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function update(Request $request, Carrera $carrera)
    {
        $validated = $request->validate([
            'materias' => 'present|array', // 'present' asegura que la clave 'materias' exista, incluso si el array está vacío
            'materias.*' => 'integer|exists:materias,id', // Valida que cada elemento sea un ID de materia existente
            'plan' => 'required|integer|exists:planes,id'
        ]);

        // Buscamos el plan para asegurarnos de que pertenece a la carrera (por seguridad)
        $plan = $carrera->planes()->findOrFail($validated['plan']);

        // Sincronizamos las materias del plan.
        // sync() se encarga de añadir, eliminar y mantener las relaciones necesarias.
        $plan->materias()->sync($validated['materias']);

        return Redirect::route('carreras.edit', $carrera->id)->with('success', 'Plan de estudios actualizado correctamente.');
    }
}