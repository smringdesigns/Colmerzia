import { businessTypes } from "../data/content";

export default function BusinessTypes() {
    return (
        <section id="negocios" className="border-b border-[var(--color-bg-line)] py-20">
            <div className="mx-auto max-w-6xl px-6">
                <div className="max-w-xl">
                    <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-white)] sm:text-4xl">
                        No todos los negocios venden igual.
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-[var(--color-text-gray)]">
                        Por eso tu tienda se configura según lo que vendés,
                        no al revés.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {businessTypes.map((type) => (
                        <div
                            key={type.slug}
                            className="rounded-2xl border border-[var(--color-bg-line)] bg-[var(--color-bg-raised)] p-5 transition hover:border-[var(--color-accent)]"
                        >
                            <p className="text-base font-semibold text-[var(--color-text-white)]">
                                {type.name}
                            </p>
                            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                                {type.layout}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
