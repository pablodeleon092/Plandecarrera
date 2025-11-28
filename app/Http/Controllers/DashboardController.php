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
        $selectedCarreraId = $request->input('carrera_id');


        $institutosDisponibles = $this->getInstitutosPorRol($user)
            ->map(function ($inst) {
                $inst->carreras = $inst->carreras->where('estado', true)->values();
                return $inst;
            });

        if (!$selectedInstitutoId) {
            $selectedInstitutoId = $institutosDisponibles->first()?->id;
        }


        $query = $this->getMateriasFiltradasQuery($selectedInstitutoId, $selectedCarreraId);


        $materiasPaginadas = $query->orderBy('cuatrimestre')->paginate(10);

        $this->agregarDocentesPorCargo($materiasPaginadas);



        return Inertia::render('Gestion/Dashboard', [
            'user' => $user,
            'institutos' => $institutosDisponibles,
            'selectedInstitutoId' => (int)$selectedInstitutoId,
            'selectedCarreraId' => $selectedCarreraId ?: 'all',
            'materias' => $materiasPaginadas,
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


    private function getMateriasFiltradasQuery($institutoId, $carreraId = 'all')
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
            ->whereHas('planes.carrera', function ($q) use ($institutoId, $carreraId) {
                $q->where('instituto_id', $institutoId);

                if ($carreraId !== 'all' && is_numeric($carreraId)) {
                    $q->where('id', $carreraId);
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

} 