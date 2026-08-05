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
            className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-3 text-sm shadow-lg ${
                isError
                    ? "bg-[#3a1f1a] text-[#f4ded8]"
                    : "bg-[var(--color-pine-dark)] text-[var(--color-stone)]"
            }`}
        >
            {toast.message}
        </div>
    );
}
