<?php

namespace App\Exceptions\Api;

use Exception;

abstract class ApiException extends Exception
{
    public function __construct(
        string $message,
        protected int $status = 400
    ) {
        parent::__construct($message);
    }

    public function status(): int
    {
        return $this->status;
    }
}