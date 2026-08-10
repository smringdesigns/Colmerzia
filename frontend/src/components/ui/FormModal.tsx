import type { ReactNode } from "react";
import { X } from "lucide-react";

interface FormModalProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    subtitle?: string;
    title: string;
}

export default function FormModal({
    children,
    isOpen,
    onClose,
    subtitle,
    title,
}: FormModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" role="presentation">
            <section
                aria-modal="true"
                aria-labelledby="form-modal-title"
                className="form-modal"
                role="dialog"
            >
                <button
                    aria-label="Cerrar"
                    className="modal-close"
                    onClick={onClose}
                    type="button"
                >
                    <X size={18} />
                </button>

                <div className="form-modal-header">
                    <h2 id="form-modal-title">{title}</h2>
                    {subtitle && <p>{subtitle}</p>}
                </div>

                {children}
            </section>
        </div>
    );
}
