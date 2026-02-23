import * as React from "react"
import { cn } from "../../lib/utils"

const GlassCard = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("glass-card", className)}
            {...props}
        />
    )
})
GlassCard.displayName = "GlassCard"

export { GlassCard }
