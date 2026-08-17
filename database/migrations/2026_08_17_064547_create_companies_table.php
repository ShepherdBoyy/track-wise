<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("slug")->unique();
            $table->string("address_line1");
            $table->string("address_line2");
            $table->string("logo_path");
            $table->string('color_one')->default('#55548F');
            $table->string('color_two')->default('#FFC375');
            $table->string('color_three')->default('#F28F77');
            $table->string('color_four')->default('#53A3BD');
            $table->string('color_five')->default('#B9E69E');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};