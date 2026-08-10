import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Products from "../pages/Products";
import ProductForm from "../pages/ProductForm";
import Customers from "../pages/Customers";
import CustomerForm from "../pages/CustomerForm";
import Inventory from "../pages/Inventory";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import ComingSoon from "../pages/ComingSoon";
import CreateAccount from "../pages/CreateAccount";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../features/auth/VerifyEmail";
import CheckEmail from "../pages/CheckEmail"; // <-- 1. Importamos el nuevo componente
import CreateStore from "../pages/CreateStore";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";


export const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/create-account", element: <CreateAccount /> },
            { path: "/forgot-password", element: <ForgotPassword /> },
            { path: "/reset-password", element: <ResetPassword /> },
            { path: "/check-email", element: <CheckEmail /> }, // <-- 2. Lo agregamos como ruta pública
        ],
    },


    {
        element: <ProtectedRoute />,
        children: [

            { path: "/verify-email", element: <VerifyEmail /> },

            { path: "/onboarding", element: <CreateStore /> },

            {
                path: "/admin",
                element: <ComingSoon title="Panel Global de Colmerzia (Super Admin)" />
            },


            {
                path: "/",
                element: <AdminLayout />,
                children: [

                    { index: true, element: <Dashboard /> },

                    { path: "dashboard", element: <Dashboard /> },


                    // Productos
                    { path: "products", element: <Products /> },
                    { path: "products/new", element: <ProductForm /> },
                    { path: "products/:id/edit", element: <ProductForm /> },

                    { path: "productos", element: <Products /> },
                    { path: "productos/nuevo", element: <ProductForm /> },
                    { path: "productos/:id/editar", element: <ProductForm /> },


                    // Clientes
                    { path: "customers", element: <Customers /> },
                    { path: "customers/new", element: <CustomerForm /> },
                    { path: "customers/:id/edit", element: <CustomerForm /> },

                    { path: "clientes", element: <Customers /> },
                    { path: "clientes/nuevo", element: <CustomerForm /> },
                    { path: "clientes/:id/editar", element: <CustomerForm /> },


                    // Inventario
                    { path: "inventory", element: <Inventory /> },
                    { path: "inventario", element: <Inventory /> },


                    // Pedidos
                    { path: "orders", element: <Orders /> },
                    { path: "orders/:id", element: <OrderDetail /> },

                    { path: "pedidos", element: <Orders /> },
                    { path: "pedidos/:id", element: <OrderDetail /> },


                    // Configuración
                    { path: "settings", element: <Settings /> },
                    { path: "configuracion", element: <Settings /> },


                    { path: "*", element: <NotFound /> },

                ],
            },
        ],
    },
]);