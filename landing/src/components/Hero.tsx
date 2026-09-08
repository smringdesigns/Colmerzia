import { useEffect, useState } from "react";
import { SIGNUP_URL } from "../lib/adminUrl";
import DashboardPreview from "./DashboardPreview";
import FloatingShape from "./FloatingShape";
import NeonPath from "./NeonPath";

// Frases que completan "Tu negocio puede ser..." — cortas, concretas,
// sin inventar métricas ni promesas que la plataforma no pueda cumplir.
const ROTATING_PHRASES = [
    "tu vitrina abierta 24/7",
    "tu próxima gran venta",
    "un negocio sin código",
    "tuyo, no de un tercero",
];

function RotatingPhrase() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % ROTATING_PHRASES.length);
        }, 2400);

        return () => clearInterval(interval);
    }, []);

    return (
        <span className="relative inline-block overflow-hidden align-bottom">
            <span
                key={index}
                className="inline-block text-[var(--color-accent)]"
                style={{ animation: "word-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
                {ROTATING_PHRASES[index]}
            </span>
        </span>
    );
}

export default function Hero() {
    return (
        <section id="top" className="hero-glow relative flex min-h-[90vh] items-center overflow-hidden">
            
            {/* ONDA ORGÁNICA DE NEÓN (Detrás de todo) */}
            <NeonPath variant="wave" className="top-10 left-[-5%] md:left-[2%] opacity-80 w-[350px] md:w-[500px]" />

            {/* FIGURAS FLOTANTES DE NEÓN */}
            <FloatingShape type="circle" color="cyan" className="w-10 h-10 top-[15%] left-[5%]" delay="0s" />
            <FloatingShape type="polygon" color="orange" className="w-16 h-16 bottom-[15%] left-[45%]" delay="1.5s" />
            <FloatingShape type="petal" color="magenta" className="w-8 h-8 top-[20%] right-[40%]" delay="0.5s" />
            <FloatingShape type="square" color="blue" className="w-6 h-6 bottom-[25%] left-[10%]" delay="2s" />

            <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-16">
                <div className="relative flex flex-col justify-center pt-10 md:pt-0">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Hecho para negocios colombianos
                    </span>

                    <h1 className="mt-4 text-4xl font-bold leading-[1.15] tracking-tight text-[var(--color-text-white)] sm:text-5xl lg:text-6xl">
                        Tu negocio puede ser
                        <br />
                        <RotatingPhrase />
                    </h1>

                    <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-text-gray)]">
                        Catálogo, inventario, pedidos y tus ganancias reales en un solo panel — sin pagar por un desarrollador.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-6">
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

                <div className="relative hidden w-full items-center justify-center md:flex lg:h-full">
                    <div className="absolute inset-0 z-0 scale-75 transform rounded-full bg-[var(--color-accent)]/20 blur-[100px] pointer-events-none"></div>
                    <div className="relative z-10 w-full max-w-lg transition-transform duration-500 hover:scale-[1.02]">
                        <DashboardPreview />
                    </div>
                </div>
            </div>

            {/* Degradado de transición a la siguiente sección */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[var(--color-bg-darker)] pointer-events-none z-0"></div>
        </section>
    );
}
