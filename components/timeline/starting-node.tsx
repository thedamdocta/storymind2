"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useStoryStore } from "@/lib/store"

interface StartingNodeProps {
  orientation: 'horizontal' | 'vertical'
}

export function StartingNode({ orientation }: StartingNodeProps) {
  const { startingNode, updateStartingNode } = useStoryStore()
  const [isEditing, setIsEditing] = React.useState(!startingNode?.title)

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
    }
  }

  React.useEffect(() => {
    if (!startingNode?.title) {
      setIsEditing(true)
    }
  }, [startingNode?.title])

  return (
    <motion.div
      className="absolute starting-node-container z-30"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 20 },
      }}
      style={{
        left: 100 - 40, // Center 80px node at x=100
        top: 300 - 40, // Center 80px node at y=300
      }}
    >
      <div
        className="w-20 h-20 rounded-full glass-droplet starting-node-glow cursor-pointer flex items-center justify-center relative"
        onDoubleClick={handleDoubleClick}
        onClick={() => !isEditing && handleDoubleClick()}
      >
        {isEditing ? (
          <input
            autoFocus
            value={startingNode?.title || ''}
            onChange={(e) => updateStartingNode({ title: e.target.value })}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Story beginning..."
            className="w-full h-full bg-transparent text-center text-sm font-semibold outline-none px-2 rounded-full"
            style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          />
        ) : (
          <div className="text-sm font-semibold text-foreground/80 px-2 text-center line-clamp-2">
            {startingNode?.title || 'Start'}
          </div>
        )}
      </div>
    </motion.div>
  )
}
