const FEATURES = [
  {
    emoji: "📦",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    title: "Catálogo ilimitado",
    description:
      "Agrega todos tus productos con variantes, fotos en alta resolución y descripciones atractivas sin límite de subida.",
  },
  {
    emoji: "📊",
    color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    title: "Inventario inteligente",
    description:
      "Controla tu stock en tiempo real, recibe alertas automáticas y sincroniza pedidos en bodega física y digital.",
  },
  {
    emoji: "🛒",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    title: "Gestión de pedidos",
    description:
      "Recibe, procesa y envía pedidos fácilmente desde un solo lugar con notificaciones de estado por correo y WhatsApp.",
  },
  {
    emoji: "💳",
    color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    title: "Pagos locales integrados",
    description:
      "Recibe pagos con PSE, Nequi, Daviplata, tarjetas débito/crédito y efectivo directamente a tu cuenta bancaria.",
  },
  {
    emoji: "📈",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    title: "Reportes y analíticas (COP)",
    description:
      "Visualiza tus ventas netas, ticket promedio, productos estrella y ganancias reales calculadas en pesos colombianos.",
  },
  {
    emoji: "💬",
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    title: "Soporte 100% colombiano",
    description: "Sin bots interminables. Habla con asesores reales en Colombia vía WhatsApp para resolver cualquier duda.",
  },
];

export default function Features() {
  return (
    <section className="w-full bg-[#06090e] py-24 relative overflow-hidden ambient-glow-section" id="funciones">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase font-bold tracking-[0.2em] text-cyan-400 mb-3">TODO LO QUE NECESITAS</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Una plataforma completa{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-400">
                para hacer crecer tu negocio en Colombia
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base text-slate-300 leading-relaxed font-normal">
              Colmerzia reúne todas las herramientas necesarias para vender sin complicaciones técnicas, cobrando en
              pesos y gestionando envíos nacionales de forma impecable.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="magic-border-container">
              <div className="magic-border-content p-7">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border text-xl ${feature.color}`}>
                  {feature.emoji}
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">{feature.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
