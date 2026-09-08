/**
 * Composición decorativa: un contorno "blob" orgánico con
 * degradado azul→cian→magenta, más piezas geométricas sueltas
 * (punto, gota, cuadrado, octágono) tipo confeti.
 *
 * Puramente decorativo (aria-hidden) — se posiciona absoluto
 * dentro de un contenedor con position:relative.
 */
export default function DecorativeShapes({ className = "" }: { className?: string }) {
    return (
        <div className={`pointer-events-none absolute select-none ${className}`} aria-hidden="true">
            
            {/* ONDA ORGÁNICA (Con efecto Drop Shadow para brillar) */}
            <svg
                width="280"
                height="220"
                viewBox="0 0 280 220"
                className="absolute left-0 top-0 drop-shadow-[0_0_8px_rgba(21,170,191,0.5)]"
            >
                <defs>
                    <linearGradient id="blobline" x1="0" y1="0" x2="1" y2="1">
                        {/* Usamos tus variables CSS directamente en el SVG */}
                        <stop offset="0%" stopColor="var(--color-shape-blue)" />
                        <stop offset="50%" stopColor="var(--color-shape-cyan)" />
                        <stop offset="100%" stopColor="var(--color-shape-magenta)" />
                    </linearGradient>
                </defs>
                <path
                    d="M8,110 C30,65 60,130 92,98 C118,72 100,32 132,38 C160,44 155,82 188,88 C220,94 225,55 252,66"
                    fill="none"
                    stroke="url(#blobline)"
                    strokeWidth="5"
                    strokeLinecap="round"
                />
            </svg>

            {/* CONFETI GEOMÉTRICO (Con brillos y animación flotante) */}
            
            {/* Gota / Pétalo Magenta */}
            <span 
                className="absolute left-[150px] top-[10px] h-9 w-9 rounded-tl-md rounded-br-2xl rounded-tr-2xl rounded-bl-2xl bg-[var(--color-shape-magenta)] drop-shadow-[0_0_12px_rgba(230,73,128,0.6)] shape-floating" 
                style={{ animationDelay: '0s' }} 
            />
            
            {/* Punto Azul */}
            <span 
                className="absolute left-[95px] top-[28px] h-4 w-4 rounded-full bg-[var(--color-shape-blue)] drop-shadow-[0_0_10px_rgba(59,91,219,0.8)] shape-floating" 
                style={{ animationDelay: '1s' }} 
            />
            
            {/* Cuadrado Cyan (Rotado) */}
            <span 
                className="absolute bottom-[40px] left-[55px] h-6 w-6 rotate-[18deg] rounded-md bg-[var(--color-shape-cyan)] drop-shadow-[0_0_12px_rgba(21,170,191,0.6)] shape-floating" 
                style={{ animationDelay: '2.5s' }} 
            />
            
            {/* Octágono Naranja */}
            <span
                className="absolute bottom-0 left-0 h-12 w-12 bg-[var(--color-shape-orange)] drop-shadow-[0_0_15px_rgba(240,140,0,0.5)] shape-floating"
                style={{
                    clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                    animationDelay: '1.5s'
                }}
            />
        </div>
    );
}