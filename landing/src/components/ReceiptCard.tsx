const lineItems = [
    ["Tienda en línea propia", "incl."],
    ["Panel administrativo", "incl."],
    ["Catálogo e inventario", "incl."],
    ["Pedidos y clientes", "incl."],
    ["Informe de ventas y ganancias", "incl."],
];

export default function ReceiptCard() {
    return (
        <div className="relative mx-auto w-full max-w-sm rotate-2 select-none transition duration-500 hover:rotate-0 sm:mx-0">
            <div className="receipt-card rounded-sm px-7 pb-7 pt-9 font-mono text-sm text-[var(--color-ink)]">
                <div className="mb-4 flex items-baseline justify-between border-b border-dashed border-[var(--color-paper-line)] pb-3">
                    <span className="font-semibold tracking-tight">COLMERZIA</span>
                    <span className="text-xs text-[var(--color-ink-faint)]">No. 000001</span>
                </div>

                <ul className="flex flex-col gap-2.5">
                    {lineItems.map(([label, value]) => (
                        <li key={label} className="flex items-baseline justify-between gap-3">
                            <span className="text-[var(--color-ink-soft)]">{label}</span>
                            <span className="whitespace-nowrap text-[var(--color-forest)]">
                                {value}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="mt-5 flex items-baseline justify-between border-t border-dashed border-[var(--color-paper-line)] pt-4 text-base font-semibold">
                    <span>Costo en código</span>
                    <span>$0</span>
                </div>

                <div className="absolute -right-3 top-16 rotate-[-9deg] rounded-full border-[3px] border-[var(--color-stamp)] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-[var(--color-stamp)] opacity-90">
                    Lista hoy
                </div>
            </div>
        </div>
    );
}
