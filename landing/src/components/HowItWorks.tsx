import FloatingShape from "./FloatingShape";

const STEPS = [
    {
        number: "1",
        color: "border-[var(--color-accent)]/30",
        badge: "bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[var(--color-accent)]",
        title: "Regístrate y personaliza",
        body: "Crea tu cuenta, sube el logo de tu marca y define los colores de tu tienda. Tu enlace único queda listo desde el primer momento.",
    },
    {
        number: "2",
        color: "border-[var(--color-accent-pink)]/30",
        badge: "bg-[var(--color-accent-pink)]/15 border-[var(--color-accent-pink)] text-[var(--color-accent-pink)]",
        title: "Sube tus productos",
        body: "Carga tu catálogo con fotos, precios en COP, variantes e inventario inicial. Todo desde el mismo panel, sin depender de un desarrollador.",
    },
    {
        number: "3",
        color: "border-[var(--color-bg-glow)]/30",
        badge: "bg-[var(--color-bg-glow)]/15 border-[var(--color-bg-glow)] text-[var(--color-bg-glow)]",
        title: "Comparte y recibe pedidos",
        body: "Pega el link de tu tienda en Instagram, TikTok o WhatsApp. Cada pedido llega directo a tu panel, listo para que lo proceses.",
    },
];

export default function HowItWorks() {
    return (
        <section className="relative py-24 bg-[var(--color-bg-dark)] overflow-hidden">
            
            <FloatingShape type="circle" color="cyan" className="w-8 h-8 top-[10%] left-[6%]" delay="0.3s" />
            <FloatingShape type="polygon" color="orange" className="w-10 h-10 bottom-[15%] right-[8%]" delay="1.8s" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-16">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Simplicidad total
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-text-white)] sm:text-4xl lg:text-5xl">
                        En 3 pasos tu negocio queda vendiendo
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-[var(--color-text-gray)]">
                        Pensado para quien quiere vender, no para quien quiere programar.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {STEPS.map((step) => (
                        <div key={step.number} className={`dark-card border p-8 ${step.color}`}>
                            <div className={`w-12 h-12 rounded-xl border font-extrabold text-xl flex items-center justify-center mb-6 ${step.badge}`}>
                                {step.number}
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-text-white)] mb-3">{step.title}</h3>
                            <p className="text-[var(--color-text-gray)] text-sm leading-relaxed">{step.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
