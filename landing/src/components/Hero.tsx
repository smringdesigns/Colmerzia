import { SIGNUP_URL } from "../lib/adminUrl";
import ReceiptCard from "./ReceiptCard";

export default function Hero() {
    return (
        <section id="top" className="ledger-bg border-b border-[var(--color-paper-line)]">
            <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
                <div>
                    <span className="inline-block rounded-full bg-[var(--color-stamp-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-stamp-dark)]">
                        Hecho para negocios colombianos
                    </span>

                    <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--color-ink)] sm:text-5xl">
                        Monta tu tienda en línea como quien abre las puertas
                        del local.
                    </h1>

                    <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-ink-soft)]">
                        Catálogo, inventario, pedidos, clientes y tus
                        ganancias reales, mes a mes, en un solo panel. Sin
                        pagar por un desarrollador y sin depender de nadie
                        más para vender.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <a
                            href={SIGNUP_URL}
                            className="rounded-full bg-[var(--color-stamp)] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-stamp-dark)]"
                        >
                            Crear tienda gratis
                        </a>
                        <a
                            href="#funciones"
                            className="text-sm font-semibold text-[var(--color-ink)] underline decoration-[var(--color-gold)] decoration-2 underline-offset-4 transition hover:decoration-[var(--color-stamp)]"
                        >
                            Ver qué incluye
                        </a>
                    </div>

                    <p className="mt-5 text-sm text-[var(--color-ink-faint)]">
                        60 días de prueba en el plan Free, sin costo.
                    </p>
                </div>

                <ReceiptCard />
            </div>
        </section>
    );
}
