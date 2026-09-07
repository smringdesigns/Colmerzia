const products = [
    ["Camiseta Oversize", "$89.900", "128 ventas"],
    ["Gorra Clásica", "$49.900", "96 ventas"],
    ["Mug Colmerzia", "$34.900", "74 ventas"],
];

const orders = [
    ["#1048", "María Gómez", "$120.000", "Pagado"],
    ["#1047", "Carlos Ruiz", "$85.000", "Pagado"],
    ["#1046", "Laura M.", "$60.000", "Enviado"],
    ["#1045", "Daniel Pérez", "$95.000", "Pendiente"],
];

export default function ReceiptCard() {
    return (
        <div className="dashboard-wrap">
            <div className="dashboard-glow" />
            <div className="dashboard-card">
                <div className="dashboard-topbar">
                    <div className="flex items-center gap-2">
                        <span className="dashboard-logo">C</span>
                        <span className="font-display text-sm font-semibold text-white">colmerzia</span>
                    </div>
                    <span className="dashboard-menu">☰</span>
                </div>

                <div className="dashboard-body">
                    <aside className="dashboard-sidebar">
                        <div className="dashboard-nav active">⌂ <span>Resumen</span></div>
                        <div className="dashboard-nav">▣ <span>Pedidos</span><b>12</b></div>
                        <div className="dashboard-nav">□ <span>Productos</span></div>
                        <div className="dashboard-nav">▤ <span>Inventario</span></div>
                        <div className="dashboard-nav">♙ <span>Clientes</span></div>
                        <div className="dashboard-nav">⌁ <span>Reportes</span></div>
                        <div className="dashboard-nav">⚙ <span>Configuración</span></div>
                    </aside>

                    <div className="dashboard-main">
                        <div className="dashboard-heading">
                            <div>
                                <h3>¡Hola, Juan! <span>👋</span></h3>
                                <p>Así va tu tienda hoy</p>
                            </div>
                            <span className="dashboard-filter">Últimos 7 días⌄</span>
                        </div>

                        <div className="dashboard-stats">
                            <Stat label="Ventas" value="$2.450.000" trend="↑ 18.8%" />
                            <Stat label="Pedidos" value="86" trend="↑ 12.3%" />
                            <Stat label="Productos" value="128" trend="↑ 7.6%" />
                            <Stat label="Visitas" value="1.248" trend="↑ 21.4%" />
                        </div>

                        <div className="dashboard-panels">
                            <div className="dashboard-panel">
                                <div className="panel-title">Productos más vendidos <span>⌄</span></div>
                                {products.map(([name, price, sales], index) => (
                                    <div className="product-row" key={name}>
                                        <div className={`product-thumb product-${index + 1}`} />
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-[10px] font-semibold text-white">{name}</div>
                                            <div className="product-bar"><i style={{ width: `${90 - index * 18}%` }} /></div>
                                        </div>
                                        <span>{sales}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="dashboard-panel">
                                <div className="panel-title">Pedidos recientes <span>⌄</span></div>
                                {orders.map(([id, name, total, status]) => (
                                    <div className="order-row" key={id}>
                                        <span className="order-id">{id}</span>
                                        <span className="order-name">{name}</span>
                                        <span className="order-total">{total}</span>
                                        <span className={`order-status ${status.toLowerCase()}`}>{status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="store-mini-card">
                <div className="store-mini-head"><span>●</span><span>tu tienda en línea</span><b>↗</b></div>
                <div className="store-products">
                    <MiniProduct title="Camiseta" price="$89.900" type="shirt" />
                    <MiniProduct title="Gorra" price="$49.900" type="cap" />
                    <MiniProduct title="Mug" price="$34.900" type="mug" />
                    <MiniProduct title="Hoodie" price="$129.900" type="hoodie" />
                </div>
            </div>
        </div>
    );
}

function Stat({ label, value, trend }: { label: string; value: string; trend: string }) {
    return (
        <div className="dashboard-stat">
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{trend}</small>
            <div className="stat-chart" />
        </div>
    );
}

function MiniProduct({ title, price, type }: { title: string; price: string; type: string }) {
    return (
        <div className="mini-product">
            <div className={`mini-product-image ${type}`} />
            <strong>{title}</strong>
            <span>{price}</span>
        </div>
    );
}
