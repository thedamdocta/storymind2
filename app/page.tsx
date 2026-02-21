"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { GradientBlob } from "@/components/ui/gradient-blob"
import { TimelineView } from "@/components/timeline/timeline-view"
import { NodeEditorOverlay } from "@/components/editor/node-editor-overlay"
import { useStoryStore } from "@/lib/store"
import { AnimatePresence } from "framer-motion"

export default function Home() {
    const { nodeViewStates } = useStoryStore()
    const activeEditorNodeId = Object.entries(nodeViewStates).find(([_, state]) => state === 'editor')?.[0]
    return (
        <SidebarProvider
            className="relative flex h-screen w-full overflow-hidden bg-background"
            style={{ "--sidebar-width": "320px" } as React.CSSProperties}
        >
            {/* Subtle Liquid Gradient Reflections */}
            <GradientBlob
                color="rgba(139, 92, 246, 0.12)"
                className="w-[800px] h-[800px] -top-96 -left-48 mix-blend-multiply"
            />
            <GradientBlob
                color="rgba(59, 130, 246, 0.08)"
                className="w-[600px] h-[600px] top-1/2 -right-64 -translate-y-1/2 mix-blend-multiply"
            />
            <GradientBlob
                color="rgba(236, 72, 153, 0.08)"
                className="w-[900px] h-[900px] -bottom-96 left-1/4 mix-blend-multiply"
            />

            <AppSidebar />

            <SidebarInset className="bg-transparent relative flex-1 flex flex-col h-full overflow-hidden z-10">
                <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center">
                    <TimelineView />
                </div>
            </SidebarInset>

            <AnimatePresence>
                {activeEditorNodeId && <NodeEditorOverlay key="editor-overlay" nodeId={activeEditorNodeId} />}
            </AnimatePresence>
        </SidebarProvider>
    )
}
