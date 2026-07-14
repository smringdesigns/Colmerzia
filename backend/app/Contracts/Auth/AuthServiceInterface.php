<?php

namespace App\Contracts\Auth;

use App\DTOs\Auth\LoginResponseDTO;
use App\Models\User;

interface AuthServiceInterface
{
    public function login(
        string $email,
        string $password
    ): LoginResponseDTO;

    public function logout(
        User $user
    ): void;
}