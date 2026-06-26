<?php

namespace App\Models;

use App\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permission extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Campos asignables.
     */
    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'description',
    ];

    /**
     * Un permiso puede estar asignado a múltiples roles.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
}