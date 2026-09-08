const PLANS = [
  {
    name: "Emprendedor",
    tagline: "Ideal para tiendas que están empezando.",
    price: "$49.000",
    features: ["Hasta 50 productos activos", "Pagos con PSE, Nequi y Daviplata", "Subdominio colmerzia.com"],
    highlighted: false,
    cta: "Empezar con Emprendedor",
  },
  {
    name: "Crecimiento",
    tagline: "Para marcas con ventas constantes.",
    price: "$89.000",
    features: [
      "Productos ilimitados",
      "0% de comisiones por venta",
      "Dominio propio (.co, .com)",
      "Soporte prioritario por WhatsApp",
    ],
    highlighted: true,
    cta: "Elegir Crecimiento",
  },
  {
    name: "Escala / Pro",
    tagline: "Para empresas de alto volumen.",
    price: "$149.000",
    features: ["Todo lo del plan Crecimiento", "Multiusuario con roles y permisos", "Gerente de cuenta dedicado"],
    highlighted: false,
    cta: "Empezar con Pro",
  },
];

export default function Pricing() {
  return (
    <section className="w-full bg-[#06090e] text-white py-24 relative ambient-glow-section" id="precios">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase font-bold tracking-[0.25em] text-cyan-400 mb-2">PRECIOS JUSTOS Y TRANSPARENTES</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Planes pensados para cada etapa de tu negocio
          </h2>
          <p className="text-slate-300 text-base">
            Sin contratos forzosos. Empieza gratis con 14 días de prueba y escala a tu ritmo en pesos colombianos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) =>
            plan.highlighted ? (
              <div key={plan.name} className="magic-border-container transform md:-translate-y-3">
                <div className="magic-border-content p-8 flex flex-col justify-between h-full bg-gradient-to-b from-[#0c1930] to-[#060c18] relative">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-bold text-[11px] uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                    MÁS POPULAR
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-xs text-slate-300 mb-6">{plan.tagline}</p>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-xs text-slate-300">COP / mes</span>
                    </div>
                    <ul className="space-y-3.5 text-sm text-slate-200 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2.5">
                          ✓ {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 font-bold text-sm text-slate-950 text-center transition-all shadow-[0_0_25px_rgba(6,182,212,0.5)] block"
                    href="#crear-tienda"
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            ) : (
              <div key={plan.name} className="dark-card rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mb-6">{plan.tagline}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400">COP / mes</span>
                  </div>
                  <ul className="space-y-3.5 text-sm text-slate-300 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  className="w-full py-3.5 rounded-xl border border-white/20 font-semibold text-sm text-white hover:bg-white/5 text-center transition-colors block"
                  href="#crear-tienda"
                >
                  {plan.cta}
                </a>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
