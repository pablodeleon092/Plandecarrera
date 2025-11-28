<?php

namespace App\Observers;

use App\Models\Materia;

class MateriaObserver
{
    /**
     * Handle the Materia "created" event.
     */
    public function created(Materia $materia): void
    {
        //
    }

    /**
     * Handle the Materia "updated" event.
     */
    public function updated(Materia $materia): void
    {
        // Si el estado no cambió, no hacemos nada
        if (!$materia->isDirty('estado')) {
            return;
        } 

        $estadoAnterior = $materia->getOriginal('estado');
        $estadoNuevo = $materia->estado;

        // ----------- MATERIA DESACTIVADA → desactivar TODAS las comisiones -----------
        if ($estadoNuevo == false && $estadoAnterior == true) {
            foreach ($materia->comisiones as $comision) {
                if ($comision->estado) {
                    $comision->update(['estado' => false]); // dispara ComisionObserver
                }
            }
        }

        // ----------- MATERIA ACTIVADA → activar SOLO comisiones del año corriente -----------
        if ($estadoNuevo == true && $estadoAnterior == false) {
            foreach ($materia->comisionesCorrienteAño  as $comision) {
                if (! $comision->estado) {
                    $comision->update(['estado' => true]); // dispara ComisionObserver
                }
            }
        }
    }

    /**
     * Handle the Materia "deleted" event.
     */
    public function deleted(Materia $materia): void
    {
        //
    }

    /**
     * Handle the Materia "restored" event.
     */
    public function restored(Materia $materia): void
    {
        //
    }

    /**
     * Handle the Materia "force deleted" event.
     */
    public function forceDeleted(Materia $materia): void
    {
        //
    }
}
