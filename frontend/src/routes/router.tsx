import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";

export const router = createBrowserRouter([
    // Rutas públicas — solo accesibles sin sesión
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
        ],
    },

    // Rutas protegidas — requieren token
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                ],
            },
        ],
    },
]);