"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

interface TimelinePlusButtonProps {
  position: { x: number; y: number }
  onClick: () => void
  orientation: 'horizontal' | 'vertical'
  disabled?: boolean
}

export function TimelinePlusButton({
  position,
  onClick,
  orientation,
  disabled = false
}: TimelinePlusButtonProps) {
  return (
    <motion.button
      className="timeline-plus-button absolute flex items-center justify-center z-30"
      style={{
        left: position.x - 20, // Center 40px button on position
        top: position.y - 20,
        width: 40,
        height: 40,
      }}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.15 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      animate={{ opacity: disabled ? 0.4 : 1 }}
      transition={{
        scale: { type: "spring", stiffness: 400, damping: 25 },
        opacity: { duration: 0.2 }
      }}
    >
      <Plus className="w-5 h-5 text-violet-600/70" />
    </motion.button>
  )
}
