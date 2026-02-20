import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    intensity?: "subtle" | "normal" | "strong" | "liquid"
}

export function GlassPanel({
    className,
    intensity = "normal",
    children,
    ...props
}: GlassPanelProps) {
    const intensityClass =
        intensity === "subtle" ? "glass-subtle" :
            intensity === "strong" ? "glass-strong" :
                intensity === "liquid" ? "liquid-panel" : "glass"

    return (
        <div
            className={cn(intensityClass, "rounded-2xl shadow-sm transition-all duration-300", className)}
            {...props}
        >
            {children}
        </div>
    )
}
