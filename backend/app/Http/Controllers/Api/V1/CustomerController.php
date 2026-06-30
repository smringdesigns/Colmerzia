<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Customer;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;

class CustomerController extends Controller
{
    /**
     * Lista paginada de clientes.
     * Soporta búsqueda por nombre, correo o documento.
     */
    public function index(Request $request)
    {
        $storeId = $request->user()->store_id;

        $query = Customer::withCount('orders')
            ->where('store_id', $storeId);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'ilike', "%{$search}%")
                  ->orWhere('last_name',  'ilike', "%{$search}%")
                  ->orWhere('email',      'ilike', "%{$search}%")
                  ->orWhere('document_number', 'ilike', "%{$search}%");
            });
        }

        if ($request->has('is_active')) {
            $query->where(
                'is_active',
                filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN)
            );
        }

        $customers = $query
            ->orderBy('created_at', 'desc')
            ->paginate($request->query('per_page', 15));

        return response()->json($customers);
    }

    /**
     * Crea un cliente nuevo.
     */
    public function store(StoreCustomerRequest $request)
    {
        $data = $request->validated();

        $data['store_id'] = $request->user()->store_id;
        $data['uuid']     = Str::uuid();

        $customer = Customer::create($data);

        return response()->json($customer, 201);
    }

    /**
     * Detalle de un cliente con sus direcciones.
     */
    public function show(Request $request, int $id)
    {
        $customer = Customer::with(['addresses'])
            ->withCount('orders')
            ->where('store_id', $request->user()->store_id)
            ->findOrFail($id);

        return response()->json($customer);
    }

    /**
     * Actualiza un cliente.
     */
    public function update(UpdateCustomerRequest $request, int $id)
    {
        $customer = Customer::where('store_id', $request->user()->store_id)
            ->findOrFail($id);

        $customer->update($request->validated());

        return response()->json($customer);
    }

    /**
     * Elimina (soft delete) un cliente.
     */
    public function destroy(Request $request, int $id)
    {
        $customer = Customer::where('store_id', $request->user()->store_id)
            ->findOrFail($id);

        $customer->delete();

        return response()->json([
            'message' => 'Cliente eliminado correctamente.'
        ]);
    }
}
