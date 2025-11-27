<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Models\Instituto;
use App\Models\Carrera;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth; 
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function home(Request $request)
    {   
        $user = Auth::user();
        $selectedInstitutoId = $request->input('instituto_id');
        $selectedCarreraId = $request->input('carrera_id'); // Podría ser 'all' o un ID numérico

        // 1. Obtener institutos por rol
        $institutosDisponibles = $this->getInstitutosPorRol($user)
            ->map(function ($inst) {
                // Filtrar solo carreras activas del instituto
                $inst->carreras = $inst->carreras->where('estado', true)->values();
                return $inst;
            });
            
        // 2. Determinar el Instituto Seleccionado
        if (!$selectedInstitutoId) {
            // Inicializar con el primer instituto si no hay filtro
            $selectedInstitutoId = $institutosDisponibles->first()?->id;
        }

        // 3. Obtener Materias Filtradas (Nueva Lógica)
        $materiasFiltradas = $this->getMateriasFiltradas($selectedInstitutoId, $selectedCarreraId);

    
        return Inertia::render('Gestion/Dashboard', [
            'user' => $user,
            'institutos' => $institutosDisponibles,
            'selectedInstitutoId' => (int)$selectedInstitutoId, // Pasar el ID seleccionado
            'selectedCarreraId' => $selectedCarreraId ?: 'all', // Pasar el ID seleccionado
            'materias' => $materiasFiltradas,
        ]);
    }

    private function getInstitutosPorRol(User $user)
    {
        $rol = $user->cargo;

        if (in_array($rol, ['Administrador', 'Administrativo de Secretaria Academica'])) {
   
            return Instituto::with('carreras.planActual')->get(['id', 'nombre']);
                    
        } elseif (in_array($rol, ['Administrativo de instituto', 'Director de instituto', 'Coordinador Academico', 'Consejero'])) {
            
            $user->instituto->load(['carreras' => function ($query) {
                        $query->with('planActual');
                    }]);
            return collect([$user->instituto]);

        } elseif ($rol === 'Coordinador de Carrera') {
        
            $user->instituto->load(['carreras' => function ($query) use ($user) {

                $carreraIds = $user->carreras()->pluck('carrera_id');
                
                $query->whereIn('id', $carreraIds) 
                    ->with('planActual'); 
            }]);

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


    private function getMateriasFiltradas($institutoId, $carreraId = 'all')
    {
            // 🚨 Cargos a filtrar
            $cargosDisponibles = [
                'Titular',
                'Asociado',
                'Adjunto',
                'Jefe de Trabajos Practicos',
                'Ayudante de Primera'
            ];

            $anioActual = date('Y'); // Obtener el año actual (e.g., 2025)

            $comisionesEagerLoad = [
                // 1. FILTRAR POR MATERIAS ACTIVAS (estado = true)
                'planActual.materias' => function ($query) {
                    // Restringir: Solo materias activas
                    $query->where('estado', true);
                },

                // 2. FILTRAR POR COMISIONES DEL AÑO ACTUAL Y APLICAR FILTROS DE CARGO
                'planActual.materias.comisiones' => function ($query) use ($cargosDisponibles, $anioActual) {
                    
                    // 🛑 FILTRO DE AÑO: Solo comisiones del año actual
                    $query->where('anio', $anioActual) // Asume que 'anio' es el campo de año en la tabla 'comisiones'
                    
                        // Cargar y filtrar las 'dictas' (asignaciones docentes)
                        ->with([
                        'dictas' => function ($q) use ($cargosDisponibles) {
                            $q->with('docente', 'cargo')
                                ->whereHas('cargo', function ($qCargo) use ($cargosDisponibles) {
                                    $qCargo->whereIn('nombre', $cargosDisponibles); 
                                });
                        }
                    ]);
                }
            ];
                
            $user = Auth::user();
            $materiasColeccion = collect();

            if ($carreraId !== 'all' && is_numeric($carreraId)) {
                // Lógica para una carrera específica
                $carrera = Carrera::where('id', $carreraId)
                                ->where('instituto_id', $institutoId)
                                ->with($comisionesEagerLoad)
                                ->first();
                                
                if ($carrera && $carrera->planActual) {
                    $materiasColeccion = $carrera->planActual->materias;
                }
            } else {
                // Lógica para todas las carreras del instituto
                $institutoQuery = Instituto::where('id', $institutoId);
                
                if ($user->cargo === 'Coordinador de Carrera') {

                    $carreraIdsAsignadas = $user->carreras()->pluck('carrera_id');
                        
                        // Cargar SOLO las carreras del instituto que están en la lista de asignadas
                    $institutoQuery->with(['carreras' => function ($qCarrera) use ($comisionesEagerLoad, $carreraIdsAsignadas) {
                        $qCarrera->whereIn('id', $carreraIdsAsignadas);
                        $qCarrera->with($comisionesEagerLoad);
                    }]);
                } else {
                    $institutoQuery->with(['carreras' => function ($qCarrera) use ($comisionesEagerLoad) {
                        $qCarrera->with($comisionesEagerLoad);
                    }]);
                }

                $instituto = $institutoQuery->first();
                    
                // Procesar las materias de las carreras cargadas
                if ($instituto) {
                    foreach ($instituto->carreras as $carrera) {
                        if ($carrera->planActual) {
                            // Mergeamos las materias de los planes de cada carrera
                            $materiasColeccion = $materiasColeccion->merge($carrera->planActual->materias);
                        }
                    }
                    $materiasColeccion = $materiasColeccion->unique('id');
                }
            }


            $mapaCargos = [
                'Titular' => 'Titular',
                'Asociado' => 'Asociado',
                'Adjunto' => 'Adjunto',
                'Jefe de Trabajos Practicos' => 'JTP',
                'Ayudante de Primera' => 'Asist'
            ];
            
            $materiasColeccion->each(function ($materia) use ($cargosDisponibles, $mapaCargos) {
                
                $docentesPorCargo = array_fill_keys(array_keys($mapaCargos), []);
                $docenteKeys = []; // Para asegurar unicidad por cargo y docente

                foreach ($materia->comisiones as $comision) {
                    foreach ($comision->dictas as $dicta) {
                        $cargoNombre = $dicta->cargo->nombre;
                        $docente = $dicta->docente;

                        if (in_array($cargoNombre, $cargosDisponibles)) {
                            
                            $claveCorta = $mapaCargos[$cargoNombre];
                            $uniqueKey = $claveCorta . '_' . $docente->id;
                            
                            // Añadimos el docente solo si no ha sido procesado ya para ese cargo en esta materia
                            if (!isset($docenteKeys[$uniqueKey])) {
                                // Formato: Apellido, Nombre
                                $docentesPorCargo[$claveCorta][] = "{$docente->apellido}, {$docente->nombre}";
                                $docenteKeys[$uniqueKey] = true;
                            }
                        }
                    }
                }

                // Asignar los strings formateados como nuevos atributos de la materia
                foreach ($docentesPorCargo as $claveCorta => $nombres) {
                    // Usamos setAttribute para agregar un dato temporal que se serializará a JSON
                    $materia->setAttribute($claveCorta, implode('; ', $nombres));
                }
            });

            // --- 3. Devolución de la Colección Procesada ---

            // La colección de materias ya tiene los nuevos atributos Titular, Asociado, JTP, etc.
            return $materiasColeccion;
        }

} 