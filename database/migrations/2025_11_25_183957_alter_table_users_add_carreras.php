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

        Schema::dropIfExists('coordinador_materias');

        Schema::create('coordinador_carreras', function (Blueprint $table) {
            $table->id();


            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();


            $table->foreignId('carrera_id')
                  ->constrained('carreras')
                  ->cascadeOnDelete();
                  
            $table->timestamps();

            $table->unique(['user_id', 'carrera_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::dropIfExists('coordinador_carreras');

        Schema::create('coordinador_materias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('materia_id')->constrained('materias')->cascadeOnDelete();
            $table->timestamps();
        });
    }
};
