<?php

namespace App\Contracts\Payments;

use App\Models\Order;
use App\Models\Payment;

/**
 * Contrato común para cualquier pasarela de pago.
 *
 * La idea: CheckoutService nunca habla directo con Wompi/PSE/Stripe
 * — siempre habla con esta interfaz. Cuando llegue el momento de
 * integrar una pasarela real, se crea una clase nueva
 * (ej. WompiGateway implements PaymentGatewayInterface) y se cambia
 * el binding en AppServiceProvider — nada de CheckoutService,
 * CheckoutController ni el storefront necesita tocarse.
 */
interface PaymentGatewayInterface
{
    /**
     * Identificador corto de la pasarela ('manual', 'wompi', 'pse',
     * 'stripe'...). Se guarda en payments.provider.
     */
    public function provider(): string;

    /**
     * Métodos de pago que esta pasarela soporta
     * (ej. ['pse', 'card', 'nequi'] para Wompi; ['cash', 'transfer']
     * para la pasarela manual).
     *
     * @return string[]
     */
    public function supportedMethods(): array;

    /**
     * Inicia un cobro para la orden recién creada.
     *
     * Crea el registro en `payments` (status inicial según lo que
     * responda la pasarela) y devuelve instrucciones para el
     * frontend: para una pasarela real esto normalmente es una URL
     * de redirección (ej. la pantalla de PSE del banco) o los datos
     * de un widget embebido. La pasarela manual no tiene nada que
     * redirigir — el pago se confirma después, a mano, desde el
     * panel administrativo.
     *
     * @return array{payment: Payment, redirect_url: ?string, instructions: ?string}
     */
    public function initiate(Order $order, string $method, array $metadata = []): array;
}
