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
        Schema::create('docentes', function (Blueprint $table) {
            $table->id();
            $table->integer('legajo');
            $table->string('nombre');
            $table->string('apellido');
            $table->enum('modalidad_desempeño', ['Investigador', 'Desarrollo']);
            $table->integer('carga_horaria');
            $table->boolean('es_activo');
            $table->timestamps();
            $table->string('telefono', 50)->nullable();
            $table->string('email', 255)->unique()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('docentes');
    }
};
