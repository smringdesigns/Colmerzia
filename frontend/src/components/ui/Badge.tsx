import type { ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    tone?: "success" | "warning" | "danger" | "neutral" | "purple";
}

export default function Badge({ children, tone = "neutral" }: BadgeProps) {
    return <span className={`ui-badge ${tone}`}>{children}</span>;
}
