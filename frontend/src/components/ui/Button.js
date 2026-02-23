import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const variantClass = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        outline: "btn-outline",
        ghost: "btn-ghost",
        glass: "btn-glass",
        danger: "btn-danger",
    }[variant] || "btn-primary";

    const sizeClass = {
        sm: "btn-sm",
        md: "btn-md",
        lg: "btn-lg",
        icon: "btn-icon",
    }[size] || "btn-md";

    return (
        <button
            className={cn("btn", variantClass, sizeClass, className)}
            ref={ref}
            {...props}
        />
    );
})
Button.displayName = "Button"

export { Button }
