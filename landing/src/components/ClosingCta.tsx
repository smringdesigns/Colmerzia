import { SIGNUP_URL } from "../lib/adminUrl";

export default function ClosingCta() {
    return (
        <section className="relative py-24 bg-[var(--color-bg-darker)] overflow-hidden">
            
            {/* Resplandor ambiental de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-3xl h-[60%] bg-[var(--color-accent)]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10 mx-auto max-w-4xl px-6">
                
                {/* 
                    CONTENEDOR DEL EFECTO "CORRIENTE" 
                    Usamos 'group' para que toda la tarjeta reaccione al hover
                */}
                <div className="relative group rounded-[2rem] p-[2px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-[1.02] cursor-pointer">
                    
                    {/* 1. Borde estático por defecto (La línea cian tenue arriba que se ve en tu imagen) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent)]/40 to-transparent transition-opacity duration-500 group-hover:opacity-0"></div>

                    {/* 2. La "Corriente" de energía (Gira infinitamente, pero solo se enciende en hover) */}
                    <div 
                        className="absolute inset-[-100%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-spin"
                        style={{ 
                            animationDuration: '4s', // Giro suave y elegante
                            // Degradado cónico con tus colores: Transparente -> Rosa -> Cian
                            backgroundImage: 'conic-gradient(from 0deg, transparent 0%, transparent 65%, #ec4899 85%, #22d3ee 100%)' 
                        }}
                    ></div>
                    
                    {/* 3. Tarjeta interna oscura (Tapa el centro y deja expuesto solo el borde animado de 2px) */}
                    <div className="relative z-10 bg-[var(--color-bg-darker)] h-full w-full rounded-[calc(2rem-2px)] p-10 md:p-16 text-center flex flex-col items-center justify-center">
                        
                        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-white)] sm:text-5xl mb-6">
                            Tu tienda puede estar lista <span className="text-[var(--color-accent)]">hoy.</span>
                        </h2>
                        
                        <p className="mx-auto max-w-xl text-lg md:text-xl leading-relaxed text-[var(--color-text-gray)] mb-10">
                            Creá tu cuenta, configurá tu catálogo y empezá a vender. Sin código, sin desarrollador, sin esperar.
                        </p>
                        
                        <div className="flex justify-center">
                            <a href={SIGNUP_URL} className="btn-glow text-lg px-10 py-4">
                                Crear tienda gratis
                            </a>
                        </div>
                        
                        <p className="mt-6 font-mono text-[11px] sm:text-xs text-[var(--color-text-muted)] tracking-widest uppercase">
                            Configuración en minutos &bull; Cancele cuando quiera
                        </p>
                        
                    </div>
                </div>
            </div>
        </section>
    );
}