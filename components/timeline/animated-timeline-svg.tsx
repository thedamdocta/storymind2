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

  // For each node, draw: main line segment → stem out → stem back
  // This creates a continuous path that branches naturally
  for (let i = 0; i <= animatingToIndex && i < nodes.length; i++) {
    const isEven = i % 2 === 0
    const mainAxisOffset = (i + 1) * NODE_SPACING

    if (orientation === 'horizontal') {
      const mainX = startingNodePos.x + mainAxisOffset
      const stemY = startingNodePos.y + (isEven ? -STEM_LENGTH : STEM_LENGTH)

      // Grow along main line to junction
      path += ` L ${mainX} ${startingNodePos.y}`
      // Branch out to node
      path += ` L ${mainX} ${stemY}`
      // Return to main line to continue
      path += ` L ${mainX} ${startingNodePos.y}`
    } else {
      const mainY = startingNodePos.y + mainAxisOffset
      const stemX = startingNodePos.x + (isEven ? -STEM_LENGTH : STEM_LENGTH)

      // Grow along main line to junction
      path += ` L ${startingNodePos.x} ${mainY}`
      // Branch out to node
      path += ` L ${stemX} ${mainY}`
      // Return to main line to continue
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
  const previousIndex = React.useRef(-1)
  const [pathLength, setPathLength] = React.useState(1)

  React.useEffect(() => {
    if (isAnimating && nodes.length > 0) {
      // Calculate what fraction of the NEW path represents the OLD nodes
      // This ensures we only animate the NEW segment, not redraw everything
      const totalNodes = animatingToIndex + 1
      const previousNodeCount = Math.max(0, previousIndex.current + 1)

      // Start from showing previous nodes (fraction of new path)
      const startLength = previousNodeCount / totalNodes
      setPathLength(startLength)

      // Then animate to full path after a brief delay
      const timer = setTimeout(() => {
        setPathLength(1)
        previousIndex.current = animatingToIndex
      }, 50)

      return () => clearTimeout(timer)
    } else if (!isAnimating) {
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
        strokeWidth={16}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        fill="none"
        filter="url(#timeline-glow)"
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: isAnimating ? pathLength : 1,
        }}
        transition={{
          pathLength: {
            type: 'tween',
            duration: 1.6, // Faster: main line + stem growth
            ease: [0.4, 0.0, 0.2, 1.0], // Accelerate through the backtracking segments
          },
        }}
        style={{
          mixBlendMode: 'multiply',
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
