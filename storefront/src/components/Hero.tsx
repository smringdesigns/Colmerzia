import { SIGNUP_URL } from "../lib/adminUrl";
import DecorativeShapes from "./DecorativeShapes";

export default function Hero() {
    return (
        <section id="top" className="hero-glow relative overflow-hidden border-b border-[var(--color-bg-line)]">
            <div className="relative mx-auto max-w-4xl px-6 py-28 md:py-36">
                <DecorativeShapes className="left-6 top-0 hidden md:block" />

                <div className="relative max-w-xl md:pt-8">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        Hecho para negocios colombianos
                    </span>

                    <h1 className="mt-4 text-4xl font-bold leading-[1.15] tracking-tight text-[var(--color-text-white)] sm:text-5xl">
                        Monta tu tienda en línea como quien abre las puertas
                        del local
                    </h1>

                    <p className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--color-text-gray)]">
                        Catálogo, inventario, pedidos y tus ganancias reales
                        en un solo panel — sin pagar por un desarrollador.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center gap-5">
                        <a href={SIGNUP_URL} className="btn-glow">
                            Crear tienda gratis
                        </a>
                        <a
                            href="#funciones"
                            className="text-sm font-semibold text-[var(--color-text-white)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-4 transition hover:text-[var(--color-accent)]"
                        >
                            Ver qué incluye
                        </a>
                    </div>

                    <p className="mt-6 text-sm text-[var(--color-text-muted)]">
                        60 días de prueba en el plan Free, sin costo.
                    </p>
                </div>
            </div>
        </section>
    );
}
