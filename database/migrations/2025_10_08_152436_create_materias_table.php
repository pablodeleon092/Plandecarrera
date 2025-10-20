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
        Schema::create('materias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('codigo')->unique();
            $table->boolean('estado')->default(true);
            $table->enum('regimen', ['anual', 'cuatrimestral']);
            $table->integer('cuatrimestre')->nullable();;
            $table->integer('horas_semanales'); 
            $table->integer('horas_totales'); #definir
            $table->timestamps();
        });
    }

    //Definir la Relacion con el Plan

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materias');
    }
};