import { cn } from "../../lib/utils"

function Badge({ className, variant = "default", ...props }) {
    const variantClass = {
        default: "badge-default",
        secondary: "badge-secondary",
        outline: "badge-outline",
        success: "badge-success",
        warning: "badge-warning",
        danger: "badge-danger",
    }[variant] || "badge-default";

    return (
        <div
            className={cn("badge", variantClass, className)}
            {...props}
        />
    )
}

export { Badge }
