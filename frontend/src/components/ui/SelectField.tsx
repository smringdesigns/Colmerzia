import type { ReactNode, SelectHTMLAttributes } from "react";

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
    error?: string;
    icon?: ReactNode;
    label: string;
    options: Option[];
    placeholder?: string;
}

export default function SelectField({
    error,
    icon,
    label,
    options,
    placeholder,
    ...props
}: SelectFieldProps) {
    return (
        <label className="ui-field">
            <span>{label}</span>
            <div className={error ? "ui-input-wrap invalid" : "ui-input-wrap"}>
                {icon && <span className="ui-input-icon">{icon}</span>}
                <select
                    className={icon ? "ui-input with-icon" : "ui-input"}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && <small className="ui-field-error">{error}</small>}
        </label>
    );
}
