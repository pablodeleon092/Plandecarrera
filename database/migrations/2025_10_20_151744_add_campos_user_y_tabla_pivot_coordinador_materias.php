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
        // Agregar campos al user
        Schema::table('users', function (Blueprint $table) {
            $table->biginteger('dni')->unique();
            $table->string('nombre');
            $table->string('apellido');
            $table->boolean('is_activo')->default(true);
            $table->enum('cargo', [
                'Administrador',
                'Administrativo de Secretaria Academica',
                'Administrativo de instituto',
                'Coordinador de Carrera',
                'Director de instituto',
                'Coordinador Academico',
                'Consejero'
            ])->after('is_activo');
            $table->foreignId('instituto_id')->nullable()->constrained('institutos')->nullOnDelete();
        });

        // Crear tabla pivot coordinador_materias
        Schema::create('coordinador_materias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('materia_id')->constrained('materias')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['instituto_id']);
            $table->dropColumn(['dni', 'nombre', 'apellido', 'is_activo', 'cargo', 'instituto_id']);
        });

        Schema::dropIfExists('coordinador_materias');
    }
};
