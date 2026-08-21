import { useEffect } from "react";
import { getCustomerMe } from "./customerApi";
import { useCustomerAuthStore } from "../../lib/customerAuthStore";

/**
 * Al cargar la app, si ya hay un token guardado de una visita
 * anterior, trae los datos del cliente desde /v1/storefront/me para
 * poblar el store — si no, isAuthenticated queda en true pero
 * customer en null, y el Header no sabría qué nombre mostrar.
 *
 * Si el token ya no es válido (expiró, se revocó), el interceptor
 * 401 de api/client.ts limpia la sesión solo.
 */
export function useCustomerBootstrap() {
    const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated);
    const customer = useCustomerAuthStore((s) => s.customer);
    const setCustomer = useCustomerAuthStore((s) => s.setCustomer);
    const clearSession = useCustomerAuthStore((s) => s.clearSession);

    useEffect(() => {
        if (!isAuthenticated || customer) {
            return;
        }

        getCustomerMe()
            .then((data) => setCustomer(data))
            .catch(() => clearSession());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);
}
