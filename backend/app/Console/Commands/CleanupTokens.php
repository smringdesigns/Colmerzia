<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:cleanup-tokens')]
#[Description('Command description')]
class CleanupTokens extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
    }
}
