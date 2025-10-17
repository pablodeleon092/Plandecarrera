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
        Schema::create('comisiones', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('nombre');
            $table->string('turno');
            $table->enum('modalidad', ['presencial', 'virtual', 'mixta']);
            $table->string('sede');
            $table->integer('anio');
            $table->integer('horas_teoricas');
            $table->integer('horas_practicas');
            $table->integer('horas_totales');
            $table->boolean('estado');
            $table->foreignId('id_materia')->constrained('materias')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comisiones');
    }
};
