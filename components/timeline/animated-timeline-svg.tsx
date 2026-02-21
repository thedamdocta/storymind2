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
 * Calculate the main timeline path (straight line through all junctions)
 */
function calculateMainLinePath(
  nodeCount: number,
  startingNode: StartingNode,
  orientation: 'horizontal' | 'vertical',
): string {
  const STARTING_NODE_RADIUS = 40

  const startingNodePos = {
    x: orientation === 'horizontal' ? BASE_X + STARTING_NODE_RADIUS : BASE_X,
    y: orientation === 'vertical' ? BASE_Y + STARTING_NODE_RADIUS : BASE_Y
  }

  if (orientation === 'horizontal') {
    const endX = startingNodePos.x + nodeCount * NODE_SPACING
    return `M ${startingNodePos.x} ${startingNodePos.y} L ${endX} ${startingNodePos.y}`
  } else {
    const endY = startingNodePos.y + nodeCount * NODE_SPACING
    return `M ${startingNodePos.x} ${startingNodePos.y} L ${startingNodePos.x} ${endY}`
  }
}

/**
 * Calculate individual stem paths
 */
function calculateStemPaths(
  nodeCount: number,
  startingNode: StartingNode,
  orientation: 'horizontal' | 'vertical',
): Array<{ path: string; index: number }> {
  const STARTING_NODE_RADIUS = 40
  const stems: Array<{ path: string; index: number }> = []

  const startingNodePos = {
    x: orientation === 'horizontal' ? BASE_X + STARTING_NODE_RADIUS : BASE_X,
    y: orientation === 'vertical' ? BASE_Y + STARTING_NODE_RADIUS : BASE_Y
  }

  for (let i = 0; i < nodeCount; i++) {
    const isEven = i % 2 === 0
    const mainAxisOffset = (i + 1) * NODE_SPACING

    if (orientation === 'horizontal') {
      const mainX = startingNodePos.x + mainAxisOffset
      const stemY = startingNodePos.y + (isEven ? -STEM_LENGTH : STEM_LENGTH)
      stems.push({
        path: `M ${mainX} ${startingNodePos.y} L ${mainX} ${stemY}`,
        index: i
      })
    } else {
      const mainY = startingNodePos.y + mainAxisOffset
      const stemX = startingNodePos.x + (isEven ? -STEM_LENGTH : STEM_LENGTH)
      stems.push({
        path: `M ${startingNodePos.x} ${mainY} L ${stemX} ${mainY}`,
        index: i
      })
    }
  }

  return stems
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
  // Calculate main line path (grows continuously)
  const mainLinePath = React.useMemo(
    () => calculateMainLinePath(nodes.length, startingNode, orientation),
    [nodes.length, startingNode, orientation]
  )

  // Calculate all stem paths
  const stemPaths = React.useMemo(
    () => calculateStemPaths(nodes.length, startingNode, orientation),
    [nodes.length, startingNode, orientation]
  )

  // Track animation state for main line
  const previousNodeCount = React.useRef(0)
  const [mainLineLength, setMainLineLength] = React.useState(1)

  React.useEffect(() => {
    if (isAnimating && nodes.length > 0) {
      const currentNodeCount = nodes.length
      const prevCount = previousNodeCount.current

      // Start from showing previous portion
      const startLength = prevCount / currentNodeCount
      setMainLineLength(startLength)

      // Animate to new length
      const timer = setTimeout(() => {
        setMainLineLength(1)
        previousNodeCount.current = currentNodeCount
      }, 50)

      return () => clearTimeout(timer)
    } else if (!isAnimating) {
      setMainLineLength(1)
    }
  }, [isAnimating, nodes.length])

  // Calculate connector line to plus button
  const connectorLine = React.useMemo(() => {
    const STARTING_NODE_RADIUS = 40
    const PLUS_BUTTON_RADIUS = 20
    const TIMELINE_STROKE_RADIUS = 8
    const GAP = 2
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

        <filter id="timeline-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main timeline line (grows horizontally/vertically) */}
      <motion.path
        d={mainLinePath}
        stroke="url(#timeline-gradient)"
        strokeWidth={16}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        fill="none"
        filter="url(#timeline-glow)"
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: isAnimating ? mainLineLength : 1,
        }}
        transition={{
          pathLength: {
            type: 'tween',
            duration: 1.0, // Main line grows in 1 second
            ease: [0.25, 0.1, 0.25, 1.0],
          },
        }}
        style={{
          mixBlendMode: 'multiply',
        }}
      />

      {/* Individual stem paths */}
      {stemPaths.map((stem, idx) => {
        // Only show stems up to the animating index
        if (idx > animatingToIndex) return null

        // Only the NEWEST stem (at animatingToIndex) should animate
        // Previous stems should be fully visible
        const isNewStem = isAnimating && idx === animatingToIndex

        // Delay: stem starts after main line reaches the junction
        // Main line grows full length in 1s, so delay is proportional to position
        const stemDelay = isNewStem ? 1.0 : 0 // Start after main line finishes

        return (
          <motion.path
            key={`stem-${idx}`}
            d={stem.path}
            stroke="url(#timeline-gradient)"
            strokeWidth={16}
            strokeLinecap="butt"
            strokeLinejoin="miter"
            fill="none"
            filter="url(#timeline-glow)"
            initial={{ pathLength: isNewStem ? 0 : 1 }}
            animate={{
              pathLength: 1,
            }}
            transition={{
              pathLength: {
                type: 'tween',
                duration: isNewStem ? 0.6 : 0, // Stem grows in 0.6s
                ease: [0.25, 0.1, 0.25, 1.0],
                delay: stemDelay,
              },
            }}
            style={{
              mixBlendMode: 'multiply',
            }}
          />
        )
      })}

      {/* Connector line to plus button */}
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
