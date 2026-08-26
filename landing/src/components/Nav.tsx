import { LOGIN_URL, SIGNUP_URL } from "../lib/adminUrl";

export default function Nav() {
    return (
        <header className="sticky top-0 z-30 border-b border-[var(--color-paper-line)] bg-[var(--color-paper)]/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <a href="#top" className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-ink)] font-display text-sm font-semibold text-[var(--color-paper)]">
                        C
                    </span>
                    <span className="font-display text-lg font-semibold tracking-tight">
                        Colmerzia
                    </span>
                </a>

                <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--color-ink-soft)] md:flex">
                    <a href="#negocios" className="transition hover:text-[var(--color-ink)]">
                        Para tu negocio
                    </a>
                    <a href="#funciones" className="transition hover:text-[var(--color-ink)]">
                        Qué incluye
                    </a>
                    <a href="#planes" className="transition hover:text-[var(--color-ink)]">
                        Planes
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    <a
                        href={LOGIN_URL}
                        className="hidden text-sm font-medium text-[var(--color-ink-soft)] transition hover:text-[var(--color-ink)] sm:block"
                    >
                        Iniciar sesión
                    </a>
                    <a
                        href={SIGNUP_URL}
                        className="rounded-full bg-[var(--color-stamp)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-stamp-dark)]"
                    >
                        Crear tienda gratis
                    </a>
                </div>
            </div>
        </header>
    );
}
