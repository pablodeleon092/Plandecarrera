<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Models\Instituto;
use App\Models\Carrera;
use App\Models\User;
use App\Models\Docente;
use App\Models\Dicta;
use App\Models\Comision;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function home(Request $request)
    {
        $user = Auth::user();
        $selectedInstitutoId = $request->input('instituto_id');
        $selectedCarreraId = $request->input('carrera_id');
        $currentView = $request->input('view', 'materias'); // Default view

        // 1. Obtener Institutos disponibles
        $institutosDisponibles = $this->getInstitutosPorRol($user);

        // 2. Determinar el Instituto Seleccionado
        if (!$selectedInstitutoId) {
            $selectedInstitutoId = $institutosDisponibles->first()?->id;
        }

        // Si el usuario es Consejero, cargar dashboard ejecutivo
        if ($user->cargo === 'Consejero') {
            return $this->renderConsejeroDashboard($user, $selectedInstitutoId);
        }

        $materiasFiltradas = collect();
        $docentesFiltrados = collect();

        // 3. Cargar datos según la vista seleccionada
        if ($currentView === 'materias') {
            $query = $this->getMateriasFiltradasQuery($selectedInstitutoId, $selectedCarreraId, $user);
            $materiasFiltradas = $query->orderBy('cuatrimestre')->paginate(10);
            $this->agregarDocentesPorCargo($materiasFiltradas);
        } elseif ($currentView === 'docentes') {
            $docentesFiltrados = $this->getDocentesFiltrados($selectedInstitutoId, $selectedCarreraId);
        }
        #dd($docentesFiltrados);
        return Inertia::render('Gestion/Dashboard', [
            'user' => $user,
            'institutos' => $institutosDisponibles,
            'selectedInstitutoId' => (int) $selectedInstitutoId,
            'selectedCarreraId' => $selectedCarreraId ?: 'all',
            'currentView' => $currentView,
            'materias' => $materiasFiltradas,
            'docentes' => $docentesFiltrados,
        ]);
    }

    private function getDocentesFiltrados($selectedInstitutoId, $selectedCarreraId)
    {
        if (!$selectedInstitutoId) {
            return collect();
        }

        $query = Docente::query();

        if ($selectedCarreraId && $selectedCarreraId !== 'all') {
            $query->deInstitutoYCarrera($selectedInstitutoId, $selectedCarreraId);
        } else {
            $query->deInstituto($selectedInstitutoId);
        }

        $docentes = $query->with([
            'cargos.dedicacion',
            'comisiones.materia',
        ])
            ->orderBy('apellido')
            ->paginate(15)
            ->withQueryString();

        $docentes->through(function ($doc) {

            return [
                'id' => $doc->id,
                'nombre' => $doc->nombre . ' ' . $doc->apellido,
                'modalidad' => $doc->modalidad_desempeño,
                'horas' => $doc->carga_horaria,

                'cargos' => $doc->cargos->map(function ($cargo) {
                    return [
                        'nombre' => $cargo->nombre,
                        'dedicacion' => $cargo->dedicacion?->nombre,
                    ];
                })->values(),

                'materias' => $doc->comisiones->map(fn($c) => $c->materia->nombre)
                    ->unique()
                    ->values(),
            ];
        });

        return $docentes;
    }



    private function getInstitutosPorRol(User $user)
    {
        $rol = $user->cargo;

        if (in_array($rol, ['Administrador', 'Administrativo de Secretaria Academica'])) {

            return Instituto::with('carreras.planActual')->get(['id', 'nombre']);

        } elseif (in_array($rol, ['Administrativo de instituto', 'Director de instituto', 'Coordinador Academico', 'Consejero'])) {

            $user->instituto->load([
                'carreras' => function ($query) {
                    $query->with('planActual');
                }
            ]);
            return collect([$user->instituto]);

        } elseif ($rol === 'Coordinador de Carrera') {

            $user->instituto->load([
                'carreras' => function ($query) use ($user) {

                    $carreraIds = $user->carreras()->pluck('carrera_id');

                    $query->whereIn('id', $carreraIds)
                        ->with('planActual');
                }
            ]);



            return collect([$user->instituto]);

        } else {

            return collect();
        }

    }

    private function getMateriasDisponibles(User $user, $institutosDisponibles)
    {

        $materiasAsignadas = $user->materias;

        if ($materiasAsignadas->isNotEmpty()) {

            $materiasAsignadas->load('comisiones');

            return $materiasAsignadas;

        } else {

            $todasLasMaterias = collect();

            $institutosDisponibles->load([
                'carreras.planActual.materias.comisiones'
            ]);

            foreach ($institutosDisponibles as $instituto) {

                foreach ($instituto->carreras as $carrera) {
                    $todasLasMaterias = $todasLasMaterias->merge($carrera->planActual->materias);
                }
            }

            return $todasLasMaterias->unique('id');
        }
    }


    private function getMateriasFiltradasQuery($institutoId, $carreraId = 'all', User $user = null)
    {
        $anioActual = date('Y');
        $cargosDisponibles = [
            'Titular',
            'Asociado',
            'Adjunto',
            'Jefe de Trabajos Practicos',
            'Ayudante de Primera'
        ];

        return Materia::query()
            ->where('estado', true)

            // Filtrado por instituto y carrera
            ->whereHas('planes.carrera', function ($q) use ($institutoId, $carreraId, $user) {
                $q->where('instituto_id', $institutoId);

                if ($carreraId !== 'all' && is_numeric($carreraId)) {
                    $q->where('id', $carreraId);
                } elseif ($user && $user->cargo === 'Coordinador de Carrera') {
                    $coordinadorCarreras = $user->carreras()->pluck('carrera_id');
                    $q->whereIn('id', $coordinadorCarreras);
                }
            })

            // Relaciones optimizadas
            ->with([
                'comisiones' => function ($q) use ($anioActual, $cargosDisponibles) {
                    $q->where('anio', $anioActual)
                        ->with([
                            'dictas' => function ($d) use ($cargosDisponibles) {
                                $d->with('cargo', 'docente')
                                    ->whereHas('cargo', function ($c) use ($cargosDisponibles) {
                                        $c->whereIn('nombre', $cargosDisponibles);
                                    });
                            }
                        ]);
                }
            ]);
    }

    private function agregarDocentesPorCargo($paginator)
    {
        $mapaCargos = [
            'Titular' => 'Titular',
            'Asociado' => 'Asociado',
            'Adjunto' => 'Adjunto',
            'Jefe de Trabajos Practicos' => 'JTP',
            'Ayudante de Primera' => 'Asist'
        ];

        foreach ($paginator->items() as $materia) {

            // inicializamos campos: Titular, Asociado, JTP, Asist...
            $docentesPorCargo = array_fill_keys(array_values($mapaCargos), []);

            foreach ($materia->comisiones as $comision) {
                foreach ($comision->dictas as $dicta) {

                    $cargoNombre = $dicta->cargo->nombre;

                    if (!array_key_exists($cargoNombre, $mapaCargos)) {
                        continue;
                    }

                    $clave = $mapaCargos[$cargoNombre];

                    $docentesPorCargo[$clave][] =
                        "{$dicta->docente->apellido}, {$dicta->docente->nombre}";
                }
            }

            // Escribimos los campos de salida
            foreach ($docentesPorCargo as $clave => $nombres) {
                $materia->{$clave} = implode('; ', $nombres);
            }
        }
    }

    /**
     * Render Consejero dashboard with KPIs
     */
    private function renderConsejeroDashboard($user, $institutoId)
    {
        if (!$institutoId) {
            abort(403, 'Usuario sin instituto asignado');
        }

        $instituto = Instituto::findOrFail($institutoId);

        // Obtener todos los KPIs
        $resumenEjecutivo = $this->getResumenEjecutivo($institutoId);
        $distribucionDedicaciones = $this->getDistribucionDedicaciones($institutoId);
        $docentesSobrecargados = $this->getDocentesSobrecargados($institutoId);
        $materiasSinCobertura = $this->getMateriasSinCobertura($institutoId);
        $estadisticasCarreras = $this->getEstadisticasCarreras($institutoId);
        $evolucionHistorica = $this->getEvolucionHistorica($institutoId);

        return Inertia::render('Gestion/DashboardConsejero', [
            'user' => $user,
            'instituto' => $instituto,
            'resumenEjecutivo' => $resumenEjecutivo,
            'distribucionDedicaciones' => $distribucionDedicaciones,
            'docentesSobrecargados' => $docentesSobrecargados,
            'materiasSinCobertura' => $materiasSinCobertura,
            'estadisticasCarreras' => $estadisticasCarreras,
            'evolucionHistorica' => $evolucionHistorica,
        ]);
    }

    /**
     * Resumen ejecutivo del instituto (KPI Consejero)
     */
    private function getResumenEjecutivo($institutoId)
    {
        $anioActual = date('Y');

        $totalCarreras = Carrera::where('instituto_id', $institutoId)
            ->where('estado', true)
            ->count();

        $totalDocentes = Docente::whereHas('dictas.comision.materia.planes.carrera', function ($q) use ($institutoId) {
            $q->where('instituto_id', $institutoId);
        })
            ->where('es_activo', true)
            ->distinct()
            ->count();

        $totalComisiones = Comision::whereHas('materia.planes.carrera', function ($q) use ($institutoId) {
            $q->where('instituto_id', $institutoId);
        })
            ->where('anio', $anioActual)
            ->count();

        $comisionesConCobertura = Comision::whereHas('materia.planes.carrera', function ($q) use ($institutoId) {
            $q->where('instituto_id', $institutoId);
        })
            ->where('anio', $anioActual)
            ->whereHas('dictas', function ($q) {
                $q->whereHas('cargo', function ($c) {
                    $c->whereIn('nombre', ['Titular', 'Asociado', 'Adjunto']);
                });
            })
            ->count();

        $porcentajeCobertura = $totalComisiones > 0
            ? round(($comisionesConCobertura / $totalComisiones) * 100, 1)
            : 0;

        $estadoGeneral = 'green';
        if ($porcentajeCobertura < 70) {
            $estadoGeneral = 'red';
        } elseif ($porcentajeCobertura < 90) {
            $estadoGeneral = 'yellow';
        }

        return [
            'totalCarreras' => $totalCarreras,
            'totalDocentes' => $totalDocentes,
            'totalComisiones' => $totalComisiones,
            'comisionesConCobertura' => $comisionesConCobertura,
            'porcentajeCobertura' => $porcentajeCobertura,
            'estadoGeneral' => $estadoGeneral,
        ];
    }

    /**
     * Distribución de dedicaciones (KPI Consejero)
     */
    private function getDistribucionDedicaciones($institutoId)
    {
        $distribucion = DB::table('docentes')
            ->join('cargos', 'docentes.id', '=', 'cargos.docente_id')
            ->join('dedicaciones', 'cargos.dedicacion_id', '=', 'dedicaciones.id')
            ->join('dictas', 'cargos.id', '=', 'dictas.cargo_id')
            ->join('comisiones', 'dictas.comision_id', '=', 'comisiones.id')
            ->join('materias', 'comisiones.id_materia', '=', 'materias.id')
            ->join('plan_materia', 'materias.id', '=', 'plan_materia.materia_id')
            ->join('planes', 'plan_materia.plan_id', '=', 'planes.id')
            ->join('carreras', 'planes.carrera_id', '=', 'carreras.id')
            ->where('carreras.instituto_id', $institutoId)
            ->where('docentes.es_activo', true)
            ->select('dedicaciones.nombre', DB::raw('COUNT(DISTINCT docentes.id) as cantidad'))
            ->groupBy('dedicaciones.nombre')
            ->get();

        $total = $distribucion->sum('cantidad');

        return $distribucion->map(function ($item) use ($total) {
            return [
                'nombre' => $item->nombre,
                'cantidad' => $item->cantidad,
                'porcentaje' => $total > 0 ? round(($item->cantidad / $total) * 100, 1) : 0,
            ];
        })->values()->all();
    }

    /**
     * Docentes sobrecargados (KPI Consejero)
     */
    private function getDocentesSobrecargados($institutoId)
    {
        $docentes = Docente::whereHas('dictas.comision.materia.planes.carrera', function ($q) use ($institutoId) {
            $q->where('instituto_id', $institutoId);
        })
            ->where('es_activo', true)
            ->with(['cargos.dedicacion'])
            ->get();

        $sobrecargados = [];

        foreach ($docentes as $docente) {
            foreach ($docente->cargos as $cargo) {
                if (!$cargo->dedicacion) {
                    continue;
                }

                $horasAsignadas = $cargo->sum_horas_frente_aula;
                $horasMaximas = $cargo->dedicacion->horas_frente_aula_max;

                if ($horasAsignadas > $horasMaximas) {
                    $sobrecargados[] = [
                        'id' => $docente->id,
                        'nombre' => $docente->nombre . ' ' . $docente->apellido,
                        'dedicacion' => $cargo->dedicacion->nombre,
                        'horasAsignadas' => $horasAsignadas,
                        'horasMaximas' => $horasMaximas,
                        'exceso' => $horasAsignadas - $horasMaximas,
                        'porcentajeExceso' => $horasMaximas > 0
                            ? round((($horasAsignadas - $horasMaximas) / $horasMaximas) * 100, 1)
                            : 0,
                    ];
                }
            }
        }

        return $sobrecargados;
    }

    /**
     * Materias sin cobertura (KPI Consejero)
     */
    private function getMateriasSinCobertura($institutoId)
    {
        $anioActual = date('Y');

        $comisionesSinCobertura = Comision::whereHas('materia.planes.carrera', function ($q) use ($institutoId) {
            $q->where('instituto_id', $institutoId);
        })
            ->where('anio', $anioActual)
            ->whereDoesntHave('dictas', function ($q) {
                $q->whereHas('cargo', function ($c) {
                    $c->whereIn('nombre', ['Titular', 'Asociado', 'Adjunto']);
                });
            })
            ->with('materia')
            ->get();

        return $comisionesSinCobertura->map(function ($comision) {
            return [
                'comisionId' => $comision->id,
                'comisionCodigo' => $comision->codigo,
                'comisionNombre' => $comision->nombre,
                'materiaNombre' => $comision->materia->nombre,
                'turno' => $comision->turno,
                'sede' => $comision->sede,
            ];
        })->values()->all();
    }

    /**
     * Estadísticas por carrera (KPI Consejero)
     */
    private function getEstadisticasCarreras($institutoId)
    {
        $anioActual = date('Y');
        $carreras = Carrera::where('instituto_id', $institutoId)
            ->where('estado', true)
            ->with(['planActual.materias'])
            ->get();

        $estadisticas = [];

        foreach ($carreras as $carrera) {
            if (!$carrera->planActual) {
                continue;
            }

            $materiasIds = $carrera->planActual->materias->pluck('id');
            $totalMaterias = $materiasIds->count();

            $comisiones = Comision::whereIn('id_materia', $materiasIds)
                ->where('anio', $anioActual)
                ->get();

            $totalComisiones = $comisiones->count();

            $comisionesConCobertura = Comision::whereIn('id_materia', $materiasIds)
                ->where('anio', $anioActual)
                ->whereHas('dictas', function ($q) {
                    $q->whereHas('cargo', function ($c) {
                        $c->whereIn('nombre', ['Titular', 'Asociado', 'Adjunto']);
                    });
                })
                ->count();

            $totalDocentes = Docente::whereHas('dictas.comision', function ($q) use ($materiasIds, $anioActual) {
                $q->whereIn('id_materia', $materiasIds)
                    ->where('anio', $anioActual);
            })
                ->where('es_activo', true)
                ->distinct()
                ->count();

            $porcentajeCobertura = $totalComisiones > 0
                ? round(($comisionesConCobertura / $totalComisiones) * 100, 1)
                : 0;

            $estadisticas[] = [
                'carreraId' => $carrera->id,
                'carreraNombre' => $carrera->nombre,
                'totalMaterias' => $totalMaterias,
                'totalComisiones' => $totalComisiones,
                'comisionesConCobertura' => $comisionesConCobertura,
                'porcentajeCobertura' => $porcentajeCobertura,
                'totalDocentes' => $totalDocentes,
            ];
        }

        return $estadisticas;
    }

    /**
     * Evolución histórica (KPI Consejero)
     */
    private function getEvolucionHistorica($institutoId)
    {
        $evolucionDocentes = DB::table('docentes')
            ->join('dictas', 'docentes.id', '=', 'dictas.docente_id')
            ->join('comisiones', 'dictas.comision_id', '=', 'comisiones.id')
            ->join('materias', 'comisiones.id_materia', '=', 'materias.id')
            ->join('plan_materia', 'materias.id', '=', 'plan_materia.materia_id')
            ->join('planes', 'plan_materia.plan_id', '=', 'planes.id')
            ->join('carreras', 'planes.carrera_id', '=', 'carreras.id')
            ->where('carreras.instituto_id', $institutoId)
            ->select(DB::raw('EXTRACT(YEAR FROM docentes.created_at) as anio'), DB::raw('COUNT(DISTINCT docentes.id) as cantidad'))
            ->groupBy(DB::raw('EXTRACT(YEAR FROM docentes.created_at)'))
            ->orderBy(DB::raw('EXTRACT(YEAR FROM docentes.created_at)'))
            ->get();

        $evolucionComisiones = DB::table('comisiones')
            ->join('materias', 'comisiones.id_materia', '=', 'materias.id')
            ->join('plan_materia', 'materias.id', '=', 'plan_materia.materia_id')
            ->join('planes', 'plan_materia.plan_id', '=', 'planes.id')
            ->join('carreras', 'planes.carrera_id', '=', 'carreras.id')
            ->where('carreras.instituto_id', $institutoId)
            ->select('comisiones.anio', DB::raw('COUNT(*) as cantidad'))
            ->groupBy('comisiones.anio')
            ->orderBy('comisiones.anio')
            ->get();

        $evolucionCarreras = DB::table('carreras')
            ->where('instituto_id', $institutoId)
            ->select(DB::raw('EXTRACT(YEAR FROM created_at) as anio'), DB::raw('COUNT(*) as cantidad'))
            ->groupBy(DB::raw('EXTRACT(YEAR FROM created_at)'))
            ->orderBy(DB::raw('EXTRACT(YEAR FROM created_at)'))
            ->get();

        return [
            'docentes' => $evolucionDocentes->all(),
            'comisiones' => $evolucionComisiones->all(),
            'carreras' => $evolucionCarreras->all(),
        ];
    }

}