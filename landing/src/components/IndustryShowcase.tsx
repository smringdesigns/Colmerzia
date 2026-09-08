import { useState } from "react";

type Industry = {
  tab: string;
  emoji: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  template: string;
  templateColor: string;
};

const INDUSTRIES: Industry[] = [
  {
    tab: "Moda y Calzado",
    emoji: "🧥",
    badge: "Más popular",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    title: "Boutique & Streetwear",
    description:
      "Variantes de tallas, colores, control de stock por referencia y pasarela de pago instantánea en WhatsApp y PSE.",
    template: "Plantilla Urban",
    templateColor: "text-cyan-400",
  },
  {
    tab: "Café y Alimentos",
    emoji: "☕",
    badge: "Especial",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    title: "Café de Origen & Alimentos",
    description:
      "Suscripciones recurrentes, gramajes personalizados, envíos programados a nivel nacional y cobro por Nequi.",
    template: "Plantilla Gourmet",
    templateColor: "text-amber-400",
  },
  {
    tab: "Tecnología y Gadgets",
    emoji: "🎧",
    badge: "Pro",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    title: "Tecnología & Gadgets",
    description:
      "Especificaciones técnicas avanzadas, garantías, integración con transportadoras y calculadoras de fletes.",
    template: "Plantilla Tech",
    templateColor: "text-pink-400",
  },
  {
    tab: "Belleza y Cuidado",
    emoji: "💄",
    badge: "Nuevo",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    title: "Belleza & Cuidado Personal",
    description:
      "Fichas por tono y presentación, muestras y combos, recordatorios de recompra y checkout en un solo paso.",
    template: "Plantilla Glow",
    templateColor: "text-indigo-400",
  },
];

export default function IndustryShowcase() {
  const [active, setActive] = useState(0);
  const featured = [INDUSTRIES[active], ...INDUSTRIES.filter((_, i) => i !== active)].slice(0, 3);

  return (
    <section className="w-full bg-[#06090e] py-24 relative overflow-hidden ambient-glow-section" id="experiencias">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase font-bold tracking-[0.25em] text-cyan-400 mb-3">VERSATILIDAD TOTAL</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Diseñado para cualquier tipo de negocio en Colombia
          </h2>
          <p className="text-slate-300 text-base">
            Explora cómo se adapta Colmerzia a tu sector con plantillas optimizadas para máxima conversión.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
          {INDUSTRIES.map((industry, i) => (
            <button
              key={industry.tab}
              onClick={() => setActive(i)}
              type="button"
              className={
                i === active
                  ? "px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  : "px-6 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/50 font-medium text-sm transition-all"
              }
            >
              {industry.tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((industry) => (
            <div key={industry.tab} className="magic-border-container">
              <div className="magic-border-content p-6">
                <div className="w-full h-56 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl flex items-center justify-center text-4xl mb-6 border border-white/5 relative overflow-hidden group">
                  <span className="group-hover:scale-110 transition-transform duration-300">{industry.emoji}</span>
                  <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full border ${industry.badgeColor}`}>
                    {industry.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{industry.title}</h3>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">{industry.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-slate-400">{industry.template}</span>
                  <span className={`text-sm font-bold ${industry.templateColor}`}>Incluido gratis</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
