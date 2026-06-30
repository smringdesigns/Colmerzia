import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
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
]);