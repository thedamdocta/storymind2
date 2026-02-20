import * as React from "react"
import { cn } from "@/lib/utils"

export function GradientBlob({
    className,
    color,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { color: string }) {
    // We use specific CSS for smooth liquid-like aesthetic instead of harsh gradients
    return (
        <div
            className={cn("gradient-blob mix-blend-multiply dark:mix-blend-screen transition-all duration-1000", className)}
            style={{
                background: `radial-gradient(ellipse at center, ${color} 0%, transparent 60%)`
            }}
            {...props}
        />
    )
}
