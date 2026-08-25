import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, DollarSign, Percent, TrendingDown, TrendingUp } from "lucide-react";

import InfoCard from "../components/ui/InfoCard";
import Button from "../components/ui/Button";
import Panel from "../components/ui/Panel";
import PageHeader from "../components/ui/PageHeader";
import { useToast } from "../components/ui/useToast";
import { downloadSalesReport, getSalesReport } from "../features/reports/reportsApi";

function formatMoney(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(dateStr: string) {
    // dateStr viene como "YYYY-MM-DD" (fecha simple, sin hora)
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
    });
}

function currentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function SalesReport() {
    const [month, setMonth] = useState(currentMonth());
    const [downloading, setDownloading] = useState(false);
    const { notify } = useToast();

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getSalesReport(month),
        queryKey: ["reports", "sales", month],
    });

    async function handleDownload() {
        setDownloading(true);

        try {
            await downloadSalesReport(month);
        } catch {
            notify({
                message: "No se pudo descargar el informe. Intenta de nuevo.",
                title: "Error al descargar",
                tone: "error",
            });
        } finally {
            setDownloading(false);
        }
    }

    const summary = data?.summary;
    const maxDailyRevenue = Math.max(1, ...(data?.daily.map((d) => d.revenue) ?? [0]));

    return (
        <div className="resource-page">
            <PageHeader
                eyebrow="Ventas"
                title="Informe de ventas"
                subtitle={
                    data
                        ? `${formatDate(data.range.start)} — ${formatDate(data.range.end)}`
                        : "Cargando..."
                }
                action={
                    <Button
                        onClick={handleDownload}
                        disabled={downloading || isLoading}
                        variant="secondary"
                    >
                        <Download size={16} />
                        {downloading ? "Descargando..." : "Descargar CSV"}
                    </Button>
                }
            />

            <Panel className="resource-toolbar">
                <label className="ui-field" style={{ maxWidth: 220 }}>
                    <span>Mes</span>
                    <div className="ui-input-wrap">
                        <input
                            type="month"
                            className="ui-input"
                            value={month}
                            max={currentMonth()}
                            onChange={(event) => setMonth(event.target.value)}
                        />
                    </div>
                </label>
            </Panel>

            {isError && (
                <Panel className="table-panel">
                    <div className="empty-state danger">
                        Error al cargar el informe. Verifica la conexión con el backend.
                    </div>
                </Panel>
            )}

            {!isError && (
                <>
                    <section className="stats-grid">
                        <InfoCard
                            title="Ingresos"
                            value={isLoading ? "…" : formatMoney(summary?.revenue ?? 0)}
                            caption={`${summary?.orders_count ?? 0} pedidos pagados`}
                            icon={DollarSign}
                            tone="blue"
                        />
                        <InfoCard
                            title="Costos"
                            value={isLoading ? "…" : formatMoney(summary?.cost ?? 0)}
                            caption="Costo de productos vendidos"
                            icon={TrendingDown}
                            tone="orange"
                        />
                        <InfoCard
                            title="Ganancia"
                            value={isLoading ? "…" : formatMoney(summary?.profit ?? 0)}
                            caption={`Margen: ${summary?.margin ?? 0}%`}
                            icon={TrendingUp}
                            tone="green"
                        />
                        <InfoCard
                            title="Ticket promedio"
                            value={isLoading ? "…" : formatMoney(summary?.average_order_value ?? 0)}
                            caption={`Descuentos: ${formatMoney(summary?.discounts_total ?? 0)}`}
                            icon={Percent}
                            tone="purple"
                        />
                    </section>

                    <section className="dashboard-grid">
                        <article className="panel-card">
                            <div className="panel-header">
                                <div>
                                    <h2>Ventas por día</h2>
                                    <p>Ingresos diarios del mes seleccionado</p>
                                </div>
                            </div>

                            {isLoading && <div className="empty-state">Cargando...</div>}

                            {!isLoading && data?.daily.length === 0 && (
                                <div className="empty-state">
                                    No hubo ventas pagadas en este mes.
                                </div>
                            )}

                            {!isLoading && data && data.daily.length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {data.daily.map((day) => (
                                        <div key={day.date}>
                                            <div className="health-row">
                                                <span>{formatDate(day.date)} · {day.orders} pedido{day.orders === 1 ? "" : "s"}</span>
                                                <strong>{formatMoney(day.revenue)}</strong>
                                            </div>
                                            <div className="progress-track">
                                                <span
                                                    style={{
                                                        width: `${Math.round((day.revenue / maxDailyRevenue) * 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </article>

                        <article className="panel-card compact-panel">
                            <h2>Top productos</h2>

                            {isLoading && <div className="empty-state">Cargando...</div>}

                            {!isLoading && data?.top_products.length === 0 && (
                                <div className="empty-state">Sin ventas este mes.</div>
                            )}

                            {!isLoading && data && data.top_products.length > 0 && (
                                <div className="windmill-table-wrap">
                                    <table className="windmill-table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Uds.</th>
                                                <th>Ganancia</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.top_products.map((product) => (
                                                <tr key={product.product_id}>
                                                    <td>{product.product_name}</td>
                                                    <td>{product.quantity}</td>
                                                    <td>{formatMoney(product.profit)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </article>
                    </section>
                </>
            )}
        </div>
    );
}
