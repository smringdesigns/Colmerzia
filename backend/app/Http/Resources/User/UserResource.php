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

            /*
            |--------------------------------------------------------------------------
            | Roles
            |--------------------------------------------------------------------------
            */

            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'slug' => $role->slug,
                    ];
                });
            }),

            /*
            |--------------------------------------------------------------------------
            | Permissions
            |--------------------------------------------------------------------------
            */

            'permissions' => $this->whenLoaded('roles', function () {

                return $this->roles
                    ->flatMap(function ($role) {
                        return $role->permissions;
                    })
                    ->unique('id')
                    ->values()
                    ->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                            'slug' => $permission->slug,
                        ];
                    });
            }),

        ];
    }
}