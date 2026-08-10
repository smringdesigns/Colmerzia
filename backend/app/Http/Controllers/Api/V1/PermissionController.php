<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PermissionController extends Controller
{
    /**
     * Lista todos los permisos disponibles en el sistema, agrupados
     * por módulo (el prefijo antes del punto en el slug: "products",
     * "users", "settings", etc). Se usa para armar el formulario de
     * creación/edición de roles en el frontend.
     */
    public function index(Request $request)
    {
        $permissions = Permission::orderBy('slug')->get();

        $grouped = $permissions
            ->groupBy(function ($permission) {
                return Str::before($permission->slug, '.');
            })
            ->map(function ($group) {
                return $group->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                        'slug' => $permission->slug,
                        'description' => $permission->description,
                    ];
                })->values();
            });

        return response()->json([
            'success' => true,
            'data' => $grouped,
        ]);
    }
}
