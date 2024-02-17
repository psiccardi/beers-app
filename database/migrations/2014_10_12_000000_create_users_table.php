<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{

    public function mock()
    {
        $users = [
            [
                "username" => "root",
                "first_name" => "Root",
                "last_name" => "User",
                "email" => "root@user.com",
                "email_verified_at" => (new \DateTime)->format('Y-m-d H:i:s'),
                "password" => Hash::make("password"),
            ]
        ];

        foreach ($users as $user) {
            DB::table("users")->insert($user);
        }
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('api_token')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        $this->mock();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
