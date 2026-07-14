import { RouterProvider } from "react-router-dom";

import { router } from "./routes/router";
import { useAuthBootstrap } from "./features/auth/useAuthBootstrap";

/**
 * Componente principal de la aplicación.
 *
 * Antes de renderizar las rutas verifica si existe una sesión
 * válida llamando al endpoint /v1/me.
 */
export default function App() {
    const isReady = useAuthBootstrap();

    if (!isReady) {
        return null;
    }

    return <RouterProvider router={router} />;
}