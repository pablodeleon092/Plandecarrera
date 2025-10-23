<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrera;
use App\Models\Instituto;
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
}
