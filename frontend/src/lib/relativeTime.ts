export function relativeTime(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffSec = Math.max(0, Math.floor(diffMs / 1000));

    if (diffSec < 60) return "hace un momento";

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `hace ${diffMin} minuto${diffMin === 1 ? "" : "s"}`;

    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `hace ${diffHour} hora${diffHour === 1 ? "" : "s"}`;

    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `hace ${diffDay} día${diffDay === 1 ? "" : "s"}`;

    return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}
