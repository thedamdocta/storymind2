"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStoryStore } from "@/lib/store"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, AlignLeft, Image as ImageIcon, X } from "lucide-react"

interface TimelineNodeProps {
  id: string
  position: number
  orientation: 'horizontal' | 'vertical'
  absolutePosition: { x: number; y: number }
  isAnimatingIn?: boolean
}

function TimelineNodeComponent({
  id,
  position,
  orientation,
  absolutePosition,
  isAnimatingIn = false
}: TimelineNodeProps) {
  const { nodes, nodeViewStates, setNodeViewState, updateNode, deleteNode } = useStoryStore()
  const node = nodes[id]
  const viewState = nodeViewStates[id] || 'circle'
  const [isHovered, setIsHovered] = React.useState(false)

  if (!node) return null

  const isEven = position % 2 === 0

  return (
    <div
      className="absolute timeline-node-container group"
      style={{
        left: absolutePosition.x - 28,
        top: absolutePosition.y - 28,
        willChange: 'auto',
      }}
    >
      {/* Delete Button */}
      <button
        className={`node-delete-button absolute w-6 h-6 rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 top-1/2 -translate-y-1/2 ${
          isEven
            ? '-left-10'  // Left side for top nodes
            : '-right-10'  // Right side for bottom nodes
        }`}
        style={{
          background: 'rgba(239, 68, 68, 0.9)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.3)',
        }}
        onClick={() => deleteNode(id)}
        title="Delete node"
      >
        <X className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
      </button>

      {/* Node Content */}
      <AnimatePresence>
        {viewState === 'circle' && (
          <motion.div
            layoutId={`node-container-${id}`}
            layout={false}
            initial={{ scale: isAnimatingIn ? 0 : 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative cursor-pointer z-10 flex items-center justify-center"
            onClick={() => setNodeViewState(id, 'card')}
            whileHover={{ scale: 1.15 }}
            transition={{
              type: "spring",
              stiffness: isAnimatingIn ? 300 : 400,
              damping: 25,
              delay: isAnimatingIn ? 0.1 : 0  // Minimal delay, node appears as line reaches it
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center glass-droplet relative z-20"
              style={{ willChange: "transform" }}
            >
              <div className="w-5 h-5 rounded-full opacity-90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]" style={{ backgroundColor: node.color }} />
            </div>

            <div className={`absolute whitespace-nowrap text-sm font-medium transition-opacity duration-300 opacity-60 hover:opacity-100 ${orientation === 'horizontal'
              ? (isEven ? '-top-8 left-1/2 -translate-x-1/2' : '-bottom-8 left-1/2 -translate-x-1/2')
              : (isEven ? '-left-24 top-1/2 -translate-y-1/2' : '-right-24 top-1/2 -translate-y-1/2')
              }`}>
              {node.title || 'Untitled Node'}
            </div>
          </motion.div>
        )}

        {viewState === 'card' && (
          <motion.div
            layoutId={`node-container-${id}`}
            className="w-[280px] z-20 cursor-default shrink-0 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              left: -112, // Center 280px card on the node position
              top: -28,
            }}
          >
            <GlassPanel intensity="strong" className="p-4 flex flex-col gap-3 relative border-[1.5px]" style={{ borderColor: `${node.color}40` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: node.color }} />
                  <input
                    type="text"
                    value={node.title}
                    onChange={(e) => updateNode(id, { title: e.target.value })}
                    className="font-heading font-semibold bg-transparent border-none outline-none focus:ring-1 focus:ring-foreground/20 rounded px-1 -ml-1 text-lg w-full truncate"
                    placeholder="Node Title..."
                  />
                </div>
                <div className="flex gap-1 shrink-0 ml-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setNodeViewState(id, 'circle')} title="Collapse">
                    <Minimize2 className="h-3.5 w-3.5 opacity-60" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setNodeViewState(id, 'editor')} title="Open Editor">
                    <Maximize2 className="h-3.5 w-3.5 opacity-60" />
                  </Button>
                </div>
              </div>

              <div
                className="text-sm font-sans text-foreground/70 line-clamp-3 min-h-[4rem] cursor-text bg-foreground/5 p-2 rounded-lg hover:bg-foreground/10 transition-colors"
                onClick={() => setNodeViewState(id, 'editor')}
              >
                {node.plainText || <span className="italic opacity-50">Write story contents...</span>}
              </div>

              <div className="flex items-center gap-3 pt-2 text-xs text-foreground/40 font-medium pb-1 px-1">
                <div className="flex items-center gap-1">
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>{node.plainText?.length > 0 ? 'Yes' : 'Empty'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{node.images.length}</span>
                </div>
                <div className="ml-auto opacity-50 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-foreground/30 inline-block" /> Beats {position + 1}
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {viewState === 'editor' && (
          <div className="w-12 h-12 opacity-0 shrink-0" />
        )}
      </AnimatePresence>
    </div>
  )
}

export const TimelineNode = React.memo(TimelineNodeComponent)
