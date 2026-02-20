"use client"

import * as React from "react"
import { useStoryStore } from "@/lib/store"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit2, LayoutList } from "lucide-react"

export function EntityPage() {
    const { entities, mentions, nodes, selectedEntityId, selectEntity } = useStoryStore()

    const entity = selectedEntityId ? entities[selectedEntityId] : null

    if (!entity) return null

    // Find all mentions for this entity
    const entityMentions = mentions.filter(m => m.entityId === entity.id)

    // Group mentions by node
    const mentionsByNodeId: Record<string, typeof entityMentions> = {}
    entityMentions.forEach(m => {
        if (!mentionsByNodeId[m.nodeId]) {
            mentionsByNodeId[m.nodeId] = []
        }
        mentionsByNodeId[m.nodeId].push(m)
    })

    return (
        <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300 relative z-10 w-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => selectEntity(null)}
                    className="h-8 w-8 rounded-full bg-background/50 hover:bg-background"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="uppercase text-[10px] tracking-widest font-bold opacity-50 px-2 py-1 bg-foreground/5 rounded-full">
                    {entity.type.replace('-', ' ')}
                </div>
            </div>

            {/* Title */}
            <div className="flex items-start justify-between mb-8 group">
                <div>
                    <h2 className="text-3xl font-heading font-bold flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: entity.color }} />
                        <span className="truncate">{entity.name}</span>
                    </h2>
                    {entity.description && (
                        <p className="text-sm font-sans opacity-70 mt-2">{entity.description}</p>
                    )}
                </div>
            </div>

            {/* Mentions / Appearances */}
            <div className="flex-1 flex flex-col">
                <h3 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4">
                    <LayoutList className="w-5 h-5 opacity-50" />
                    Appearances <span className="text-sm px-2 py-0.5 bg-foreground/5 rounded-full opacity-60 ml-auto">{entityMentions.length}</span>
                </h3>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                    {Object.entries(mentionsByNodeId).map(([nodeId, nodeMentions]) => {
                        const node = nodes[nodeId]
                        if (!node) return null

                        return (
                            <GlassPanel key={nodeId} intensity="subtle" className="p-3 border-foreground/10 hover:border-foreground/20 transition-colors">
                                <div className="text-xs font-semibold uppercase tracking-wider opacity-60 flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                                    {node.title}
                                </div>

                                <div className="space-y-2">
                                    {nodeMentions.map((mention, idx) => (
                                        <div key={idx} className="text-sm font-sans bg-foreground/5/50 p-2 rounded relative">
                                            {/* Context from mention needs to be parsed or highlighted, rendering standard context text for now */}
                                            <span className="opacity-80">"...</span>
                                            <span className="font-medium text-foreground mx-1" style={{ color: entity.color }}>{entity.name}</span>
                                            <span className="opacity-80">..."</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassPanel>
                        )
                    })}

                    {entityMentions.length === 0 && (
                        <div className="text-center py-10 opacity-50 text-sm font-sans italic">
                            No mentions found. Type @{entity.name} in any story beat.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
