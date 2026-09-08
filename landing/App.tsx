import Nav from "./components/Nav";
import Hero from "./components/Hero";
import BusinessTypes from "./components/BusinessTypes";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import ClosingCta from "./components/ClosingCta";
import Footer from "./components/Footer";
import FloatingShape from "./components/FloatingShape"; // Importamos el nuevo componente

export default function App() {
    return (
        <div className="flex min-h-full flex-col relative bg-[var(--color-bg-dark)]">
            
            {/* ========================================================
                CAPA DE FONDO GLOBAL: Figuras geométricas flotantes
                z-0 para que queden detrás de todo
                pointer-events-none para que no bloqueen los clics
            ======================================================== */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                
                {/* Zona Hero */}
                <FloatingShape type="circle" color="cyan" className="w-8 h-8 top-[8%] left-[5%]" delay="0s" />
                <FloatingShape type="polygon" color="orange" className="w-12 h-12 top-[12%] right-[8%]" delay="1.5s" />
                
                {/* Zona Tipos de Negocio */}
                <FloatingShape type="petal" color="magenta" className="w-9 h-9 top-[25%] left-[12%]" delay="0.5s" />
                <FloatingShape type="square" color="blue" className="w-5 h-5 top-[30%] right-[15%]" delay="2.2s" />
                
                {/* Zona Features */}
                <FloatingShape type="circle" color="orange" className="w-4 h-4 top-[45%] left-[80%]" delay="1s" />
                <FloatingShape type="polygon" color="cyan" className="w-10 h-10 top-[52%] left-[8%]" delay="0.8s" />
                
                {/* Zona Pricing */}
                <FloatingShape type="petal" color="blue" className="w-7 h-7 top-[70%] right-[12%]" delay="2.5s" />
                <FloatingShape type="circle" color="magenta" className="w-6 h-6 top-[75%] left-[10%]" delay="0.2s" />
                
                {/* Zona CTA Cierre */}
                <FloatingShape type="square" color="cyan" className="w-8 h-8 top-[90%] left-[85%]" delay="1.8s" />
            </div>

            {/* ========================================================
                CONTENIDO PRINCIPAL (Con z-10 para estar por encima del fondo)
            ======================================================== */}
            <div className="relative z-10 flex flex-col min-h-full">
                <Nav />

                <main className="flex-1">
                    <Hero />
                    <BusinessTypes />
                    <Features />
                    <Pricing />
                    <ClosingCta />
                </main>

                <Footer />
            </div>
        </div>
    );
}