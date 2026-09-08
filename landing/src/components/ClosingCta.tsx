export default function ClosingCta() {
  return (
    <section className="w-full bg-[#06090e] py-24 relative overflow-hidden" id="crear-tienda">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="magic-border-container">
          <div className="magic-border-content p-10 sm:p-16 text-center bg-gradient-to-r from-[#06192d] via-[#0b1328] to-[#1a0c24]">
            <p className="text-xs uppercase font-bold tracking-[0.25em] text-cyan-400 mb-4">EMPIEZA HOY MISMO</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto mb-6">
              ¿Listo para llevar tu negocio al siguiente nivel?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Empieza hoy tus <strong>30 días de prueba gratis</strong> sin tarjeta de crédito. Configura tu tienda en
              minutos y comienza a vender en todo el país.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-0.5"
                href="#crear-tienda"
              >
                <span>Crear tienda gratis ahora</span>
              </a>
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500/50 transition-colors text-sm font-medium"
                href="#contacto"
              >
                Hablar con un asesor en WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
