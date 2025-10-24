<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Cambiar la columna 'nombre' a varchar y agregar un check constraint
        DB::statement("
            ALTER TABLE cargos
            ALTER COLUMN nombre TYPE varchar(255),
            ALTER COLUMN nombre SET NOT NULL,
            ADD CONSTRAINT nombre_enum_check CHECK (nombre IN (
                'Titular', 
                'Asociado', 
                'Adjunto', 
                'Jefe de Trabajos Practicos', 
                'Ayudante de Primera'
            ))
        ");
    }

    public function down(): void
    {
        // Quitar el constraint
        DB::statement("
            ALTER TABLE cargos
            DROP CONSTRAINT nombre_enum_check
        ");
    }
};
