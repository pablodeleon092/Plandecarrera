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
        Schema::create('funciones_aulicas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->timestamps();
        });

        Schema::create('dictas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('docente_id')->constrained('docentes')->onDelete('cascade');
            $table->foreignId('cargo_id')->constrained('cargos')->onDelete('cascade');
            $table->foreignId('comision_id')->constrained('comisiones')->onDelete('cascade');
            $table->date('ano_inicio');
            $table->date('año_fin')->nullable();
            $table->foreignId('funcion_aulica_id')->constrained('funciones_aulicas')->nullabe()->nullOnDelete();
            $table->enum('modalidad_presencia', ['presencial', 'virtual', 'mixta']);
            $table->integer('horas_frente_aula');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('funciones_aulicas');
        Schema::dropIfExists('dictas');
    }
};
