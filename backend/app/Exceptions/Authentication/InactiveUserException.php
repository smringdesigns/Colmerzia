<?php

namespace App\Exceptions\Authentication;

use App\Exceptions\BaseApiException;

class InactiveUserException extends BaseApiException
{
    protected int $status = 403;

    public function __construct()
    {
        parent::__construct('El usuario se encuentra inactivo.');
    }
}