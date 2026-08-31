import { api } from "../../api/client";

export interface SearchResultItem {
    id: number;
    title: string;
    subtitle: string;
    url: string;
}

export interface SearchResults {
    products: SearchResultItem[];
    customers: SearchResultItem[];
    orders: SearchResultItem[];
}

export async function globalSearch(query: string): Promise<SearchResults> {
    const res = await api.get("/v1/search", { params: { q: query } });
    return res.data;
}

export interface NotificationItem {
    type: "order" | "low_stock";
    title: string;
    subtitle: string;
    url: string;
    created_at: string;
}

export interface NotificationsResponse {
    items: NotificationItem[];
    count: number;
}

export async function getNotifications(): Promise<NotificationsResponse> {
    const res = await api.get("/v1/notifications");
    return res.data;
}
