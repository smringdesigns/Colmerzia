<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required'],
        ]);

        $user = User::where(
            'email',
            $validated['email']
        )->first();

        if (
            !$user ||
            !Hash::check(
                $validated['password'],
                $user->password
            )
        ) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ],401);
        }

        $token = $user
            ->createToken('commerzia')
            ->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json(
            $request->user()
        );
    }

    public function logout(Request $request)
    {
        $request
            ->user()
            ->currentAccessToken()
            ->delete();

        return response()->json([
            'message' => 'Logout exitoso'
        ]);
    }
}