import { businessTypes } from "../data/content";

export default function BusinessTypes() {
    return (
        <section id="negocios" className="border-b border-[var(--color-paper-line)] py-20">
            <div className="mx-auto max-w-6xl px-6">
                <div className="max-w-xl">
                    <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                        No todos los negocios venden igual.
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-soft)]">
                        Por eso tu tienda se configura según lo que vendés,
                        no al revés.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {businessTypes.map((type) => (
                        <div
                            key={type.slug}
                            className="rounded-2xl border border-[var(--color-paper-line)] bg-[var(--color-paper-raised)] p-5 transition hover:border-[var(--color-stamp)]"
                        >
                            <p className="font-display text-base font-semibold text-[var(--color-ink)]">
                                {type.name}
                            </p>
                            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--color-ink-faint)]">
                                {type.layout}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
