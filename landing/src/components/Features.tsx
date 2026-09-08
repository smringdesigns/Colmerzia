import React from 'react';
import FloatingShape from './FloatingShape';
import NeonPath from './NeonPath';

const features = [
    {
        code: "CAT-001",
        title: "Catálogo e inventario",
        body: "Controla existencias por producto y variante. Cuando algo se agota, lo sabés antes que tu cliente.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        )
    },
    {
        code: "PED-002",
        title: "Pedidos y clientes",
        body: "Cada pedido con su cliente, su dirección y su estado, todo en un mismo lugar — no en un cuaderno aparte.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        )
    },
    {
        code: "VTA-003",
        title: "Ventas y ganancias reales",
        body: "Ingresos, costos y ganancia por mes, con el informe listo para descargar cuando lo necesites.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        )
    },
    {
        code: "MKT-004",
        title: "Tu propia vitrina",
        body: "Subdominio propio, tu logo, tus redes sociales. Se ve como tu negocio, no como una plantilla genérica.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        )
    },
    {
        code: "USR-005",
        title: "Tu equipo, con permisos",
        body: "Dale acceso a quien lo necesite con roles y permisos, sin tener que compartir tu clave con nadie.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        )
    },
    {
        code: "COP-006",
        title: "Pensado en pesos",
        body: "Moneda, zona horaria e impuestos configurados para Colombia desde el primer día.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )
    },
];

export default function Features() {
    return (
        <section id="funciones" className="relative py-24 section-glow overflow-hidden">
            
            {/* CIRCUITO CIBERNÉTICO DE NEÓN (Detrás de las tarjetas) */}
            <NeonPath variant="circuit" reverseGradient={true} className="bottom-[10%] right-[-5%] opacity-40 w-[400px] rotate-[-15deg]" />

            {/* FIGURAS GEOMÉTRICAS FLOTANTES */}
            <FloatingShape type="circle" color="orange" className="w-6 h-6 top-[15%] left-[8%]" delay="0s" />
            <FloatingShape type="polygon" color="cyan" className="w-12 h-12 bottom-[20%] right-[5%]" delay="1.5s" />
            <FloatingShape type="petal" color="magenta" className="w-8 h-8 top-[45%] left-[90%]" delay="0.8s" />

            <div className="mx-auto max-w-7xl px-6 lg:px-16 relative z-10">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-white)] sm:text-4xl lg:text-5xl mb-6">
                        Todo lo que ya usas en el negocio, <span className="text-[var(--color-accent)] block mt-2">en un solo panel.</span>
                    </h2>
                    <p className="text-lg text-[var(--color-text-gray)]">
                        Diseñado para escalar tus ventas sin depender de múltiples aplicaciones ni hojas de cálculo.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => (
                        <div key={feature.code} className="dark-card p-8 flex flex-col items-start relative group">
                            <div className="flex items-center justify-between w-full mb-6">
                                <div className="w-12 h-12 rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-bg-line)] flex items-center justify-center text-[var(--color-accent)] group-hover:border-[var(--color-accent)]/50 group-hover:shadow-[0_0_15px_rgba(0,188,235,0.15)] transition-all">
                                    {feature.icon}
                                </div>
                                <span className="font-mono text-xs font-semibold tracking-wider text-[var(--color-text-muted)] bg-[var(--color-bg-dark)] border border-[var(--color-bg-line)] px-2.5 py-1 rounded-md">
                                    {feature.code}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[var(--color-text-white)] mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-[var(--color-text-gray)] leading-relaxed text-sm sm:text-base">
                                    {feature.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Degradado para transición a la sección de Precios */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[var(--color-bg-darker)] pointer-events-none z-0"></div>
        </section>
    );
}