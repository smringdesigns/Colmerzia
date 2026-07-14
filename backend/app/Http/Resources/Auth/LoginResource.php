<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;
use App\Http\Resources\User\UserResource;

class LoginResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [

            'user' => new UserResource(
                $this->user
            ),

            'token' => $this->token,

        ];
    }
}