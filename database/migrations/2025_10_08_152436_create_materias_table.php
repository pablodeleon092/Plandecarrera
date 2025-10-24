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
            $table->string('codigo')->unique;
            $table->boolean('estado');
            $table->enum('regimen', ['anual', 'cuatrimestral']);
            $table->integer('cuatrimestre'); #definir
            $table->integer('horas_semanales'); 
            $table->integer('horas_totales'); #definir
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materias');
    }
};
