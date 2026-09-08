const AVAILABLE_NOW = { name: "Pago manual", detail: "Efectivo y transferencia" };

const COMING_SOON = ["PSE", "Nequi", "Daviplata"];

export default function SocialProof() {
    return (
        <section className="relative border-y border-[var(--color-bg-line)] bg-[var(--color-bg-darker)] py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-16">
                <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                    Cómo cobras hoy — y lo que se viene
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                    {/* Lo que ya funciona */}
                    <div className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-5 py-3">
                        <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                        <span className="text-sm font-bold text-[var(--color-text-white)]">{AVAILABLE_NOW.name}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">· {AVAILABLE_NOW.detail}</span>
                    </div>

                    {/* Lo que viene, marcado sin ambigüedad como no disponible aún */}
                    {COMING_SOON.map((method) => (
                        <div
                            key={method}
                            className="flex items-center gap-2.5 rounded-2xl border border-dashed border-[var(--color-bg-line)] bg-white/[0.02] px-5 py-3 opacity-70"
                        >
                            <span className="text-sm font-semibold text-[var(--color-text-gray)]">{method}</span>
                            <span className="rounded-full border border-[var(--color-bg-line)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                                Próximamente
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
