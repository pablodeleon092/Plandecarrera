<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Models\Instituto;
use App\Models\Carrera;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- Importar la Facade Auth
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function home(Request $request)
    {   
        $user = Auth::user();
        $selectedInstitutoId = $request->input('instituto_id');
        $selectedCarreraId = $request->input('carrera_id'); // Podría ser 'all' o un ID numérico

        // 1. Obtener Institutos disponibles (usando tu método existente)
        $institutosDisponibles = $this->getInstitutosPorRol($user); 
        
        // 2. Determinar el Instituto Seleccionado
        if (!$selectedInstitutoId) {
            // Inicializar con el primer instituto si no hay filtro
            $selectedInstitutoId = $institutosDisponibles->first()?->id;
        }

        // 3. Obtener Materias Filtradas (Nueva Lógica)
        $materiasFiltradas = $this->getMateriasFiltradas($selectedInstitutoId, $selectedCarreraId);

        // Si el usuario no es Admin, el sistema podría devolver 'materias' asignadas.
        // Esto dependerá de tu lógica de permisos.
        
        return Inertia::render('Dashboard', [
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

        } else {
   
            return collect(); 
        }
    }

    private function getMateriasDisponibles(User $user, $institutosDisponibles)
    {

        $materiasAsignadas = $user->materias; 

        if ($materiasAsignadas->isNotEmpty()) {
            
            return $materiasAsignadas; 

        } else {
            
            $todasLasMaterias = collect();
            
            $institutosDisponibles->load([
                    'carreras.planActual.materias' 
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
        // Buscar la carrera seleccionada y cargar sus materias
        if ($carreraId !== 'all' && is_numeric($carreraId)) {
            
            $carrera = Carrera::where('id', $carreraId)
                            ->where('instituto_id', $institutoId)
                            ->with('planActual.materias')
                            ->first();
                            
            if ($carrera && $carrera->planActual) {
                // Devolver las materias de esa carrera específica
                return $carrera->planActual->materias;
            }
            return collect();

        } else {
            // Si es 'all', obtener todas las materias de ese instituto

            $instituto = Instituto::where('id', $institutoId)
                                ->with('carreras.planActual.materias')
                                ->first();
            
            if ($instituto) {
                $todasLasMaterias = collect();
                foreach ($instituto->carreras as $carrera) {
                    if ($carrera->planActual) {
                        $todasLasMaterias = $todasLasMaterias->merge($carrera->planActual->materias);
                    }
                }
                return $todasLasMaterias->unique('id');
            }
            return collect();
        }
    }


}