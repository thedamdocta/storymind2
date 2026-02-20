"use client"

import * as React from "react"
import { useStoryStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { LayoutList, LayoutPanelLeft } from "lucide-react"

export function TimelineControls() {
    const { projectName, setProjectName, orientation, setOrientation } = useStoryStore()

    return (
        <div
            className="header-pill absolute top-6 left-1/2 -translate-x-1/2 z-50 inline-flex items-center rounded-full text-foreground/80"
            style={{ width: 'auto', maxWidth: 'fit-content', height: '48px', minHeight: '48px', padding: '8px 16px', gap: '8px' }}
        >
            <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-transparent border-none outline-none font-heading font-semibold text-lg text-center focus:ring-2 focus:ring-violet-500/20 rounded"
                style={{ width: '200px', height: '32px', lineHeight: '32px', padding: '0 8px' }}
                placeholder="Story Title"
            />
            <div className="w-px h-6 bg-foreground/10 mx-2 shrink-0" />
            <div className="flex bg-foreground/15 p-1 rounded-full shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full transition-all ${orientation === 'horizontal' ? 'glass-droplet toggle-subtle' : 'opacity-60 hover:opacity-80 hover:bg-background/15'}`}
                    onClick={() => setOrientation('horizontal')}
                    title="Horizontal Timeline"
                >
                    <LayoutList className={`h-4 w-4 rotate-90 ${orientation === 'horizontal' ? 'opacity-90' : 'opacity-50'}`} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full transition-all ${orientation === 'vertical' ? 'glass-droplet toggle-subtle' : 'opacity-60 hover:opacity-80 hover:bg-background/15'}`}
                    onClick={() => setOrientation('vertical')}
                    title="Vertical Timeline"
                >
                    <LayoutPanelLeft className={`h-4 w-4 ${orientation === 'vertical' ? 'opacity-90' : 'opacity-50'}`} />
                </Button>
            </div>
        </div>
    )
}
