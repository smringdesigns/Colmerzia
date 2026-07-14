<?php

namespace App\Exceptions;

use Exception;

abstract class BaseApiException extends Exception
{
    protected int $status = 400;

    public function status(): int
    {
        return $this->status;
    }
}