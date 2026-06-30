import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    fullWidth?: boolean;
    variant?: ButtonVariant;
}

export default function Button({
    children,
    className = "",
    fullWidth = false,
    variant = "primary",
    ...props
}: ButtonProps) {
    const classes = [
        "ui-button",
        `ui-button-${variant}`,
        fullWidth ? "ui-button-full" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}
