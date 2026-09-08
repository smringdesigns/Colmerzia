import { plans } from "../data/content";
import { SIGNUP_URL } from "../lib/adminUrl";
import FloatingShape from './FloatingShape';
import NeonPath from './NeonPath';

export default function Pricing() {
    return (
        <section id="planes" className="relative py-24 bg-[var(--color-bg-darker)] overflow-hidden">
            
            {/* PULSO DE DATOS DE NEÓN */}
            <NeonPath variant="pulse" className="top-[30%] left-[-10%] md:left-[10%] opacity-30 w-[600px] z-0" />

            {/* FIGURAS GEOMÉTRICAS FLOTANTES */}
            <FloatingShape type="square" color="blue" className="w-8 h-8 top-[10%] right-[12%]" delay="0.5s" />
            <FloatingShape type="circle" color="magenta" className="w-5 h-5 bottom-[15%] left-[8%]" delay="2s" />
            <FloatingShape type="petal" color="cyan" className="w-10 h-10 top-[60%] right-[85%]" delay="1.2s" />

            <div className="mx-auto max-w-7xl px-6 lg:px-16 relative z-10">
                <div className="max-w-2xl mb-16 text-center md:text-left mx-auto md:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-white)] sm:text-4xl lg:text-5xl">
                        Un plan para cada <span className="text-[var(--color-accent)]">tamaño de negocio.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-[var(--color-text-gray)]">
                        Empezá gratis. Subí de plan cuando tu catálogo o tu equipo lo necesiten, no antes.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
                    {plans.map((plan) => (
                        
                        /* 
                           CONTENEDOR DE LA TARJETA (GROUP)
                           Usamos p-[1.5px] para definir el grosor del borde de energía.
                        */
                        <div
                            key={plan.slug}
                            className={`relative group flex flex-col h-full rounded-2xl p-[1.5px] overflow-hidden transition-transform duration-500 hover:-translate-y-2 cursor-default ${
                                plan.highlight ? "z-10 shadow-[0_0_30px_rgba(0,188,235,0.15)] md:-translate-y-2" : ""
                            }`}
                        >
                            
                            {/* 1. BORDE TENUE EN REPOSO (Se oculta al hacer hover) */}
                            <div className={`absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 ${
                                plan.highlight 
                                    ? 'bg-gradient-to-b from-[var(--color-accent)]/60 to-[var(--color-bg-line)]/10' 
                                    : 'bg-gradient-to-b from-[var(--color-bg-line)]/40 to-transparent'
                            }`}></div>

                            {/* 2. CORRIENTE DE ENERGÍA GIRATORIA (Aparece en hover) */}
                            <div
                                className={`absolute inset-[-100%] transition-opacity duration-700 animate-spin ${
                                    plan.highlight ? 'opacity-40 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}
                                style={{
                                    animationDuration: '4s',
                                    backgroundImage: 'conic-gradient(from 0deg, transparent 0%, transparent 70%, #ec4899 85%, #22d3ee 100%)'
                                }}
                            ></div>

                            {/* 3. TARJETA INTERNA OSCURA (Oculta el centro del rayo y deja el contenido visible) */}
                            <div className="relative z-10 flex flex-col h-full w-full bg-[var(--color-bg-dark)] rounded-[calc(1rem-1.5px)] p-8">
                                
                                {/* Resplandor interior extra solo para el plan Pro */}
                                {plan.highlight && (
                                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent)]/5 to-transparent rounded-[calc(1rem-1.5px)] pointer-events-none"></div>
                                )}

                                <div className="relative z-10">
                                    <p className="text-2xl font-bold text-[var(--color-text-white)]">
                                        {plan.name}
                                    </p>
                                    <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                        {plan.trialDays
                                            ? `${plan.trialDays} días de prueba`
                                            : "Sin límite de tiempo"}
                                    </p>
                                </div>

                                <ul className="mt-6 flex flex-col gap-3 text-sm font-medium text-[var(--color-text-gray)] relative z-10">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-bg-line)]"></div>
                                        {plan.limits.products}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-bg-line)]"></div>
                                        {plan.limits.staff}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-bg-line)]"></div>
                                        {plan.limits.warehouses}
                                    </li>
                                </ul>

                                <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-[var(--color-bg-line)] to-transparent relative z-10" />

                                <ul className="flex flex-col gap-3 text-sm text-[var(--color-text-white)] relative z-10 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex gap-3 items-start">
                                            <svg className="w-5 h-5 text-[var(--color-success)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Botón alineado al fondo */}
                                <a
                                    href={SIGNUP_URL}
                                    className={`mt-auto w-full inline-flex items-center justify-center rounded-lg px-5 py-3.5 text-sm font-bold transition-all relative z-10 ${
                                        plan.highlight
                                            ? "bg-[var(--color-accent)] text-[var(--color-bg-darker)] shadow-[0_0_15px_rgba(0,188,235,0.3)] hover:shadow-[0_0_25px_rgba(0,188,235,0.5)] hover:-translate-y-0.5 hover:brightness-110"
                                            : "bg-[var(--color-bg-line)]/30 text-[var(--color-text-white)] border border-[var(--color-bg-line)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-line)]/50"
                                    }`}
                                >
                                    {plan.slug === "free" ? "Empezar gratis" : "Elegir plan"}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}