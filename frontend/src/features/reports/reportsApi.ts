import { api } from "../../api/client";

export interface SalesSummary {
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
    orders_count: number;
    average_order_value: number;
    discounts_total: number;
}

export interface SalesDailyPoint {
    date: string;
    orders: number;
    revenue: number;
    cost: number;
    profit: number;
}

export interface SalesTopProduct {
    product_id: number;
    product_name: string;
    quantity: number;
    revenue: number;
    cost: number;
    profit: number;
}

export interface SalesReport {
    month: string;
    range: { start: string; end: string };
    summary: SalesSummary;
    daily: SalesDailyPoint[];
    top_products: SalesTopProduct[];
}

export async function getSalesReport(month: string): Promise<SalesReport> {
    const res = await api.get("/v1/reports/sales", {
        params: { month },
    });

    return res.data;
}

export interface SalesYearlyMonth {
    month: string;
    label: string;
    revenue: number;
    orders_count: number;
}

export async function getSalesYearly(): Promise<{ months: SalesYearlyMonth[] }> {
    const res = await api.get("/v1/reports/sales/yearly");
    return res.data;
}

/**
 * Descarga el CSV del mes indicado. Dispara la descarga en el
 * navegador directamente (no hay nada que renderizar).
 */
export async function downloadSalesReport(month: string): Promise<void> {
    const res = await api.get("/v1/reports/sales/export", {
        params: { month },
        responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));

    const link = document.createElement("a");
    link.href = url;
    link.download = `ventas-${month}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
}
