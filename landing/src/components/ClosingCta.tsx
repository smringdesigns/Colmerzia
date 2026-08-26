import { SIGNUP_URL } from "../lib/adminUrl";

export default function ClosingCta() {
    return (
        <section className="bg-[var(--color-ink)] py-20">
            <div className="mx-auto max-w-3xl px-6 text-center">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-paper)] sm:text-4xl">
                    Tu tienda puede estar lista hoy.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/60">
                    Creá tu cuenta, configurá tu catálogo y empezá a vender.
                    Sin código, sin desarrollador, sin esperar.
                </p>
                <a
                    href={SIGNUP_URL}
                    className="mt-8 inline-block rounded-full bg-[var(--color-gold)] px-8 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition hover:brightness-110"
                >
                    Crear tienda gratis
                </a>
            </div>
        </section>
    );
}
