<?php

namespace App\Enums;

enum InventoryMovementType:string
{
    case PURCHASE  = 'purchase';
    case SALE      = 'sale';
    case RETURN    = 'return';
    case ADJUSTMENT = 'adjustment';
    case TRANSFER  = 'transfer';
}