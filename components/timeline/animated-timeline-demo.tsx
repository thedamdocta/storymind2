'use client'

/**
 * Demo Component for AnimatedTimelineSVG
 *
 * This component demonstrates the AnimatedTimelineSVG with:
 * - Interactive controls to add/remove nodes
 * - Toggle between horizontal and vertical orientation
 * - Live snake animation when adding nodes
 * - Visual verification of the 16px stroke, hard 90° turns, and alternating pattern
 */

import React from 'react'
import { AnimatedTimelineSVG } from './animated-timeline-svg'
import type { StoryNode, StartingNode } from '@/lib/types'
import { motion } from 'framer-motion'

const mockStartingNode: StartingNode = {
  id: 'starting-node',
  title: 'Story Beginning',
  content: null,
  plainText: '',
  color: '#8B5CF6',
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

export function AnimatedTimelineDemo() {
  const [nodes, setNodes] = React.useState<StoryNode[]>([])
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical'>('horizontal')
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [animatingToIndex, setAnimatingToIndex] = React.useState(-1)

  const addNode = async () => {
    if (isAnimating) return

    const newNode: StoryNode = {
      id: `node-${Date.now()}`,
      title: `Node ${nodes.length + 1}`,
      content: null,
      plainText: '',
      position: nodes.length,
      color: ['#8B5CF6', '#3B82F6', '#EC4899', '#10B981', '#F59E0B'][nodes.length % 5],
      images: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    setIsAnimating(true)
    setAnimatingToIndex(nodes.length)

    // Wait for animation to complete
    await new Promise((resolve) => setTimeout(resolve, 800))

    setNodes([...nodes, newNode])
    setIsAnimating(false)
  }

  const removeLastNode = () => {
    if (nodes.length > 0 && !isAnimating) {
      setNodes(nodes.slice(0, -1))
      setAnimatingToIndex(nodes.length - 2)
    }
  }

  const toggleOrientation = () => {
    setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal')
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-violet-50 to-blue-50 flex flex-col">
      {/* Controls */}
      <div className="p-6 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AnimatedTimelineSVG Demo
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              16px stroke • Hard 90° turns • Alternating stems • Smooth snake animation
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addNode}
              disabled={isAnimating}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnimating ? 'Animating...' : 'Add Node'}
            </button>
            <button
              onClick={removeLastNode}
              disabled={nodes.length === 0 || isAnimating}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Remove Last
            </button>
            <button
              onClick={toggleOrientation}
              disabled={isAnimating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Canvas */}
      <div className="flex-1 relative overflow-auto">
        <div
          className="relative"
          style={{
            width: orientation === 'horizontal' ? '2000px' : '100%',
            height: orientation === 'vertical' ? '2000px' : '100%',
            minHeight: '100%',
          }}
        >
          {/* Starting Node */}
          <motion.div
            className="absolute w-20 h-20 rounded-full glass-droplet flex items-center justify-center text-white font-bold text-sm cursor-pointer bg-violet-500/20"
            style={{
              left: orientation === 'horizontal' ? 60 : 'calc(50% - 40px)',
              top: orientation === 'vertical' ? 260 : 'calc(50% - 40px)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            Start
          </motion.div>

          {/* Animated SVG Timeline */}
          <AnimatedTimelineSVG
            nodes={nodes}
            startingNode={mockStartingNode}
            orientation={orientation}
            isAnimating={isAnimating}
            animatingToIndex={animatingToIndex}
          />

          {/* Nodes */}
          {nodes.map((node, index) => {
            const isEven = index % 2 === 0
            const mainAxisOffset = (index + 1) * 200
            const stemLength = 60

            const position =
              orientation === 'horizontal'
                ? {
                    left: 100 + mainAxisOffset - 28, // Center the 56px node
                    top: 300 + (isEven ? -stemLength : stemLength) - 28,
                  }
                : {
                    left: 100 + (isEven ? -stemLength : stemLength) - 28,
                    top: 300 + mainAxisOffset - 28,
                  }

            return (
              <motion.div
                key={node.id}
                className="absolute w-14 h-14 rounded-full glass-droplet flex items-center justify-center text-white font-bold text-xs cursor-pointer"
                style={{
                  left: position.left,
                  top: position.top,
                  backgroundColor: `${node.color}20`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 25,
                  delay: index === animatingToIndex ? 0.3 : 0,
                }}
              >
                {index + 1}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Info Panel */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-semibold text-gray-700">Nodes</div>
            <div className="text-gray-900 text-lg">{nodes.length}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700">Orientation</div>
            <div className="text-gray-900 text-lg capitalize">{orientation}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700">Stroke Width</div>
            <div className="text-gray-900 text-lg">16px</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700">Pattern</div>
            <div className="text-gray-900 text-lg">
              {orientation === 'horizontal' ? 'Up-Down' : 'Left-Right'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
