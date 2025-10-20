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
        Schema::create('plan_materia', function (Blueprint $table) {
            
            $table->foreignId('plan_id')
                  ->constrained('planes')
                  ->onDelete('cascade');

            $table->foreignId('materia_id')
                  ->constrained('materias')
                  ->onDelete('cascade');
<<<<<<< HEAD
=======
                  
>>>>>>> 08f566039f5abecd8ff6a3b37c5e51b5809629c0
            $table->primary(['plan_id', 'materia_id']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_materia');
    }
};
