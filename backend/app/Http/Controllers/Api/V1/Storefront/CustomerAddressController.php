<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\SaveCustomerAddressRequest;
use App\Http\Resources\Storefront\CustomerAddressResource;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * CRUD de direcciones guardadas del cliente autenticado. Siempre
 * scoped a $request->user('sanctum') — un cliente jamás puede leer
 * ni tocar las direcciones de otro, no hace falta pasar customer_id
 * en la URL.
 */
class CustomerAddressController extends Controller
{
    public function index(Request $request)
    {
        $customer = $request->user('sanctum');

        return CustomerAddressResource::collection(
            $customer->addresses()->orderByDesc('is_default')->get()
        );
    }

    public function store(SaveCustomerAddressRequest $request)
    {
        /** @var Customer $customer */
        $customer = $request->user('sanctum');

        $address = $this->save($customer, $request->validated());

        return new CustomerAddressResource($address);
    }

    public function update(SaveCustomerAddressRequest $request, int $id)
    {
        /** @var Customer $customer */
        $customer = $request->user('sanctum');

        $address = $customer->addresses()->findOrFail($id);

        $address = $this->save($customer, $request->validated(), $address);

        return new CustomerAddressResource($address);
    }

    public function destroy(Request $request, int $id)
    {
        /** @var Customer $customer */
        $customer = $request->user('sanctum');

        $customer->addresses()->findOrFail($id)->delete();

        return response()->json([
            'message' => 'Dirección eliminada.',
        ]);
    }

    private function save(Customer $customer, array $data, $address = null)
    {
        // Si esta dirección se marca como default, las demás del
        // mismo cliente dejan de serlo — solo puede haber una.
        if (!empty($data['is_default'])) {
            $customer->addresses()->update(['is_default' => false]);
        }

        $data['customer_id'] = $customer->id;

        if (!$address) {
            $data['uuid'] = Str::uuid();
            return $customer->addresses()->create($data);
        }

        $address->update($data);

        return $address->fresh();
    }
}
