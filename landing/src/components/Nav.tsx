import { LOGIN_URL, SIGNUP_URL } from "../lib/adminUrl";

export default function Nav() {
    return (
        <header className="sticky top-0 z-50 bg-[var(--color-bg-dark)]/85 backdrop-blur-md transition-all">
            
            {/* LÍNEA DIVISORIA INFERIOR (Degradado en lugar de borde sólido) */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-bg-line)] to-transparent opacity-70"></div>

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-16">
                
                {/* LOGO */}
                <a href="#top" className="flex items-center gap-2 group">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] font-display text-sm font-bold text-[var(--color-bg-darker)] shadow-[0_0_12px_rgba(0,188,235,0.4)] transition-transform group-hover:scale-105">
                        C
                    </span>
                    <span className="font-display text-xl font-bold tracking-tight text-[var(--color-text-white)]">
                        Colmerzia
                    </span>
                </a>

                {/* ENLACES CENTRALES */}
                <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--color-text-gray)] md:flex">
                    <a href="#negocios" className="transition-colors hover:text-[var(--color-accent)]">
                        Para tu negocio
                    </a>
                    <a href="#funciones" className="transition-colors hover:text-[var(--color-accent)]">
                        Qué incluye
                    </a>
                    <a href="#planes" className="transition-colors hover:text-[var(--color-accent)]">
                        Planes
                    </a>
                </nav>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex items-center gap-5">
                    <a
                        href={LOGIN_URL}
                        className="hidden text-sm font-medium text-[var(--color-text-gray)] transition-colors hover:text-[var(--color-accent)] sm:block"
                    >
                        Iniciar sesión
                    </a>
                    <a
                        href={SIGNUP_URL}
                        className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-[var(--color-bg-darker)] shadow-[0_0_15px_rgba(0,188,235,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(0,188,235,0.4)] hover:brightness-110"
                    >
                        Crear tienda
                    </a>
                </div>
                
            </div>
        </header>
    );
}