import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import BusinessTypes from "./components/BusinessTypes";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import ClosingCta from "./components/ClosingCta";
import Footer from "./components/Footer";

export default function App() {
    return (
        <div className="flex min-h-full flex-col">
            <Nav />

            <main className="flex-1">
                <Hero />
                <Stats />
                <BusinessTypes />
                <Features />
                <Pricing />
                <ClosingCta />
            </main>

            <Footer />
        </div>
    );
}
