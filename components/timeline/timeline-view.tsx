"use client"

import * as React from "react"
import { useStoryStore } from "@/lib/store"
import { TimelineControls } from "./timeline-controls"
import { TimelineNode } from "./timeline-node"
import { TimelineAddButton } from "./timeline-add-button"
import { motion, AnimatePresence } from "framer-motion"

export function TimelineHorizontal({ nodeIds }: { nodeIds: string[] }) {
    return (
        <div className="w-full h-full flex items-center px-32 custom-scrollbar overflow-x-auto relative min-h-[500px]">
            <div className="flex space-x-24 items-center min-w-max pb-32 pt-32">
                {nodeIds.length === 0 && (
                    <div className="text-foreground/40 italic font-sans px-8 tracking-wide">Start building your story...</div>
                )}
                <AnimatePresence>
                    {nodeIds.map((id, index) => (
                        <TimelineNode key={id} id={id} position={index} orientation="horizontal" />
                    ))}
                    <TimelineAddButton key="add-btn" orientation="horizontal" position={nodeIds.length} />
                </AnimatePresence>
            </div>
            {/* Render the timeline line after the nodes so it visually masks the stems */}
            <div className="absolute left-0 right-0 h-[8px] timeline-line-gradient top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
        </div>
    )
}

export function TimelineVertical({ nodeIds }: { nodeIds: string[] }) {
    return (
        <div className="w-full h-full flex justify-center pt-48 pb-32 custom-scrollbar overflow-y-auto relative min-h-[500px]">
            <div className="flex flex-col space-y-24 items-center min-h-max pl-32 pr-32">
                {nodeIds.length === 0 && (
                    <div className="text-foreground/40 italic font-sans py-8 tracking-wide">Start building your story...</div>
                )}
                <AnimatePresence>
                    {nodeIds.map((id, index) => (
                        <TimelineNode key={id} id={id} position={index} orientation="vertical" />
                    ))}
                    <TimelineAddButton key="add-btn" orientation="vertical" position={nodeIds.length} />
                </AnimatePresence>
            </div>
            {/* Render the timeline line after the nodes so it visually masks the stems */}
            <div className="absolute top-28 bottom-0 w-[8px] timeline-line-gradient-vertical left-1/2 -translate-x-1/2 z-10 pointer-events-none" />
        </div>
    )
}

export function TimelineView() {
    const { orientation, nodeOrder } = useStoryStore()

    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden">
            <TimelineControls />

            <div className="flex-1 w-full h-full">
                {orientation === 'horizontal' ? (
                    <TimelineHorizontal nodeIds={nodeOrder} />
                ) : (
                    <TimelineVertical nodeIds={nodeOrder} />
                )}
            </div>
        </div>
    )
}
