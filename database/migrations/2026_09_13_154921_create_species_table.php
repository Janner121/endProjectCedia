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
        Schema::create('species', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_comun', 80);
            $table->string('nombre_cientifico', 100)->nullable();
            $table->unsignedTinyInteger('frecuencia_riego_dias');
            $table->enum('luz', ['sol_directo', 'luz_indirecta', 'sombra']);
            $table->text('cuidados')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('species');
    }
};
