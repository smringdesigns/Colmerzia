<?php

namespace App\Services\Payments;

use App\Contracts\Payments\PaymentGatewayInterface;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Str;

/**
 * Pasarela "manual": contraentrega o transferencia bancaria directa,
 * sin ningún proveedor externo de por medio.
 *
 * Es el binding por defecto de PaymentGatewayInterface (ver
 * AppServiceProvider) — mantiene exactamente el comportamiento que
 * ya tenía CheckoutService antes de esto: la orden queda con
 * payment_status 'pending' y alguien del equipo la marca como pagada
 * a mano desde el panel. Cuando se integre PSE/Wompi de verdad, esta
 * pasarela sigue existiendo como opción para "pago contraentrega".
 */
class ManualPaymentGateway implements PaymentGatewayInterface
{
    public function provider(): string
    {
        return 'manual';
    }

    public function supportedMethods(): array
    {
        return ['cash', 'transfer'];
    }

    public function initiate(Order $order, string $method, array $metadata = []): array
    {
        $payment = Payment::create([
            'order_id' => $order->id,
            'uuid' => Str::uuid(),
            'provider' => $this->provider(),
            'method' => $method,
            'reference' => 'PAY-' . strtoupper(Str::random(10)),
            'status' => 'pending',
            'amount' => $order->total,
            'currency' => 'COP',
            'metadata' => $metadata,
        ]);

        return [
            'payment' => $payment,
            'redirect_url' => null,
            'instructions' => $method === 'cash'
                ? 'Paga en efectivo cuando recibas tu pedido.'
                : 'Te enviaremos los datos bancarios para la transferencia a tu correo.',
        ];
    }
}
