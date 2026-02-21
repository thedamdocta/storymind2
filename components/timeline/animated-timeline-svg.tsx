'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { StoryNode, StartingNode } from '@/lib/types'

interface AnimatedTimelineSVGProps {
  nodes: StoryNode[]
  startingNode: StartingNode
  orientation: 'horizontal' | 'vertical'
  isAnimating: boolean
  animatingToIndex: number // Index of node being animated to
}

// Constants for timeline positioning
const STEM_LENGTH = 60 // Length of perpendicular stems
const NODE_SPACING = 200 // Distance between nodes on main axis
const BASE_X = 100 // Starting X position
const BASE_Y = 300 // Starting Y position

/**
 * Calculate the SVG path for the timeline
 * Creates a path that extends along the main axis (horizontal or vertical)
 * with perpendicular stems that alternate direction (up-down-up-down or left-right-left-right)
 */
function calculateTimelinePath(
  nodes: StoryNode[],
  startingNode: StartingNode,
  orientation: 'horizontal' | 'vertical',
  animatingToIndex: number
): string {
  const STARTING_NODE_RADIUS = 40 // Half of 80px starting node

  // Timeline starts at the END of the starting node (not through it)
  const startingNodePos = {
    x: orientation === 'horizontal' ? BASE_X + STARTING_NODE_RADIUS : BASE_X,
    y: orientation === 'vertical' ? BASE_Y + STARTING_NODE_RADIUS : BASE_Y
  }

  // Start at the end of the starting node
  let path = `M ${startingNodePos.x} ${startingNodePos.y}`

  // For each node up to animatingToIndex
  for (let i = 0; i <= animatingToIndex && i < nodes.length; i++) {
    const isEven = i % 2 === 0
    const mainAxisOffset = (i + 1) * NODE_SPACING

    if (orientation === 'horizontal') {
      // Extend along main horizontal axis to junction point
      const mainX = startingNodePos.x + mainAxisOffset
      path += ` L ${mainX} ${startingNodePos.y}`

      // Hard 90° turn and extend stem to node
      const stemY = startingNodePos.y + (isEven ? -STEM_LENGTH : STEM_LENGTH)
      path += ` L ${mainX} ${stemY}`

      // Return back to main timeline (important for next segment)
      path += ` L ${mainX} ${startingNodePos.y}`
    } else {
      // Extend along main vertical axis to junction point
      const mainY = startingNodePos.y + mainAxisOffset
      path += ` L ${startingNodePos.x} ${mainY}`

      // Hard 90° turn and extend stem to node
      const stemX = startingNodePos.x + (isEven ? -STEM_LENGTH : STEM_LENGTH)
      path += ` L ${stemX} ${mainY}`

      // Return back to main timeline (important for next segment)
      path += ` L ${startingNodePos.x} ${mainY}`
    }
  }

  return path
}

/**
 * AnimatedTimelineSVG Component
 *
 * Renders an SVG-based timeline that grows with a smooth snake animation.
 * Features:
 * - 16px stroke width for both main line and stems
 * - Hard 90° turns (miter joins, not rounded)
 * - Alternating stem pattern
 * - Gradient styling matching timeline-line-gradient from globals.css
 * - Smooth pathLength animation using Framer Motion
 */
export function AnimatedTimelineSVG({
  nodes,
  startingNode,
  orientation,
  isAnimating,
  animatingToIndex,
}: AnimatedTimelineSVGProps) {
  const pathD = React.useMemo(
    () => calculateTimelinePath(nodes, startingNode, orientation, animatingToIndex),
    [nodes, startingNode, orientation, animatingToIndex]
  )

  // Calculate the previous path length for animation
  const previousIndex = React.useRef(animatingToIndex)
  const [pathLength, setPathLength] = React.useState(1)

  React.useEffect(() => {
    if (isAnimating) {
      // Calculate pathLength from current position to new position
      const totalNodes = nodes.length
      if (totalNodes > 0) {
        const newLength = (animatingToIndex + 1) / totalNodes
        setPathLength(newLength)
        previousIndex.current = animatingToIndex
      }
    } else {
      // When not animating, show full path
      setPathLength(1)
    }
  }, [isAnimating, animatingToIndex, nodes.length])

  // Calculate connector line to plus button
  const connectorLine = React.useMemo(() => {
    const STARTING_NODE_RADIUS = 40
    const PLUS_BUTTON_RADIUS = 20 // 40px diameter / 2
    const TIMELINE_STROKE_RADIUS = 8 // 16px stroke width / 2
    const GAP = 2 // Small gap between line and plus button
    const timelineStartX = orientation === 'horizontal' ? BASE_X + STARTING_NODE_RADIUS : BASE_X
    const timelineStartY = orientation === 'vertical' ? BASE_Y + STARTING_NODE_RADIUS : BASE_Y

    if (orientation === 'horizontal') {
      const startX = timelineStartX + nodes.length * NODE_SPACING + TIMELINE_STROKE_RADIUS
      const endX = timelineStartX + (nodes.length + 1) * NODE_SPACING - PLUS_BUTTON_RADIUS - GAP
      return `M ${startX} ${timelineStartY} L ${endX} ${timelineStartY}`
    } else {
      const startY = timelineStartY + nodes.length * NODE_SPACING + TIMELINE_STROKE_RADIUS
      const endY = timelineStartY + (nodes.length + 1) * NODE_SPACING - PLUS_BUTTON_RADIUS - GAP
      return `M ${timelineStartX} ${startY} L ${timelineStartX} ${endY}`
    }
  }, [nodes.length, orientation])

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        overflow: 'visible',
        zIndex: 10,
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        {/* Gradient definition matching current timeline-line-gradient from globals.css */}
        <linearGradient
          id="timeline-gradient"
          gradientTransform={orientation === 'horizontal' ? 'rotate(0)' : 'rotate(90)'}
          x1="0%"
          y1="0%"
          x2={orientation === 'horizontal' ? '100%' : '0%'}
          y2={orientation === 'horizontal' ? '0%' : '100%'}
        >
          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
          <stop offset="33%" stopColor="rgba(59, 130, 246, 0.3)" />
          <stop offset="66%" stopColor="rgba(236, 72, 153, 0.3)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
        </linearGradient>

        {/* Glow filter for depth */}
        <filter id="timeline-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main timeline path */}
      <motion.path
        d={pathD}
        stroke="url(#timeline-gradient)"
        strokeWidth={16} // Double the current 8px
        strokeLinecap="butt" // Flat ends (not rounded)
        strokeLinejoin="miter" // Sharp 90° corners, not rounded
        fill="none"
        filter="url(#timeline-glow)"
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: isAnimating ? pathLength : 1,
        }}
        transition={{
          pathLength: {
            type: 'tween',
            duration: 0.8, // 800ms for smooth snake motion
            ease: [0.4, 0.0, 0.2, 1], // Custom easing curve
          },
        }}
        style={{
          mixBlendMode: 'multiply', // Match current timeline blend mode
        }}
      />

      {/* Thin dashed connector line to plus button */}
      <path
        d={connectorLine}
        stroke="rgba(139, 92, 246, 0.5)"
        strokeWidth={3}
        strokeDasharray="8 6"
        strokeLinecap="butt"
        fill="none"
      />
    </svg>
  )
}
