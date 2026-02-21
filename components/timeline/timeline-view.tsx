"use client"

import * as React from "react"
import { useStoryStore } from "@/lib/store"
import { TimelineControls } from "./timeline-controls"
import { TimelineNode } from "./timeline-node"
import { AnimatePresence } from "framer-motion"
import { AnimatedTimelineSVG } from "./animated-timeline-svg"
import { StartingNode } from "./starting-node"
import { TimelinePlusButton } from "./timeline-plus-button"
import type { TimelineOrientation } from "@/lib/types"

// Constants (must match AnimatedTimelineSVG)
const STEM_LENGTH = 60
const NODE_SPACING = 200
const BASE_X = 100
const BASE_Y = 300

// Calculate absolute positions for each node based on timeline pattern
function calculateNodePositions(
  nodeOrder: string[],
  orientation: TimelineOrientation,
): Record<number, { x: number; y: number }> {
  const positions: Record<number, { x: number; y: number }> = {}
  const STEM_LENGTH = 60
  const NODE_SPACING = 200
  const BASE_X = 100
  const BASE_Y = 300
  const NODE_RADIUS = 28 // Half of 56px node size
  const STARTING_NODE_RADIUS = 40 // Half of 80px starting node

  // Timeline starts after the starting node
  const timelineStartX = orientation === 'horizontal' ? BASE_X + STARTING_NODE_RADIUS : BASE_X
  const timelineStartY = orientation === 'vertical' ? BASE_Y + STARTING_NODE_RADIUS : BASE_Y

  nodeOrder.forEach((_, index) => {
    const isEven = index % 2 === 0
    const mainAxisOffset = (index + 1) * NODE_SPACING

    if (orientation === 'horizontal') {
      // Nodes positioned BEYOND stem ends (not overlapping)
      positions[index] = {
        x: timelineStartX + mainAxisOffset,
        y: timelineStartY + (isEven ? -(STEM_LENGTH + NODE_RADIUS) : (STEM_LENGTH + NODE_RADIUS)),
      }
    } else {
      // Nodes positioned BEYOND stem ends (not overlapping)
      positions[index] = {
        x: timelineStartX + (isEven ? -(STEM_LENGTH + NODE_RADIUS) : (STEM_LENGTH + NODE_RADIUS)),
        y: timelineStartY + mainAxisOffset,
      }
    }
  })

  return positions
}

// Calculate plus button position (at end of main timeline line)
function calculatePlusPosition(
  nodeCount: number,
  orientation: TimelineOrientation,
): { x: number; y: number } {
  const NODE_SPACING = 200
  const BASE_X = 100
  const BASE_Y = 300
  const STARTING_NODE_RADIUS = 40

  // Timeline starts after the starting node
  const timelineStartX = orientation === 'horizontal' ? BASE_X + STARTING_NODE_RADIUS : BASE_X
  const timelineStartY = orientation === 'vertical' ? BASE_Y + STARTING_NODE_RADIUS : BASE_Y

  if (orientation === 'horizontal') {
    return {
      x: timelineStartX + (nodeCount + 1) * NODE_SPACING,
      y: timelineStartY,
    }
  } else {
    return {
      x: timelineStartX,
      y: timelineStartY + (nodeCount + 1) * NODE_SPACING,
    }
  }
}

