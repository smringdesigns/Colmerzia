import { useEffect } from "react";
import { useUIStore } from "../lib/uiStore";

export default function Toast() {
    const toast = useUIStore((s) => s.toast);
    const clearToast = useUIStore((s) => s.clearToast);

    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(clearToast, 3200);
        return () => clearTimeout(timer);
    }, [toast, clearToast]);

    if (!toast) return null;

    const isError = toast.tone === "error";

    return (
        <div
            role="status"
            className={`fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-bottom-4 ${
                isError
                    ? "bg-[#ba1a1a] text-white"
                    : "bg-[#131b2e] text-[#faf8ff]"
            }`}
        >
            {toast.message}
        </div>
    );
}