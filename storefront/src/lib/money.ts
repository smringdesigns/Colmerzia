export function formatMoney(value: string | number): string {
    const amount = Number(value);

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(amount);
}
