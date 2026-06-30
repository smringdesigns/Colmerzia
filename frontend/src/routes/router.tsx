import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Products from "../pages/Products";
import ProductForm from "../pages/ProductForm";
import Customers from "../pages/Customers";
import CustomerForm from "../pages/CustomerForm";
import ComingSoon from "../pages/ComingSoon";
import CreateAccount from "../pages/CreateAccount";
import ForgotPassword from "../pages/ForgotPassword";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";

export const router = createBrowserRouter([
    // Rutas públicas
    {
        element: <PublicRoute />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/create-account", element: <CreateAccount /> },
            { path: "/forgot-password", element: <ForgotPassword /> },
        ],
    },

    // Rutas protegidas
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <AdminLayout />,
                children: [
                    { index: true,                        element: <Dashboard />    },
                    { path: "dashboard",                  element: <Dashboard />    },
                    { path: "products",                   element: <Products />     },
                    { path: "products/new",               element: <ProductForm />  },
                    { path: "products/:id/edit",          element: <ProductForm />  },
                    { path: "productos",                  element: <Products />     },
                    { path: "productos/nuevo",            element: <ProductForm />  },
                    { path: "productos/:id/editar",       element: <ProductForm />  },
                    { path: "customers",                  element: <Customers />    },
                    { path: "customers/new",              element: <CustomerForm /> },
                    { path: "customers/:id/edit",         element: <CustomerForm /> },
                    { path: "clientes",                   element: <Customers />    },
                    { path: "clientes/nuevo",             element: <CustomerForm /> },
                    { path: "clientes/:id/editar",        element: <CustomerForm /> },
                    { path: "inventory",                  element: <ComingSoon title="Inventario" /> },
                    { path: "inventario",                 element: <ComingSoon title="Inventario" /> },
                    { path: "orders",                     element: <ComingSoon title="Pedidos" /> },
                    { path: "pedidos",                    element: <ComingSoon title="Pedidos" /> },
                    { path: "settings",                   element: <ComingSoon title="Configuración" /> },
                    { path: "configuracion",              element: <ComingSoon title="Configuración" /> },
                    { path: "*",                          element: <NotFound />     },
                ],
            },
        ],
    },
]);
