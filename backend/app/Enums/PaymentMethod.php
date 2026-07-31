<?php

namespace App\Enums;

enum PaymentMethod:string
{
    case CASH         = 'cash';
    case CARD         = 'card';
    case PSE          = 'pse';
    case NEQUI        = 'nequi';
    case DAVIPLATA    = 'daviplata';
    case PAYPAL       = 'paypal';
    case STRIPE       = 'stripe';
    case MERCADOPAGO  = 'mercadopago';
}