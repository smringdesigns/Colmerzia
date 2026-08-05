import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Warehouse,
} from "lucide-react";

import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import Badge from "../components/ui/Badge";

import {
    getInventory,
    type InventoryItem,
} from "../features/inventory/inventoryApi";


export default function Inventory() {

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);

    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);


    function handleSearch(value: string) {

        setSearch(value);

        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            setDebouncedSearch(value);
            setPage(1);
        }, 500);
    }


    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: [
            "inventory",
            debouncedSearch,
            page,
        ],

        queryFn: () =>
            getInventory({
                page,
                per_page: 15,
                search: debouncedSearch || undefined,
            }),
    });



    return (
        <div className="resource-page">

            <PageHeader
                eyebrow="Almacén"
                title="Inventario"
                subtitle={
                    data
                        ? `${data.total} registros de inventario`
                        : "Cargando inventario..."
                }

                action={
                    data && (
                        <div className="inventory-warehouse">
                            <Warehouse size={18}/>
                            {data.warehouse.name}
                        </div>
                    )
                }
            />


            <Panel className="resource-toolbar">

                <label className="resource-search">

                    <Search size={17}/>

                    <input
                        type="search"
                        placeholder="Buscar producto o SKU..."
                        value={search}
                        onChange={(e) =>
                            handleSearch(e.target.value)
                        }
                    />

                </label>

            </Panel>



            <Panel className="table-panel">

                <div className="windmill-table-wrap">

                    <table className="windmill-table">

                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Variante</th>
                                <th>Cantidad</th>
                                <th>Disponible</th>
                                <th>Estado</th>
                            </tr>
                        </thead>


                        <tbody>


                        {isLoading && (
                            <tr>
                                <td colSpan={6}>
                                    <div className="empty-state">
                                        Cargando inventario...
                                    </div>
                                </td>
                            </tr>
                        )}



                        {isError && (
                            <tr>
                                <td colSpan={6}>
                                    <div className="empty-state danger">
                                        Error cargando inventario.
                                    </div>
                                </td>
                            </tr>
                        )}



                        {!isLoading &&
                        data?.data.length === 0 && (

                            <tr>
                                <td colSpan={6}>
                                    <div className="empty-state">
                                        No hay registros.
                                    </div>
                                </td>
                            </tr>

                        )}




                        {data?.data.map(
                            (item: InventoryItem) => (

                            <tr key={item.id}>


                                <td>

                                    <div className="primary-cell">

                                        <strong>
                                            {item.product_name}
                                        </strong>

                                    </div>

                                </td>



                                <td>

                                    <span className="code-pill">
                                        {item.product_sku}
                                    </span>

                                </td>



                                <td>
                                    {item.variant_name ?? "-"}
                                </td>



                                <td>
                                    {item.quantity}
                                </td>



                                <td>
                                    {item.available}
                                </td>



                                <td>

                                    <Badge
                                        tone={
                                            item.is_low_stock
                                                ? "danger"
                                                : "success"
                                        }
                                    >

                                        {
                                            item.is_low_stock
                                                ? "Stock bajo"
                                                : "Disponible"
                                        }

                                    </Badge>

                                </td>


                            </tr>

                        ))}


                        </tbody>

                    </table>

                </div>


            </Panel>



            {
                data && data.last_page > 1 && (

                    <div className="pagination-bar">

                        <span>
                            Página {data.current_page} de {data.last_page}
                        </span>


                        <div>

                            <Button
                                type="button"
                                variant="secondary"
                                disabled={
                                    data.current_page === 1
                                }
                                onClick={() =>
                                    setPage(
                                        p => Math.max(1, p - 1)
                                    )
                                }
                            >
                                <ChevronLeft size={15}/>
                                Anterior
                            </Button>



                            <Button
                                type="button"
                                variant="secondary"
                                disabled={
                                    data.current_page === data.last_page
                                }
                                onClick={() =>
                                    setPage(
                                        p => Math.min(
                                            data.last_page,
                                            p + 1
                                        )
                                    )
                                }
                            >
                                Siguiente
                                <ChevronRight size={15}/>
                            </Button>


                        </div>


                    </div>

                )
            }


        </div>
    );
}