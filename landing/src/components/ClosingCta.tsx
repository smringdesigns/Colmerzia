import { SIGNUP_URL } from "../lib/adminUrl";

export default function ClosingCta() {
    return (
<<<<<<< Updated upstream
        <section className="bg-[var(--color-bg-darker)] py-20">
            <div className="mx-auto max-w-3xl px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-white)] sm:text-4xl">
                    Tu tienda puede estar lista hoy.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--color-text-gray)]">
                    Creá tu cuenta, configurá tu catálogo y empezá a vender.
                    Sin código, sin desarrollador, sin esperar.
=======
        <section className="relative isolate overflow-hidden bg-[var(--color-night)] py-20 text-white sm:py-24">
            <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[var(--color-cyan)]/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-32 h-80 w-80 rounded-full bg-[var(--color-pink)]/10 blur-3xl" />
            <div className="relative mx-auto max-w-3xl px-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--color-cyan)]">Listo para empezar</span>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    Tu tienda puede estar lista hoy.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/60">
                    Creá tu cuenta, configurá tu catálogo y empezá a vender. Sin código, sin desarrollador, sin esperar.
>>>>>>> Stashed changes
                </p>
                <a href={SIGNUP_URL} className="btn-glow mt-8">
                    Crear tienda gratis
                </a>
            </div>
        </section>
    );
}
