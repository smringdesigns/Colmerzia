import { SIGNUP_URL } from "../lib/adminUrl";

export default function ClosingCta() {
    return (
        <section className="bg-[var(--color-bg-darker)] py-20">
            <div className="mx-auto max-w-3xl px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-white)] sm:text-4xl">
                    Tu tienda puede estar lista hoy.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--color-text-gray)]">
                    Creá tu cuenta, configurá tu catálogo y empezá a vender.
                    Sin código, sin desarrollador, sin esperar.
                </p>
                <a href={SIGNUP_URL} className="btn-glow mt-8">
                    Crear tienda gratis
                </a>
            </div>
        </section>
    );
}
