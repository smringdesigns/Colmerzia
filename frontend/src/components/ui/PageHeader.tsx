import type { ReactNode } from "react";

interface PageHeaderProps {
    action?: ReactNode;
    eyebrow?: string;
    subtitle?: string;
    title: string;
}

export default function PageHeader({ action, eyebrow, subtitle, title }: PageHeaderProps) {
    return (
        <header className="ui-page-header">
            <div>
                {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            {action}
        </header>
    );
}
