import { AlertTriangle, X } from "lucide-react";

import Button from "./Button";

interface ConfirmDialogProps {
    confirmLabel?: string;
    description: string;
    isOpen: boolean;
    isPending?: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
}

export default function ConfirmDialog({
    confirmLabel = "Eliminar",
    description,
    isOpen,
    isPending = false,
    onClose,
    onConfirm,
    title,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" role="presentation">
            <section
                aria-modal="true"
                className="confirm-dialog"
                role="dialog"
                aria-labelledby="confirm-dialog-title"
            >
                <button
                    aria-label="Cerrar"
                    className="modal-close"
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                >
                    <X size={18} />
                </button>

                <div className="confirm-icon">
                    <AlertTriangle size={24} />
                </div>

                <div className="confirm-copy">
                    <h2 id="confirm-dialog-title">{title}</h2>
                    <p>{description}</p>
                </div>

                <div className="confirm-actions">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
                        Cancelar
                    </Button>
                    <Button type="button" variant="danger" onClick={onConfirm} disabled={isPending}>
                        {isPending ? "Eliminando..." : confirmLabel}
                    </Button>
                </div>
            </section>
        </div>
    );
}
