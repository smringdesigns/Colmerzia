const features = [
    { code: "CAT-001", title: "Catálogo e inventario", body: "Controla existencias por producto y variante. Cuando algo se agota, lo sabés antes que tu cliente." },
    { code: "PED-002", title: "Pedidos y clientes", body: "Cada pedido con su cliente, su dirección y su estado, todo en un mismo lugar — no en un cuaderno aparte." },
    { code: "VTA-003", title: "Ventas y ganancias reales", body: "Ingresos, costos y ganancia por mes, con el informe listo para descargar cuando lo necesites." },
    { code: "MKT-004", title: "Tu propia vitrina", body: "Subdominio propio, tu logo, tus redes sociales. Se ve como tu negocio, no como una plantilla genérica." },
    { code: "USR-005", title: "Tu equipo, con permisos", body: "Dale acceso a quien lo necesite con roles y permisos, sin tener que compartir tu clave con nadie." },
    { code: "COP-006", title: "Pensado en pesos colombianos", body: "Moneda, zona horaria e impuestos configurados para Colombia desde el primer día." },
];

export default function Features() {
    return (
<<<<<<< Updated upstream
        <section id="funciones" className="section-glow border-b border-[var(--color-bg-line)] py-20">
            <div className="mx-auto max-w-6xl px-6">
                <div className="max-w-xl">
                    <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-white)] sm:text-4xl">
=======
        <section id="funciones" className="section-soft border-b border-[var(--color-paper-line)] py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="max-w-2xl">
                    <span className="feature-code text-xs font-semibold uppercase tracking-[.18em]">02 / Plataforma</span>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
>>>>>>> Stashed changes
                        Todo lo que ya usas en el negocio, en un solo panel.
                    </h2>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
                    {features.map((feature) => (
<<<<<<< Updated upstream
                        <div key={feature.code} className="flex gap-4">
                            <span className="mt-1 shrink-0 font-mono text-xs text-[var(--color-accent)]">
                                {feature.code}
                            </span>
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--color-text-white)]">
                                    {feature.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-gray)]">
                                    {feature.body}
                                </p>
=======
                        <div key={feature.code} className="flex gap-4 border-t border-[var(--color-paper-line)] pt-5">
                            <span className="mt-1 shrink-0 font-mono text-xs text-[var(--color-stamp)]">{feature.code}</span>
                            <div>
                                <h3 className="font-display text-lg font-semibold text-[var(--color-ink)]">{feature.title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-soft)]">{feature.body}</p>
>>>>>>> Stashed changes
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
