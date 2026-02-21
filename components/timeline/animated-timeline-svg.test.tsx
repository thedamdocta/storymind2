/**
 * Test file for AnimatedTimelineSVG component
 *
 * This file demonstrates the path calculation logic and verifies:
 * 1. Correct coordinates for both horizontal and vertical orientations
 * 2. Alternating stem pattern (up-down-up-down or left-right-left-right)
 * 3. Hard 90° turns at the correct positions
 */

import type { StoryNode, StartingNode } from '@/lib/types'

// Constants (matching the component)
const STEM_LENGTH = 60
const NODE_SPACING = 200
const BASE_X = 100
const BASE_Y = 300

function calculateTimelinePath(
  nodes: StoryNode[],
  startingNode: StartingNode,
  orientation: 'horizontal' | 'vertical',
  animatingToIndex: number
): string {
  const startingNodePos = { x: BASE_X, y: BASE_Y }
  let path = `M ${startingNodePos.x} ${startingNodePos.y}`

  for (let i = 0; i <= animatingToIndex && i < nodes.length; i++) {
    const isEven = i % 2 === 0
    const mainAxisOffset = (i + 1) * NODE_SPACING

    if (orientation === 'horizontal') {
      const mainX = startingNodePos.x + mainAxisOffset
      path += ` L ${mainX} ${startingNodePos.y}`
      const stemY = startingNodePos.y + (isEven ? -STEM_LENGTH : STEM_LENGTH)
      path += ` L ${mainX} ${stemY}`
    } else {
      const mainY = startingNodePos.y + mainAxisOffset
      path += ` L ${startingNodePos.x} ${mainY}`
      const stemX = startingNodePos.x + (isEven ? -STEM_LENGTH : STEM_LENGTH)
      path += ` L ${stemX} ${mainY}`
    }
  }

  return path
}

// Mock data for testing
const mockStartingNode: StartingNode = {
  id: 'starting-node',
  title: 'Test Story',
  content: null,
  plainText: '',
  color: '#8B5CF6',
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

const mockNodes: StoryNode[] = [
  {
    id: 'node-1',
    title: 'Node 1',
    content: null,
    plainText: '',
    position: 0,
    color: '#8B5CF6',
    images: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'node-2',
    title: 'Node 2',
    content: null,
    plainText: '',
    position: 1,
    color: '#3B82F6',
    images: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'node-3',
    title: 'Node 3',
    content: null,
    plainText: '',
    position: 2,
    color: '#EC4899',
    images: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

// Test horizontal orientation
console.log('=== HORIZONTAL ORIENTATION ===')
console.log('Starting position: (100, 300)\n')

const horizontalPath = calculateTimelinePath(mockNodes, mockStartingNode, 'horizontal', 2)
console.log('Path for 3 nodes:')
console.log(horizontalPath)
console.log('\nExpected coordinates:')
console.log('- Start: M 100 300')
console.log('- Node 0 (even): L 300 300 → L 300 240 (UP)')
console.log('- Node 1 (odd):  L 500 300 → L 500 360 (DOWN)')
console.log('- Node 2 (even): L 700 300 → L 700 240 (UP)')

// Verify the pattern
const expectedHorizontal = 'M 100 300 L 300 300 L 300 240 L 500 300 L 500 360 L 700 300 L 700 240'
console.log('\nPattern match:', horizontalPath === expectedHorizontal ? '✓ PASS' : '✗ FAIL')

console.log('\n=== VERTICAL ORIENTATION ===')
console.log('Starting position: (100, 300)\n')

const verticalPath = calculateTimelinePath(mockNodes, mockStartingNode, 'vertical', 2)
console.log('Path for 3 nodes:')
console.log(verticalPath)
console.log('\nExpected coordinates:')
console.log('- Start: M 100 300')
console.log('- Node 0 (even): L 100 500 → L 40 500 (LEFT)')
console.log('- Node 1 (odd):  L 100 700 → L 160 700 (RIGHT)')
console.log('- Node 2 (even): L 100 900 → L 40 900 (LEFT)')

// Verify the pattern
const expectedVertical = 'M 100 300 L 100 500 L 40 500 L 100 700 L 160 700 L 100 900 L 40 900'
console.log('\nPattern match:', verticalPath === expectedVertical ? '✓ PASS' : '✗ FAIL')

// Test edge cases
console.log('\n=== EDGE CASES ===')

// Single node
const singleNodePath = calculateTimelinePath([mockNodes[0]], mockStartingNode, 'horizontal', 0)
console.log('\nSingle node (horizontal):')
console.log(singleNodePath)
console.log('Expected: M 100 300 L 300 300 L 300 240')
console.log('Match:', singleNodePath === 'M 100 300 L 300 300 L 300 240' ? '✓ PASS' : '✗ FAIL')

// Animation in progress (animating to index 1 out of 3 nodes)
const partialPath = calculateTimelinePath(mockNodes, mockStartingNode, 'horizontal', 1)
console.log('\nAnimating to node 1 (2 nodes visible):')
console.log(partialPath)
console.log('Expected: M 100 300 L 300 300 L 300 240 L 500 300 L 500 360')
console.log('Match:', partialPath === 'M 100 300 L 300 300 L 300 240 L 500 300 L 500 360' ? '✓ PASS' : '✗ FAIL')

console.log('\n=== NODE POSITIONS ===')
console.log('Based on the path, nodes should be positioned at:')
console.log('Horizontal orientation:')
console.log('- Node 0: (300, 240) - end of first stem')
console.log('- Node 1: (500, 360) - end of second stem')
console.log('- Node 2: (700, 240) - end of third stem')
console.log('\nVertical orientation:')
console.log('- Node 0: (40, 500) - end of first stem')
console.log('- Node 1: (160, 700) - end of second stem')
console.log('- Node 2: (40, 900) - end of third stem')

console.log('\n=== VISUAL STRUCTURE ===')
console.log('Horizontal (stems alternate UP-DOWN-UP):')
console.log('   ○ Node 0 (240)')
console.log('   │')
console.log('●──┴──────────┬──────────┴──► Main line (300)')
console.log('              │')
console.log('              ○ Node 1 (360)')
console.log('')
console.log('Vertical (stems alternate LEFT-RIGHT-LEFT):')
console.log('●')
console.log('│')
console.log('├──○ Node 0 (left)')
console.log('│')
console.log('├────○ Node 1 (right)')
console.log('│')
console.log('▼')

export {}
