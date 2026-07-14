<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class UserResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'uuid' => $this->uuid,

            'store_id' => $this->store_id,

            'name' => $this->name,

            'email' => $this->email,

            'is_active' => (bool) $this->is_active,

            'last_login_at' => $this->last_login_at,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

        ];
    }
}