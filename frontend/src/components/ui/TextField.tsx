import type { InputHTMLAttributes, ReactNode } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    icon?: ReactNode;
    label: string;
}

export default function TextField({ error, icon, label, ...props }: TextFieldProps) {
    return (
        <label className="ui-field">
            <span>{label}</span>
            <div className={error ? "ui-input-wrap invalid" : "ui-input-wrap"}>
                {icon && <span className="ui-input-icon">{icon}</span>}
                <input className={icon ? "ui-input with-icon" : "ui-input"} {...props} />
            </div>
            {error && <small className="ui-field-error">{error}</small>}
        </label>
    );
}
