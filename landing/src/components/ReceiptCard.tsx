import React from 'react';

// 1. Textos corregidos con tildes y caracteres limpios
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

// 2. Agregué el array faltante para que el map() funcione
const lineItems = [
    ["Desarrollo web", "$3.500.000"],
    ["Hosting (1 año)", "$450.000"],
    ["Pasarela de pagos", "$200.000"],
];

export default function ReceiptCard() {
    return (
        <div className="relative mx-auto w-full max-w-sm rotate-2 select-none transition-all duration-500 hover:rotate-0 hover:-translate-y-2 md:mx-0">
            
            {/* Contenedor principal: De papel blanco a tarjeta oscura tecnológica */}
            <div className="dark-card rounded-xl px-7 pb-7 pt-9 font-mono text-sm shadow-2xl">
                
                {/* Cabecera del ticket */}
                <div className="mb-4 flex items-baseline justify-between border-b border-dashed border-[var(--color-bg-line)] pb-3">
                    <span className="font-bold tracking-widest text-[var(--color-accent)] drop-shadow-[0_0_8px_rgba(0,188,235,0.4)]">
                        COLMERZIA
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">No. 000001</span>
                </div>
                
                {/* Lista de ítems tachados (mostrando el ahorro) */}
                <ul className="flex flex-col gap-3">
                    {lineItems.map(([label, value]) => (
                        <li key={label} className="flex items-baseline justify-between gap-3">
                            <span className="text-[var(--color-text-gray)]">{label}</span>
                            {/* Tachamos los precios viejos con la variable rosa de acento */}
                            <span className="whitespace-nowrap text-[var(--color-text-muted)] line-through decoration-[var(--color-accent-pink)] decoration-2">
                                {value}
                            </span>
                        </li>
                    ))}
                </ul>
                
                {/* Total (Gratis) */}
                <div className="mt-5 flex items-baseline justify-between border-t border-dashed border-[var(--color-bg-line)] pt-4 text-base font-bold text-[var(--color-text-white)]">
                    <span>Costo en código</span>
                    <span className="text-[var(--color-success)] drop-shadow-[0_0_8px_rgba(106,191,75,0.5)]">
                        $0
                    </span>
                </div>
                
                {/* Sello: De tinta física a Badge Neón */}
                <div className="absolute -right-4 top-12 rotate-[-12deg] rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg-dark)]/90 backdrop-blur px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] shadow-[0_0_15px_rgba(0,188,235,0.25)]">
                    Lista hoy
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   SUBCOMPONENTES DEL DASHBOARD MOCKUP
   Los actualizamos para que usen las clases de Tailwind de tu tema
========================================================= */

export function Stat({ label, value, trend }: { label: string; value: string; trend: string }) {
    const isPositive = trend.includes("+") || trend.includes("up");
    return (
        <div className="dark-card flex flex-col p-4 rounded-lg border border-[var(--color-bg-line)]">
            <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
                {label}
            </span>
            <div className="mt-2 flex items-end justify-between">
                <strong className="text-xl font-bold text-[var(--color-text-white)]">
                    {value}
                </strong>
                <small className={`font-mono text-xs ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-accent-pink)]'}`}>
                    {trend}
                </small>
            </div>
        </div>
    );
}

export function MiniProduct({ title, price, type }: { title: string; price: string; type: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-raised)] border border-[var(--color-bg-line)] transition-colors hover:border-[var(--color-accent)]/50 cursor-default">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-[var(--color-bg-dark)] flex items-center justify-center border border-[var(--color-bg-line)]">
                    {/* Placeholder para la imagen del producto */}
                    <span className="text-[10px] text-[var(--color-text-muted)] font-mono">IMG</span>
                </div>
                <div className="flex flex-col">
                    <strong className="text-sm font-semibold text-[var(--color-text-white)]">
                        {title}
                    </strong>
                    <span className="text-xs text-[var(--color-text-gray)]">
                        {type}
                    </span>
                </div>
            </div>
            <span className="font-mono text-sm text-[var(--color-success)] font-medium">
                {price}
            </span>
        </div>
    );
}