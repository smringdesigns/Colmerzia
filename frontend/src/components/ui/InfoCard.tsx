import type { ComponentType, ReactNode } from "react";

interface InfoCardProps {
    caption?: string;
    icon: ComponentType<{ size?: number }>;
    title: string;
    tone?: "blue" | "green" | "orange" | "purple" | "teal";
    value: ReactNode;
}

export default function InfoCard({
    caption,
    icon: Icon,
    title,
    tone = "purple",
    value,
}: InfoCardProps) {
    return (
        <article className="stat-card">
            <span className={`stat-icon ${tone}`}>
                <Icon size={22} />
            </span>
            <div>
                <p>{title}</p>
                <strong>{value}</strong>
                {caption && <span>{caption}</span>}
            </div>
        </article>
    );
}
