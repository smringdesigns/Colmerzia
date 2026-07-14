<?php

namespace App\Http\Controllers\Api\V1\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Contracts\Auth\AuthServiceInterface;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\Auth\LoginResource;
use App\Http\Resources\User\UserResource;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthServiceInterface $authService
    ) {
    }

    public function login(LoginRequest $request): LoginResource
    {
        return new LoginResource(
            $this->authService->login(
                $request->email,
                $request->password
            )
        );
    }

    public function me(Request $request): UserResource
    {
        return new UserResource(
            $request->user()
        );
    }

    public function logout(Request $request)
    {
        $this->authService->logout(
            $request->user()
        );

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ]);
    }
}