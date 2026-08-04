<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use App\Services\Inventory\InventoryService;
use Illuminate\Support\Facades\DB;

class SyncInventoryStock extends Command
{
    protected $signature = 'inventory:sync-stock';

    protected $description = 'Sincroniza stock legacy de productos y variantes hacia Inventory';


    public function handle(InventoryService $inventoryService)
    {
        $this->info('Iniciando sincronización de inventario...');


        Store::chunk(100, function ($stores) use ($inventoryService) {


            foreach ($stores as $store) {


                $this->info(
                    "Procesando tienda: {$store->id}"
                );


                $warehouse = $inventoryService
                    ->defaultWarehouse($store->id);



                /*
                |--------------------------------------------------------------------------
                | Productos simples
                |--------------------------------------------------------------------------
                */

                Product::where('store_id',$store->id)
                    ->where('has_variants',false)
                    ->chunk(100,function($products) use ($warehouse,$inventoryService){


                        foreach($products as $product){


                            $inventory = $inventoryService
                                ->inventoryRow(
                                    $warehouse,
                                    $product->id,
                                    null
                                );


                            $inventory->update([
                                'quantity'=>$product->stock ?? 0
                            ]);


                            $this->line(
                                "Producto {$product->id}: {$product->stock}"
                            );

                        }

                    });



                /*
                |--------------------------------------------------------------------------
                | Productos con variantes
                |--------------------------------------------------------------------------
                */


                ProductVariant::whereHas(
                    'product',
                    function($q) use($store){

                        $q->where(
                            'store_id',
                            $store->id
                        );

                    }
                )
                ->chunk(100,function($variants) use ($warehouse,$inventoryService){


                    foreach($variants as $variant){


                        $inventory = $inventoryService
                            ->inventoryRow(
                                $warehouse,
                                $variant->product_id,
                                $variant->id
                            );


                        $inventory->update([
                            'quantity'=>$variant->stock ?? 0
                        ]);


                        $this->line(
                            "Variante {$variant->id}: {$variant->stock}"
                        );

                    }


                });


            }


        });


        $this->info(
            'Sincronización terminada correctamente.'
        );


        return Command::SUCCESS;
    }
}