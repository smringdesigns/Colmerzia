const NAV_LINKS = [
  { href: "#funciones", label: "Funciones" },
  { href: "#experiencias", label: "Experiencias" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#precios", label: "Precios" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#faq", label: "Preguntas" },
];

export default function Header() {
  return (
    <header className="w-full bg-[#06090e]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a className="flex items-center gap-2.5 group" href="#">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white flex items-center bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
              colmerzia
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            {NAV_LINKS.map((link) => (
              <a key={link.href} className="hover:text-cyan-400 transition-colors" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <a
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block"
            href="#login"
          >
            Iniciar sesión
          </a>
          <a
            className="text-sm font-semibold px-5 py-2.5 rounded-xl text-cyan-300 border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-500/20 hover:border-cyan-400 glow-cyan-btn transition-all duration-300 transform hover:-translate-y-0.5"
            href="#crear-tienda"
          >
            Crear tienda gratis
          </a>
        </div>
      </div>
    </header>
  );
}
