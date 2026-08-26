/// <reference types="vite/client" />

interface ImportMetaEnv {
    /**
     * URL del panel admin donde vive el flujo público de registro
     * (cuenta + tienda). En local: http://localhost:5173
     * En producción: https://admin.colmerzia.com
     */
    readonly VITE_ADMIN_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
