import { LOGIN_URL, SIGNUP_URL } from "../lib/adminUrl";

export default function Nav() {
    return (
        <header className="sticky top-0 z-30 border-b border-[var(--color-bg-line)] bg-[var(--color-bg-dark)]/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <a href="#top" className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] font-display text-sm font-semibold text-[var(--color-bg-darker)]">
                        C
                    </span>
                    <span className="font-display text-lg font-semibold tracking-tight text-[var(--color-text-white)]">
                        Colmerzia
                    </span>
                </a>

                <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--color-text-gray)] md:flex">
                    <a href="#negocios" className="transition hover:text-[var(--color-text-white)]">
                        Para tu negocio
                    </a>
                    <a href="#funciones" className="transition hover:text-[var(--color-text-white)]">
                        Qué incluye
                    </a>
                    <a href="#planes" className="transition hover:text-[var(--color-text-white)]">
                        Planes
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    <a
                        href={LOGIN_URL}
                        className="hidden text-sm font-medium text-[var(--color-text-gray)] transition hover:text-[var(--color-text-white)] sm:block"
                    >
                        Iniciar sesión
                    </a>
                    <a
                        href={SIGNUP_URL}
                        className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg-darker)] transition hover:brightness-110"
                    >
                        Crear tienda gratis
                    </a>
                </div>
            </div>
        </header>
    );
}
