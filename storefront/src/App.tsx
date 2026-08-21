import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import { getStoreInfo } from "./features/store/storeApi";
import { useCustomerBootstrap } from "./features/customer/useCustomerBootstrap";

export default function App() {
    useCustomerBootstrap();

    const { data: store } = useQuery({
        queryKey: ["store-info"],
        queryFn: getStoreInfo,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (store?.name) {
            document.title = store.name;
        }
    }, [store?.name]);

    return (
        <div className="flex min-h-full flex-col">
            <Header />

            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/productos/:slug" element={<ProductPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/confirmacion" element={<ConfirmationPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registro" element={<RegisterPage />} />
                    <Route path="/cuenta" element={<AccountPage />} />
                    <Route
                        path="*"
                        element={
                            <p className="py-24 text-center text-sm text-[var(--color-ink-soft)]">
                                Página no encontrada.
                            </p>
                        }
                    />
                </Routes>
            </div>

            <Footer />

            <CartDrawer />
            <Toast />
        </div>
    );
}
