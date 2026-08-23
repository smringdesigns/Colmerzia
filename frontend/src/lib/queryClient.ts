import { QueryClient } from "@tanstack/react-query";

/**
 * Instancia única de QueryClient, exportada (en vez de crearla
 * dentro de main.tsx) para que authStore.ts y Login.tsx puedan
 * llamar a queryClient.clear() al cambiar de tienda.
 *
 * POR QUÉ HACE FALTA:
 *
 * El panel admin corre en un solo dominio (admin.colmerzia.com) para
 * TODAS las tiendas; el tenant activo se resuelve por localStorage
 * ("tenant_subdomain"), no por subdominio real. Cuando cambiás de
 * usuario (logout de la tienda A, login en la tienda B) SIN recargar
 * la página completa —cosa que Login.tsx hace con navigate(), no con
 * window.location—, el QueryClient sigue vivo en memoria.
 *
 * Como las queryKey de products/orders/customers/etc. no incluyen el
 * store_id (ej. ["products", search, page]), React Query devuelve
 * instantáneamente los datos cacheados de la tienda A mientras
 * refetchea en segundo plano: eso es el "monta cosas de otra tienda
 * por unos segundos" que reportó JorSti. switchToStore() (panel
 * super-admin) ya evita esto porque usa window.location.href
 * (recarga completa = QueryClient nuevo), pero el login/logout
 * normal no.
 *
 * La solución aplicada: limpiar el caché explícitamente en cada
 * cambio de sesión (ver Login.tsx onSubmit y authStore.ts logout()).
 */
export const queryClient = new QueryClient();
