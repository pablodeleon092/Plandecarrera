<?php

namespace App\Observers;

use App\Models\Comision;
use App\Services\NormativaAsignacion;

class ComisionObserver
{
    /**
     * Handle the Comision "created" event.
     */
    public function created(Comision $comision): void
    {
        //
    }

    /**
     * Handle the Comision "updated" event.
     */
    public function updated(Comision $comision)
    {
        if ($comision->isDirty('estado') && $comision->estado == false) {

            // Obtener todos los Dicta asociados a la comisión
            $dictas = $comision->dictas()->get();

            foreach ($dictas as $dicta) {

                // Recalcular carga del cargo asociado
                NormativaAsignacion::recalcularCargo($dicta->docente, $dicta->cargo);

                // Recalcular carga del docente
                NormativaAsignacion::recalcularCargaHorariaDocente($dicta->docente);
            }
        }
    }

    /**
     * Handle the Comision "deleted" event.
     */
    public function deleted(Comision $comision): void
    {
        //
    }

    /**
     * Handle the Comision "restored" event.
     */
    public function restored(Comision $comision): void
    {
        //
    }

    /**
     * Handle the Comision "force deleted" event.
     */
    public function forceDeleted(Comision $comision): void
    {
        //
    }
}
