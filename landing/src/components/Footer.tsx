import { LOGIN_URL, SIGNUP_URL } from "../lib/adminUrl";

export default function Footer() {
    return (
        <footer className="relative bg-[var(--color-bg-darker)] py-10 overflow-hidden">
            
            {/* LÍNEA DIVISORIA CENTRAL (Degradado) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 md:w-1/2 h-px bg-gradient-to-r from-transparent via-[var(--color-bg-line)] to-transparent"></div>
            
            {/* Destello neón cian en el centro de la línea */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-40 blur-[1px]"></div>

            {/* Contenido (relative z-10 para que quede por encima de la línea si se superpone) */}
            <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 text-sm text-[var(--color-text-muted)] sm:flex-row sm:justify-between">
                
                <span className="font-display text-[var(--color-text-white)] font-bold tracking-wide">
                    Colmerzia
                </span>

                <div className="flex flex-wrap items-center justify-center gap-6">
                    <a href="#negocios" className="transition hover:text-[var(--color-accent)]">
                        Para tu negocio
                    </a>
                    <a href="#funciones" className="transition hover:text-[var(--color-accent)]">
                        Qué incluye
                    </a>
                    <a href="#planes" className="transition hover:text-[var(--color-accent)]">
                        Planes
                    </a>
                    <a href={LOGIN_URL} className="transition hover:text-[var(--color-accent)]">
                        Iniciar sesión
                    </a>
                    <a href={SIGNUP_URL} className="transition hover:text-[var(--color-accent)]">
                        Crear tienda
                    </a>
                </div>

                <span>Hecho en Colombia</span>
            </div>
        </footer>
    );
}
