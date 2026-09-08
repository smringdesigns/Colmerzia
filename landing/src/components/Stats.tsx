const STATS = [
    { value: "5", label: "Tipos de negocio con catálogo listo desde el día uno" },
    { value: "0%", label: "Comisión por venta, en cualquier plan" },
    { value: "30", label: "Días de prueba gratis en el plan Free" },
    { value: "100%", label: "Pensado en pesos colombianos, desde el primer clic" },
];

export default function Stats() {
    return (
        <section className="relative bg-[var(--color-bg-darker)] py-16 border-y border-[var(--color-bg-line)]">
            <div className="mx-auto max-w-7xl px-6 lg:px-16">
                <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:divide-x lg:divide-[var(--color-bg-line)]">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="flex flex-col gap-2 lg:px-8 lg:first:pl-0">
                            <span className="font-display text-4xl font-extrabold tracking-tight text-[var(--color-text-white)] sm:text-5xl">
                                {stat.value}
                            </span>
                            <span className="max-w-[16rem] text-sm leading-snug text-[var(--color-text-gray)]">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
