import { api } from "../../api/client";

interface CountKpi {
    total: number;
    trend: number | null;
    active?: number;
    pending?: number;
}

interface RevenueKpi {
    this_month: number;
    trend: number | null;
}

export interface DashboardKpis {
    products: CountKpi;
    customers: CountKpi;
    orders: CountKpi;
    revenue: RevenueKpi;
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
    const res = await api.get("/v1/dashboard/kpis");
    return res.data;
}
