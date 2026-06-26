<?php

namespace App\Models;

use App\Models\Store;
use App\Models\User;
use App\Models\Permission;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'store_id',
        'uuid',
        'name',
        'slug',
        'description',
        'is_system',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'is_system' => 'boolean',
        ];
    }

    /**
     * Un rol pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Un rol puede pertenecer a múltiples usuarios.
     */
    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * Un rol puede tener múltiples permisos.
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }
}