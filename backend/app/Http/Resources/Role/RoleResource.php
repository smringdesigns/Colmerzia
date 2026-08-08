<?php

namespace App\Http\Resources\Role;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class RoleResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'uuid' => $this->uuid,

            'name' => $this->name,

            'slug' => $this->slug,

            'description' => $this->description,

            'is_system' => (bool) $this->is_system,

            'users_count' => $this->when(
                $this->users_count !== null,
                fn () => $this->users_count
            ),

            'permissions' => $this->whenLoaded('permissions', function () {
                return $this->permissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                        'slug' => $permission->slug,
                    ];
                });
            }),

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

        ];
    }
}
