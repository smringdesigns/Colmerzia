const STEPS = [
  {
    number: 1,
    color: "border-cyan-500/30",
    numberColor: "bg-cyan-500/20 border-cyan-400 text-cyan-300",
    title: "Registra y personaliza",
    description:
      "Crea tu cuenta en menos de 5 minutos, sube el logo de tu marca, define tus colores y personaliza tu enlace único.",
  },
  {
    number: 2,
    color: "border-pink-500/30",
    numberColor: "bg-pink-500/20 border-pink-400 text-pink-300",
    title: "Sube tus productos",
    description:
      "Carga tus artículos directo desde tu celular: fotos, precios en COP, tallas, variantes e inventario inicial en un clic.",
  },
  {
    number: 3,
    color: "border-orange-500/30",
    numberColor: "bg-orange-500/20 border-orange-400 text-orange-300",
    title: "Comparte y factura",
    description:
      "Pega tu link en Instagram, TikTok y WhatsApp. Recibe pedidos pagados con Nequi y genera guías al instante.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-[#05070a] text-white py-24 relative" id="como-funciona">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase font-bold tracking-[0.25em] text-cyan-400 mb-3">SIMPLICIDAD TOTAL</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            En 3 simples pasos tienes tu negocio vendiendo
          </h2>
          <p className="text-slate-300 text-base">
            Diseñado para personas que quieren vender, no perder horas programando. Sin configuraciones complejas.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className={`bg-gradient-to-b from-[#0e1628] to-[#090e1a] border rounded-2xl p-8 shadow-xl ${step.color}`}>
              <div className={`w-12 h-12 rounded-xl border font-extrabold text-xl flex items-center justify-center mb-6 ${step.numberColor}`}>
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
