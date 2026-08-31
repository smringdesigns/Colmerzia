import { api } from "../../api/client";

export interface ActivityItem {
    type: "order_created" | "order_shipped" | "customer_created" | "low_stock";
    title: string;
    subtitle: string;
    url: string;
    at: string;
}

export async function getActivity(limit = 10): Promise<{ items: ActivityItem[] }> {
    const res = await api.get("/v1/activity", { params: { limit } });
    return res.data;
}
