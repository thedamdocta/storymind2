"use client"

import * as React from "react"
import { useStoryStore } from "@/lib/store"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Button } from "@/components/ui/button"
import { LayoutList, LayoutPanelLeft } from "lucide-react"

export function TimelineControls() {
    const { projectName, setProjectName, orientation, setOrientation } = useStoryStore()

    return (
        <GlassPanel intensity="liquid" className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center p-1.5 gap-2 rounded-full px-4 text-foreground/80">
            <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-transparent border-none outline-none font-heading font-semibold text-lg max-w-[250px] text-center focus:ring-2 focus:ring-violet-500/20 rounded px-2 transition-all"
                placeholder="Story Title"
            />
            <div className="w-px h-6 bg-foreground/10 mx-2" />
            <div className="flex bg-foreground/5 p-1 rounded-full">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full transition-all ${orientation === 'horizontal' ? 'glass-droplet scale-110' : 'opacity-40 hover:opacity-100 hover:bg-background/20'}`}
                    onClick={() => setOrientation('horizontal')}
                    title="Horizontal Timeline"
                >
                    <LayoutList className="h-4 w-4 rotate-90 opacity-70" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full transition-all ${orientation === 'vertical' ? 'glass-droplet scale-110' : 'opacity-40 hover:opacity-100 hover:bg-background/20'}`}
                    onClick={() => setOrientation('vertical')}
                    title="Vertical Timeline"
                >
                    <LayoutPanelLeft className="h-4 w-4 opacity-70" />
                </Button>
            </div>
        </GlassPanel>
    )
}
