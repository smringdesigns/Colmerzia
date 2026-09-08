import React from 'react';

// Los datos que ya tenías en el mismo código
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

// Subcomponentes
function Stat({ label, value, trend }: { label: string; value: string; trend: string }) {
    const isPositive = trend.includes("+");
    return (
        <div className="dark-card flex flex-col p-4 rounded-lg border border-[var(--color-bg-line)]">
            <span className="text-[10px] md:text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
                {label}
            </span>
            <div className="mt-2 flex items-end justify-between">
                <strong className="text-lg md:text-xl font-bold text-[var(--color-text-white)]">
                    {value}
                </strong>
                <small className={`font-mono text-xs ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-text-gray)]'}`}>
                    {trend}
                </small>
            </div>
        </div>
    );
}

function MiniProduct({ title, price, sales }: { title: string; price: string; sales: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-bg-line)] transition-colors hover:border-[var(--color-accent)]/50">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-[var(--color-bg-raised)] flex items-center justify-center border border-[var(--color-bg-line)]">
                    <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <strong className="text-sm font-semibold text-[var(--color-text-white)]">
                        {title}
                    </strong>
                    <span className="text-[10px] text-[var(--color-text-gray)] font-mono">
                        {sales}
                    </span>
                </div>
            </div>
            <span className="font-mono text-sm text-[var(--color-success)] font-medium">
                {price}
            </span>
        </div>
    );
}

export default function DashboardPreview() {
    return (
        <div className="dark-card relative w-full max-w-lg rounded-2xl border border-[var(--color-bg-line)] bg-[var(--color-bg-raised)] p-5 md:p-6 shadow-2xl overflow-hidden select-none">
            
            {/* Cabecera del Dashboard */}
            <div className="mb-6 flex items-center justify-between border-b border-[var(--color-bg-line)] pb-4">
                <div className="flex gap-2 items-center">
                    <div className="h-3 w-3 rounded-full bg-[var(--color-accent-pink)]"></div>
                    <div className="h-3 w-3 rounded-full bg-[var(--color-shape-orange)]"></div>
                    <div className="h-3 w-3 rounded-full bg-[var(--color-success)]"></div>
                </div>
                <span className="font-mono text-xs text-[var(--color-text-muted)] border border-[var(--color-bg-line)] px-2 py-1 rounded-md bg-[var(--color-bg-dark)]">
                    Panel de Control
                </span>
            </div>

            {/* Estadísticas Top (Usando el componente Stat) */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Stat label="Ventas del Mes" value="$4.250.000" trend="+15%" />
                <Stat label="Pedidos Totales" value="398" trend="+12" />
            </div>

            {/* Layout de dos columnas para Productos y Órdenes */}
            <div className="grid grid-cols-1 gap-6">
                
                {/* Productos más vendidos (Mapeando tu arreglo 'products') */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                        Más vendidos
                    </h3>
                    <div className="flex flex-col gap-2">
                        {products.map(([title, price, sales]) => (
                            <MiniProduct key={title} title={title} price={price} sales={sales} />
                        ))}
                    </div>
                </div>

                {/* Últimos Pedidos (Mapeando tu arreglo 'orders') */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                        Últimos Pedidos
                    </h3>
                    <div className="rounded-lg border border-[var(--color-bg-line)] bg-[var(--color-bg-dark)] overflow-hidden">
                        {orders.map(([id, name, total, status], index) => (
                            <div 
                                key={id} 
                                className={`flex items-center justify-between p-3 text-sm ${index !== orders.length - 1 ? 'border-b border-[var(--color-bg-line)]' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <span className="font-mono text-[var(--color-text-muted)]">{id}</span>
                                    <span className="font-medium text-[var(--color-text-white)]">{name}</span>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <span className="text-[var(--color-text-gray)]">{total}</span>
                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                        status === 'Pagado' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20' : 
                                        status === 'Pendiente' ? 'bg-[var(--color-shape-orange)]/10 text-[var(--color-shape-orange)] border border-[var(--color-shape-orange)]/20' : 
                                        'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20'
                                    }`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
            
        </div>
    );
}