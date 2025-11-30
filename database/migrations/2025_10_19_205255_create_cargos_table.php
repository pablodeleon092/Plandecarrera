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

        Schema::create('dedicaciones', function (Blueprint $table) {
            $table->id();
            $table->enum('nombre', ['Simple', 'SemiExclusiva(DP)', 'SemiExclusiva(DI)', 'Exclusiva']);
            $table->integer('horas_frente_aula_min');
            $table->integer('horas_frente_aula_max');
            $table->integer('nro_materias_max');
            $table->timestamps();
        });

        Schema::create('cargos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->foreignId('dedicacion_id')->constrained('dedicaciones')->onDelete('cascade');
            $table->integer('nro_materias_asig');
            $table->integer('sum_horas_frente_aula');
            $table->foreignId('docente_id')->constrained('docentes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cargos');
        Schema::dropIfExists('dedicaciones');

    }
};
