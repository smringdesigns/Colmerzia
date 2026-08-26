import { LOGIN_URL, SIGNUP_URL } from "../lib/adminUrl";

export default function Footer() {
    return (
        <footer className="bg-[var(--color-ink)] py-10">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-sm text-white/50 sm:flex-row sm:justify-between">
                <span className="font-display text-white">Colmerzia</span>

                <div className="flex flex-wrap items-center justify-center gap-6">
                    <a href="#negocios" className="transition hover:text-white">
                        Para tu negocio
                    </a>
                    <a href="#funciones" className="transition hover:text-white">
                        Qué incluye
                    </a>
                    <a href="#planes" className="transition hover:text-white">
                        Planes
                    </a>
                    <a href={LOGIN_URL} className="transition hover:text-white">
                        Iniciar sesión
                    </a>
                    <a href={SIGNUP_URL} className="transition hover:text-white">
                        Crear tienda
                    </a>
                </div>

                <span>Hecho en Colombia</span>
            </div>
        </footer>
    );
}
