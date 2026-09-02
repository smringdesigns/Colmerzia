// En local, la landing corre en el puerto 5175 (ver docker-compose.yml).
// En producción, se sobreescribe con VITE_LANDING_URL=https://colmerzia.com
export const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? "http://localhost:5175";
