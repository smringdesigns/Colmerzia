<?php

namespace App\DTOs\Auth;

use App\Models\User;

final readonly class LoginResponseDTO
{
    public function __construct(
        public User $user,
        public string $token,
    ) {
    }
}