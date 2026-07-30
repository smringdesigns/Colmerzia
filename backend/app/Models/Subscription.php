<?php

namespace App\Models;

use App\Support\Plans\PlanRegistry;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory;

    public const STATUS_TRIALING = 'trialing';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_READ_ONLY = 'read_only';
    public const STATUS_CANCELED = 'canceled';

    protected $fillable = [
        'store_id',
        'plan_slug',
        'status',
        'trial_ends_at',
        'current_period_ends_at',
    ];

    protected function casts(): array
    {
        return [
            'trial_ends_at' => 'datetime',
            'current_period_ends_at' => 'datetime',
        ];
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * ¿Se puede crear/editar/eliminar bajo esta suscripción?
     * Lista blanca: Solo se permite si la tienda está en trial o activa.
     */
    public function isWritable(): bool
    {
        return in_array($this->status, [
            self::STATUS_TRIALING,
            self::STATUS_ACTIVE,
        ], true);
    }

    public function hasFeature(string $feature): bool
    {
        return PlanRegistry::hasFeature($this->plan_slug, $feature);
    }

    public function limit(string $key): ?int
    {
        return PlanRegistry::limit($this->plan_slug, $key);
    }

    public function hasReachedLimit(string $key, int $currentCount): bool
    {
        $limit = $this->limit($key);

        return $limit !== null && $currentCount >= $limit;
    }
}