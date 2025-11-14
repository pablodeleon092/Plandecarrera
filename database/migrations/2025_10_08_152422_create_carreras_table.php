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
        Schema::create('carreras', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');

            $table->foreignId('instituto_id')
                ->constrained('institutos')
                ->onDelete('cascade');

            $table->enum('modalidad', ['presencial', 'virtual', 'mixta']);
            
            $table->enum('sede', ['Ushuaia', 'Rio Grande', 'Ushuaia/Rio Grande']);

            $table->string('estado') ->default('activa')->change();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carreras');
    }
};
