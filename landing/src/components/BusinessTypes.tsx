import { businessTypes } from "../data/content";

export default function BusinessTypes() {
    return (
        <section id="negocios" className="relative py-24 section-soft overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-16 relative z-10">
                
                {/* Encabezado */}
                <div className="max-w-2xl mb-14">
                    <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-white)] sm:text-4xl lg:text-5xl">
                        No todos los negocios <span className="text-[var(--color-accent-pink)]">venden igual.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-[var(--color-text-gray)]">
                        Por eso tu tienda se configura según lo que vendés, no al revés.
                    </p>
                </div>

                {/* Grilla de tipos de negocio (2 columnas en móvil, 3 en tablet, 5 en escritorio) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {businessTypes.map((type) => (
                        <div
                            key={type.slug}
                            className="dark-card group p-6 flex flex-col justify-between min-h-[140px] cursor-pointer"
                        >
                            {/* Pequeño acento visual (LED que se enciende en hover) */}
                            <div className="w-2 h-2 rounded-full bg-[var(--color-bg-line)] group-hover:bg-[var(--color-accent)] group-hover:shadow-[0_0_10px_rgba(0,188,235,0.8)] transition-all mb-4 duration-300"></div>
                            
                            <div>
                                <p className="text-base md:text-lg font-bold text-[var(--color-text-white)] group-hover:text-[var(--color-accent-bright)] transition-colors">
                                    {type.name}
                                </p>
                                <p className="mt-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[var(--color-text-muted)] group-hover:text-[var(--color-text-gray)] transition-colors">
                                    {type.layout}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
        </section>
    );
}