export function TimelineView() {
  const {
    orientation,
    nodeOrder,
    nodes,
    startingNode,
    createNextNode,
    isAnimatingNode,
    animatingNodeId,
    viewportPan,
    setViewportPan,
    viewportZoom,
    setViewportZoom,
  } = useStoryStore()

  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const isPanning = React.useRef(false)
  const lastMousePos = React.useRef({ x: 0, y: 0 })
  const currentPanRef = React.useRef({ x: viewportPan.x, y: viewportPan.y })
  const currentZoomRef = React.useRef(viewportZoom)

  // Sync refs with state when state changes externally (e.g., auto-pan)
  React.useEffect(() => {
    currentPanRef.current = { x: viewportPan.x, y: viewportPan.y }
  }, [viewportPan])

  React.useEffect(() => {
    currentZoomRef.current = viewportZoom
  }, [viewportZoom])

  // Calculate node positions
  const nodePositions = React.useMemo(() => {
    return calculateNodePositions(nodeOrder, orientation)
  }, [nodeOrder, orientation])

  // Calculate plus button position
  const plusPosition = React.useMemo(() => {
    return calculatePlusPosition(nodeOrder.length, orientation)
  }, [nodeOrder.length, orientation])

  // Auto-pan on node creation (delayed to let animation complete)
  const lastAnimatingNodeIdRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!animatingNodeId) {
      lastAnimatingNodeIdRef.current = null
      return
    }

    if (lastAnimatingNodeIdRef.current === animatingNodeId) return

    if (!containerRef.current) return

    const container = containerRef.current
    const newNodeIndex = nodeOrder.findIndex(id => id === animatingNodeId)
    if (newNodeIndex === -1) return

    if (newNodeIndex === 0) {
      lastAnimatingNodeIdRef.current = animatingNodeId
      return
    }

    const newNodePosition = nodePositions[newNodeIndex]
    if (!newNodePosition) return

    // Delay the pan until after timeline animation completes (2000ms total animation)
    // Node is created at 1600ms, so we wait 500ms more for the branch to finish growing
    const panTimer = setTimeout(() => {
      const targetX = newNodePosition.x * viewportZoom
      const targetY = newNodePosition.y * viewportZoom

      if (orientation === 'horizontal') {
        const newPanX = container.offsetWidth / 2 - targetX
        setViewportPan({ x: newPanX, y: currentPanRef.current.y })
      } else {
        const newPanY = container.offsetHeight / 2 - targetY
        setViewportPan({ x: currentPanRef.current.x, y: newPanY })
      }
    }, 500)

    lastAnimatingNodeIdRef.current = animatingNodeId
    return () => clearTimeout(panTimer)
  }, [animatingNodeId, nodePositions, nodeOrder, orientation, viewportZoom, setViewportPan])

  // Auto-pan on node deletion with smooth transition
  const prevNodeCountRef = React.useRef(nodeOrder.length)
  const [isAutoPanning, setIsAutoPanning] = React.useState(false)

  React.useEffect(() => {
    const currentCount = nodeOrder.length
    const prevCount = prevNodeCountRef.current

    // Deletion detected (count decreased)
    if (currentCount < prevCount && currentCount > 0) {
      const lastNodeIndex = currentCount - 1
      const lastNodePosition = nodePositions[lastNodeIndex]

      if (lastNodePosition && containerRef.current) {
        const container = containerRef.current
        const targetX = lastNodePosition.x * viewportZoom
        const targetY = lastNodePosition.y * viewportZoom

        // Enable smooth transition for deletion pan
        setIsAutoPanning(true)

        // Pan to center the last remaining node
        if (orientation === 'horizontal') {
          const newPanX = container.offsetWidth / 2 - targetX
          setViewportPan({ x: newPanX, y: currentPanRef.current.y })
        } else {
          const newPanY = container.offsetHeight / 2 - targetY
          setViewportPan({ x: currentPanRef.current.x, y: newPanY })
        }

        // Clear auto-panning flag after transition completes
        setTimeout(() => {
          setIsAutoPanning(false)
        }, 500)
      }
    }

    prevNodeCountRef.current = currentCount
  }, [nodeOrder.length, nodePositions, orientation, viewportZoom, setViewportPan])

  // Pan handlers - highly sensitive drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left click
    isPanning.current = true
    lastMousePos.current = { x: e.clientX, y: e.clientY }
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current || !canvasRef.current) return

    const deltaX = e.clientX - lastMousePos.current.x
    const deltaY = e.clientY - lastMousePos.current.y

    // Update ref (no re-render)
    currentPanRef.current.x += deltaX
    currentPanRef.current.y += deltaY

    // Update transform directly via CSS (no React re-render)
    canvasRef.current.style.transform = `translate(${currentPanRef.current.x}px, ${currentPanRef.current.y}px) scale(${viewportZoom})`

    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    if (isPanning.current) {
      // Sync ref back to React state when pan ends
      setViewportPan({ x: currentPanRef.current.x, y: currentPanRef.current.y })
    }
    isPanning.current = false
  }

  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      isPanning.current = false
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  // Zoom controls
  const handleZoomIn = () => {
    if (!canvasRef.current) return
    // Update ref (no re-render)
    const newZoom = Math.min(2.0, currentZoomRef.current + 0.1)
    currentZoomRef.current = newZoom
    // Update transform directly via CSS (no React re-render)
    canvasRef.current.style.transform = `translate(${currentPanRef.current.x}px, ${currentPanRef.current.y}px) scale(${newZoom})`
    // Sync to React state for persistence
    setViewportZoom(newZoom)
  }

  const handleZoomOut = () => {
    if (!canvasRef.current) return
    // Update ref (no re-render)
    const newZoom = Math.max(0.1, currentZoomRef.current - 0.1)
    currentZoomRef.current = newZoom
    // Update transform directly via CSS (no React re-render)
    canvasRef.current.style.transform = `translate(${currentPanRef.current.x}px, ${currentPanRef.current.y}px) scale(${newZoom})`
    // Sync to React state for persistence
    setViewportZoom(newZoom)
  }

  const handleCreateNode = async () => {
    await createNextNode()
  }

  // Convert nodes to array for SVG component
  const nodesArray = nodeOrder.map((id) => nodes[id])

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <TimelineControls />

      {/* Infinite Canvas Viewport */}
      <div
        ref={containerRef}
        className="flex-1 w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Canvas with pan and zoom transform */}
        <div
          ref={canvasRef}
          className="absolute inset-0 origin-center"
          style={{
            transform: `translate(${viewportPan.x}px, ${viewportPan.y}px) scale(${viewportZoom})`,
            transition: (isAnimatingNode || isAutoPanning) ? 'transform 0.5s ease-out' : 'none',
            minWidth: `${Math.max(BASE_X + (nodeOrder.length + 2) * NODE_SPACING, 1500)}px`,
            minHeight: `${Math.max(BASE_Y + STEM_LENGTH + 200, 800)}px`,
          }}
        >
          {/* Animated SVG Timeline */}
          {startingNode && (
            <AnimatedTimelineSVG
              nodes={nodesArray}
              startingNode={startingNode}
              orientation={orientation}
              isAnimating={isAnimatingNode}
              animatingToIndex={nodeOrder.length - 1}
            />
          )}

          {/* Starting Node */}
          {startingNode && <StartingNode orientation={orientation} />}

          {/* Regular Nodes (absolutely positioned) */}
          <AnimatePresence>
            {nodeOrder.map((id, index) => {
              const position = nodePositions[index]
              if (!position) return null
              return (
                <TimelineNode
                  key={id}
                  id={id}
                  position={index}
                  orientation={orientation}
                  absolutePosition={position}
                  isAnimatingIn={animatingNodeId === id}
                />
              )
            })}
          </AnimatePresence>

          {/* Plus Button */}
          {startingNode && (
            <TimelinePlusButton
              position={plusPosition}
              orientation={orientation}
              onClick={handleCreateNode}
              disabled={isAnimatingNode}
            />
          )}
        </div>

        {/* Empty state message */}
        {nodeOrder.length === 0 && !startingNode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-foreground/40 italic font-sans tracking-wide">
              Initializing timeline...
            </div>
          </div>
        )}

        {/* Zoom Controls - Bottom Right */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-auto z-50">
          <button
            onClick={handleZoomIn}
            className="w-12 h-12 rounded-full glass-droplet flex items-center justify-center hover:scale-110 transition-transform"
            title="Zoom In"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 12px 25px -4px rgba(0, 0, 0, 0.4), 0 4px 8px -2px rgba(0, 0, 0, 0.2), inset 0 10px 14px -5px rgba(0, 0, 0, 0.35), inset 0 -12px 16px -6px rgba(255, 255, 255, 1), inset 0 0 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <span className="text-xl font-bold text-foreground">+</span>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-12 h-12 rounded-full glass-droplet flex items-center justify-center hover:scale-110 transition-transform"
            title="Zoom Out"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 12px 25px -4px rgba(0, 0, 0, 0.4), 0 4px 8px -2px rgba(0, 0, 0, 0.2), inset 0 10px 14px -5px rgba(0, 0, 0, 0.35), inset 0 -12px 16px -6px rgba(255, 255, 255, 1), inset 0 0 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <span className="text-xl font-bold text-foreground">−</span>
          </button>
          <div className="text-xs text-center text-foreground/60 font-mono mt-1">
            {Math.round(viewportZoom * 100)}%
          </div>
        </div>
      </div>
    </div>
  )
}
