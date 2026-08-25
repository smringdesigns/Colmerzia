<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\CreateWorkspaceRequest;
use App\Http\Requests\Store\UpdateStoreRequest;
use App\Http\Requests\Store\UploadStoreLogoRequest;
use App\Models\Category;
use App\Models\Role;
use App\Models\Store;
use App\Models\Subscription;
use App\Support\BusinessTypes\BusinessTypeRegistry;
use App\Support\Plans\PlanRegistry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoreController extends Controller
{
    /**
     * POST /api/v1/stores (crear el espacio de trabajo de un usuario
     * autenticado que todavía no tiene tienda propia)
     *
     * En el flujo normal de alta (StoreOnboardingService, público, sin
     * sesión) tienda + dueño se crean juntos en un solo paso. Esta
     * ruta cubre el caso complementario: un usuario que YA tiene
     * sesión pero cuyo store_id sigue vacío (por ejemplo, una cuenta
     * creada por un flujo externo, o de soporte, antes de tener
     * tienda asignada). Replica la misma lógica de negocio que el
     * onboarding público (suscripción inicial + rol de dueño) para
     * que la tienda quede en un estado consistente y utilizable de
     * inmediato.
     */
    public function store(CreateWorkspaceRequest $request)
    {
        $user = $request->user();

        if ($user->store_id) {
            abort(422, 'Tu cuenta ya tiene una tienda asociada.');
        }

        $validated = $request->validated();

        $store = DB::transaction(function () use ($validated, $user) {

            // 1. Crear la tienda
            $store = Store::create([
                'uuid' => Str::uuid(),
                'name' => $validated['name'],
                'subdomain' => strtolower($validated['subdomain']),
                'business_type' => $validated['business_type'],
                'is_active' => true,
            ]);

            // 2. Configuración por defecto
            $store->settings()->create([
                'currency' => 'COP',
                'timezone' => 'America/Bogota',
            ]);

            // 2.1 Categorías por defecto según el tipo de negocio,
            // igual que en el onboarding público.
            foreach (BusinessTypeRegistry::defaultCategories($validated['business_type']) as $sortOrder => $categoryName) {
                Category::create([
                    'store_id' => $store->id,
                    'uuid' => Str::uuid(),
                    'name' => $categoryName,
                    'slug' => Str::slug($categoryName),
                    'is_active' => true,
                    'sort_order' => $sortOrder,
                ]);
            }

            // 3. Suscripción inicial, igual que en el onboarding
            // público: plan free, en período de prueba.
            $trialDays = PlanRegistry::trialDays('free');

            Subscription::create([
                'store_id' => $store->id,
                'plan_slug' => 'free',
                'status' => Subscription::STATUS_TRIALING,
                'trial_ends_at' => $trialDays ? now()->addDays($trialDays) : null,
            ]);

            // 4. Rol de dueño para esta tienda, asignado al usuario
            // actual. Sin esto, Gate::before() no le concede ningún
            // permiso y quedaría con sesión pero sin poder hacer nada
            // en su propia tienda recién creada.
            $ownerRole = Role::create([
                'store_id' => $store->id,
                'uuid' => Str::uuid(),
                'name' => 'Dueño de la tienda',
                'slug' => 'store-owner',
                'is_system' => true,
            ]);

            $ownerRole->users()->attach($user->id);

            // 5. Vincular el usuario a la tienda
            $user->update([
                'store_id' => $store->id,
            ]);

            return $store;
        });

        return response()->json([
            'success' => true,
            'message' => 'Tienda creada exitosamente.',
            'data' => $store->load('settings', 'subscription'),
        ], 201);
    }

    /**
     * Resuelve la tienda "actual" para las rutas de Configuración.
     *
     * app('tenant') solo queda vinculado por TenantResolver para
     * usuarios de tienda (X-Tenant). Para un super-admin, el
     * middleware lo salta a propósito (es de nivel plataforma), así
     * que app('tenant') no existe y explota. Si el super-admin igual
     * tiene una tienda propia asignada (como el usuario semilla),
     * caemos a currentStoreId() para resolverla igual.
     */
    private function resolveCurrentStore(Request $request): Store
    {
        if (app()->bound('tenant')) {
            return app('tenant');
        }

        return Store::findOrFail($this->currentStoreId($request));
    }

    /**
     * GET /api/v1/stores/me (Obtener datos de la tienda actual)
     */
    public function me(Request $request)
    {
        $store = $this->resolveCurrentStore($request);

        return response()->json([
            'success' => true,
            'data' => $store->load('settings')
        ]);
    }

    /**
     * PUT /api/v1/settings/store (Panel de Configuración -> pestaña General)
     *
     * Actualiza el nombre de la tienda y su configuración extendida
     * (store_settings) en una sola petición. Los campos son todos
     * opcionales (sometimes): el frontend solo envía lo que cambió.
     */
    public function update(UpdateStoreRequest $request)
    {
        $store = $this->resolveCurrentStore($request);

        $data = $request->validated();

        DB::transaction(function () use ($store, $data) {

            $storeData = collect($data)
                ->only(['name', 'business_type'])
                ->toArray();

            if (!empty($storeData)) {
                $store->update($storeData);
            }

            $settingsData = collect($data)
                ->only([
                    'contact_email',
                    'contact_phone',
                    'currency',
                    'timezone',
                    'logo_path',
                    'theme_colors',
                    'social_links',
                ])
                ->toArray();

            if (!empty($settingsData)) {

                $settings = $store->settings;

                if ($settings) {
                    $settings->update($settingsData);
                } else {
                    $store->settings()->create($settingsData);
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Configuración actualizada correctamente.',
            'data' => $store->fresh()->load('settings'),
        ]);
    }

    /**
     * POST /api/v1/settings/store/logo (Panel de Configuración -> logo)
     *
     * Endpoint separado del update() general porque este recibe un
     * archivo (multipart/form-data), no JSON. Guarda con nombre
     * aleatorio en storage/app/public/stores/{id}/logo (disco
     * "public") y borra el logo anterior para no acumular archivos
     * huérfanos cada vez que el usuario cambia el logo.
     */
    public function uploadLogo(UploadStoreLogoRequest $request)
    {
        $store = $this->resolveCurrentStore($request);

        $settings = $store->settings;

        if ($settings?->logo_path) {
            Storage::disk('public')->delete($settings->logo_path);
        }

        $path = $request->file('logo')->store(
            "stores/{$store->id}/logo",
            'public'
        );

        if ($settings) {
            $settings->update(['logo_path' => $path]);
        } else {
            $store->settings()->create(['logo_path' => $path]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logo actualizado correctamente.',
            'data' => $store->fresh()->load('settings'),
        ]);
    }

    /**
     * DELETE /api/v1/settings/store/logo
     */
    public function removeLogo(Request $request)
    {
        $store = $this->resolveCurrentStore($request);

        $settings = $store->settings;

        if ($settings?->logo_path) {
            Storage::disk('public')->delete($settings->logo_path);
            $settings->update(['logo_path' => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logo eliminado.',
            'data' => $store->fresh()->load('settings'),
        ]);
    }
}