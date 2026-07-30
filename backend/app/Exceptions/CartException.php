<?php

namespace App\Exceptions;

use Exception;

/**
 * Excepción de negocio para el carrito/checkout (stock insuficiente,
 * cupón inválido, etc). Se traduce a una respuesta 422 con el mensaje
 * tal cual, en el controller — no es un error de servidor.
 */
class CartException extends Exception
{
}
