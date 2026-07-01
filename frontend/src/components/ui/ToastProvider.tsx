import {
    useCallback,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

import { ToastContext, type ToastInput, type ToastTone } from "./toastContext";

interface Toast {
    id: number;
    message: string;
    title: string;
    tone: ToastTone;
}

const icons = {
    error: AlertCircle,
    info: Info,
    success: CheckCircle2,
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const notify = useCallback(
        ({ message, title, tone = "info" }: ToastInput) => {
            const id = Date.now() + Math.random();
            const toast = { id, message, title, tone };

            setToasts((current) => [...current, toast]);
            window.setTimeout(() => dismiss(id), 4200);
        },
        [dismiss],
    );

    const value = useMemo(() => ({ notify }), [notify]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-region" aria-live="polite" aria-relevant="additions">
                {toasts.map((toast) => {
                    const Icon = icons[toast.tone];

                    return (
                        <article className={`toast ${toast.tone}`} key={toast.id}>
                            <span className="toast-icon">
                                <Icon size={19} />
                            </span>
                            <div>
                                <strong>{toast.title}</strong>
                                <p>{toast.message}</p>
                            </div>
                            <button
                                type="button"
                                aria-label="Cerrar notificacion"
                                onClick={() => dismiss(toast.id)}
                            >
                                <X size={16} />
                            </button>
                        </article>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}
