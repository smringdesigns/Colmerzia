<?php

namespace App\Exceptions\Authentication;

use App\Exceptions\BaseApiException;

class InvalidCredentialsException extends BaseApiException
{
    protected int $status = 401;

    public function __construct()
    {
        parent::__construct('Credenciales inválidas.');
    }
}