import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";

export default function App() {
    return (
        <div className="min-h-full">
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos/:slug" element={<ProductPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/confirmacion" element={<ConfirmationPage />} />
                <Route
                    path="*"
                    element={
                        <p className="py-24 text-center text-sm text-[var(--color-ink-soft)]">
                            Página no encontrada.
                        </p>
                    }
                />
            </Routes>

            <CartDrawer />
            <Toast />
        </div>
    );
}
