"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useStoryStore } from "@/lib/store"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Button } from "@/components/ui/button"
import { X, Image as ImageIcon, Map, Wand2, Sparkles } from "lucide-react"
import { TiptapEditor } from "./tiptap-editor"
import { ScriptFormatterPanel } from "@/components/ai/script-formatter-panel"
import { ImageGallery } from "./image-gallery"
import { ImageGenerator } from "./image-generator"

export function NodeEditorOverlay({ nodeId }: { nodeId: string }) {
    const { nodes, updateNode, setNodeViewState } = useStoryStore()
    const [activeTab, setActiveTab] = React.useState<'mentions' | 'gallery' | 'format' | 'generate'>('mentions')
    const node = nodes[nodeId]

    // Extract mentions from JSON to display (simplistic approach for now)
    const renderMentions = () => {
        // In a full implementation we would extract these nicely and sync them with the store mentions
        return (
            <div className="text-sm opacity-50 font-sans italic mt-4">
                Mentions will appear here automatically when you use @ in the editor.
            </div>
        )
    }

    if (!node) return null

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-background/20 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                layoutId={`node-container-${nodeId}`}
                layout
                className="w-full h-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl rounded-3xl overflow-hidden origin-center"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <GlassPanel intensity="strong" className="w-full h-full flex flex-col border-[1.5px] rounded-3xl overflow-hidden" style={{ borderColor: `${node.color}50` }}>

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 px-6 border-b border-foreground/5 bg-foreground/5">
                        <div className="flex items-center gap-3 w-1/2">
                            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: node.color }} />
                            <input
                                type="text"
                                value={node.title}
                                onChange={(e) => updateNode(nodeId, { title: e.target.value })}
                                className="font-heading font-semibold text-2xl bg-transparent border-none outline-none focus:ring-2 focus:ring-foreground/10 rounded px-2 w-full truncate"
                                placeholder="Story Node Title"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex p-1 bg-background/50 backdrop-blur-md rounded-xl mr-4 gap-1 shadow-sm">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 gap-1 rounded-lg ${activeTab === 'mentions' ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'}`}
                                    onClick={() => setActiveTab('mentions')}
                                >
                                    <Map className="w-4 h-4" /> outline
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 gap-1 rounded-lg ${activeTab === 'gallery' ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'}`}
                                    onClick={() => setActiveTab('gallery')}
                                >
                                    <ImageIcon className="w-4 h-4" /> gallery
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 gap-1 rounded-lg ${activeTab === 'generate' ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'}`}
                                    onClick={() => setActiveTab('generate')}
                                >
                                    <Sparkles className="w-4 h-4" /> concept
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 gap-1 rounded-lg ${activeTab === 'format' ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'}`}
                                    onClick={() => setActiveTab('format')}
                                >
                                    <Wand2 className="w-4 h-4" /> format
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-10 w-10 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10"
                                onClick={() => setNodeViewState(nodeId, 'card')}
                                title="Save & Close"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Editor Body */}
                    <div className="flex-1 flex overflow-hidden relative bg-gradient-to-br from-background/40 to-transparent">
                        <div className="w-full lg:w-3/4 h-full p-4 lg:p-6 flex flex-col">
                            <TiptapEditor
                                content={node.content}
                                onChange={(json, text) => updateNode(nodeId, { content: json, plainText: text })}
                            />
                        </div>

                        {/* Right Sidebar for mentions/metadata within this node */}
                        <div className="hidden lg:flex w-1/4 h-full border-l border-foreground/5 bg-foreground/5 p-6 flex-col overflow-y-auto">
                            {activeTab === 'mentions' && (
                                <>
                                    <h3 className="font-heading font-semibold text-lg opacity-80 tracking-tight">Node Details</h3>
                                    {renderMentions()}
                                </>
                            )}
                            {activeTab === 'gallery' && <ImageGallery nodeId={nodeId} />}
                            {activeTab === 'generate' && <ImageGenerator />}
                            {activeTab === 'format' && <ScriptFormatterPanel />}
                        </div>
                    </div>

                </GlassPanel>
            </motion.div>
        </motion.div>
    )
}
