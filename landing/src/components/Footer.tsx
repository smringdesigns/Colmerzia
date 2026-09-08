const FOOTER_COLUMNS = [
  {
    title: "Producto",
    links: [
      { label: "Catálogo", href: "#funciones" },
      { label: "Inventario", href: "#funciones" },
      { label: "Precios", href: "#precios" },
    ],
  },
  {
    title: "Soluciones",
    links: [
      { label: "Moda y Calzado", href: "#experiencias" },
      { label: "Café y Alimentos", href: "#experiencias" },
      { label: "Tecnología", href: "#experiencias" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Centro de Ayuda", href: "#" },
      { label: "Términos", href: "#" },
      { label: "Privacidad", href: "#" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#030509] text-slate-400 pt-16 pb-12 border-t border-white/10" id="contacto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          <div className="lg:col-span-2 space-y-4">
            <a className="flex items-center gap-2.5" href="#">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-cyan-400">
                <svg className="w-7 h-7 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">colmerzia</span>
            </a>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              La plataforma de comercio electrónico diseñada exclusivamente para potenciar los negocios locales y
              emprendimientos en Colombia.
            </p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-4">{column.title}</p>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a className="hover:text-cyan-400 transition-colors" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {year} Colmerzia SAS. Hecho con orgullo para emprendedores colombianos.</p>
          <div className="flex items-center gap-4">
            <span>Integrado con PSE • Nequi • Daviplata • Bancolombia • Servientrega</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
