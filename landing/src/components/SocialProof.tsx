const PARTNERS = [
  { name: "PSE Pagos Seguros", hover: "hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]" },
  { name: "Nequi", hover: "hover:border-pink-500/60 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]" },
  { name: "Daviplata", hover: "hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]" },
  { name: "Bancolombia", hover: "hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]" },
  { name: "Coordinadora", hover: "hover:border-blue-400/60 hover:shadow-[0_0_20px_rgba(96,165,250,0.2)]" },
  { name: "Servientrega", hover: "hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]" },
];

export default function SocialProof() {
  return (
    <section className="w-full bg-[#070b13] border-y border-white/5 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] font-semibold text-slate-400 mb-8">
          Más de <span className="text-cyan-400 font-bold">3,500 negocios colombianos</span> confían en Colmerzia e
          integran pagos oficiales
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-95">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/10 transition-all ${partner.hover}`}
            >
              <span className="text-sm font-bold text-slate-100">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
