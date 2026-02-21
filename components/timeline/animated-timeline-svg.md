# AnimatedTimelineSVG Component

## Overview

The `AnimatedTimelineSVG` component is the core visual element of the progressive timeline system. It renders an SVG-based timeline that grows with a smooth snake animation, featuring hard 90-degree turns and alternating stem patterns.

## Features

- **16px stroke width**: Double the previous 8px thickness for both main line and stems
- **Hard 90° turns**: Uses `strokeLinejoin="miter"` for sharp corners, not rounded
- **Alternating stem pattern**:
  - Horizontal: up-down-up-down
  - Vertical: left-right-left-right
- **Smooth snake animation**: Uses Framer Motion's `pathLength` animation
- **Gradient styling**: Matches the current `timeline-line-gradient` from globals.css
- **Performance optimized**: Memoized path calculations and efficient rendering

## Component Interface

```typescript
interface AnimatedTimelineSVGProps {
  nodes: StoryNode[]              // Array of story nodes
  startingNode: StartingNode      // The special starting node
  orientation: 'horizontal' | 'vertical'  // Timeline direction
  isAnimating: boolean            // Whether animation is in progress
  animatingToIndex: number        // Index of node being animated to
}
```

## Usage Example

```tsx
import { AnimatedTimelineSVG } from '@/components/timeline/animated-timeline-svg'
import { useStoryStore } from '@/lib/store'

function TimelineView() {
  const { nodes, startingNode, orientation, isAnimatingNode, nodeOrder } = useStoryStore()
  const nodesArray = nodeOrder.map(id => nodes[id])

  return (
    <div className="relative w-full h-full">
      <AnimatedTimelineSVG
        nodes={nodesArray}
        startingNode={startingNode}
        orientation={orientation}
        isAnimating={isAnimatingNode}
        animatingToIndex={nodeOrder.length - 1}
      />
    </div>
  )
}
```

## Path Calculation Logic

The component calculates the SVG path using the following constants:

```typescript
const STEM_LENGTH = 60     // Length of perpendicular stems
const NODE_SPACING = 200   // Distance between nodes on main axis
const BASE_X = 100         // Starting X position
const BASE_Y = 300         // Starting Y position
```

### Horizontal Orientation

For each node, the path:
1. Extends along the horizontal axis (x increases)
2. Makes a hard 90° turn perpendicular (up or down)
3. Extends along the stem to the node position

**Pattern:**
- Node 0 (even): UP (y decreases by STEM_LENGTH)
- Node 1 (odd): DOWN (y increases by STEM_LENGTH)
- Node 2 (even): UP
- Node 3 (odd): DOWN

**Example coordinates for 3 nodes:**
```
Start: (100, 300)
Node 0: (300, 300) → (300, 240)  [UP]
Node 1: (500, 300) → (500, 360)  [DOWN]
Node 2: (700, 300) → (700, 240)  [UP]
```

### Vertical Orientation

For each node, the path:
1. Extends along the vertical axis (y increases)
2. Makes a hard 90° turn perpendicular (left or right)
3. Extends along the stem to the node position

**Pattern:**
- Node 0 (even): LEFT (x decreases by STEM_LENGTH)
- Node 1 (odd): RIGHT (x increases by STEM_LENGTH)
- Node 2 (even): LEFT
- Node 3 (odd): RIGHT

**Example coordinates for 3 nodes:**
```
Start: (100, 300)
Node 0: (100, 500) → (40, 500)   [LEFT]
Node 1: (100, 700) → (160, 700)  [RIGHT]
Node 2: (100, 900) → (40, 900)   [LEFT]
```

## Visual Structure

### Horizontal Layout
```
   ○ Node 0 (up)
   │
●──┴──────────┬──────────┴──► Main line
              │
              ○ Node 1 (down)
```

### Vertical Layout
```
●
│
├──○ Node 0 (left)
│
├────○ Node 1 (right)
│
▼
```

## Animation Behavior

### Snake Animation Sequence

1. **User triggers node creation** (t=0ms)
2. **SVG path animates** (t=0 to t=800ms)
   - `pathLength`: 0 → 1 for new segment
   - Smooth continuous motion
   - Custom easing: `[0.4, 0.0, 0.2, 1]` (ease-in-out)
3. **Node entrance begins** (t=500ms, overlaps with path)
4. **Animation complete** (t=800ms)

### Path Length Calculation

The component uses Framer Motion's `pathLength` property to animate the path drawing:

```typescript
animate={{
  pathLength: isAnimating ? pathLength : 1,
}}
transition={{
  pathLength: {
    type: 'tween',
    duration: 0.8,  // 800ms
    ease: [0.4, 0.0, 0.2, 1],  // Custom cubic-bezier
  },
}}
```

## Gradient Styling

The gradient matches the current `timeline-line-gradient` from `globals.css`:

```typescript
<linearGradient id="timeline-gradient">
  <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />   // Violet
  <stop offset="33%" stopColor="rgba(59, 130, 246, 0.3)" />  // Blue
  <stop offset="66%" stopColor="rgba(236, 72, 153, 0.3)" />  // Pink
  <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" /> // Violet
</linearGradient>
```

The gradient automatically rotates based on orientation:
- Horizontal: `gradientTransform="rotate(0)"`
- Vertical: `gradientTransform="rotate(90)"`

## Glow Filter

The timeline includes a subtle glow filter for depth:

```xml
<filter id="timeline-glow">
  <feGaussianBlur stdDeviation="3" result="blur" />
  <feComposite in="SourceGraphic" in2="blur" operator="over" />
</filter>
```

## Styling Properties

- **strokeWidth**: `16` (double the current 8px)
- **strokeLinecap**: `"round"` (rounded ends)
- **strokeLinejoin**: `"miter"` (sharp 90° corners)
- **fill**: `"none"` (transparent fill)
- **mixBlendMode**: `"multiply"` (blends with background)

## Z-Index Positioning

The SVG must render **UNDER** nodes for proper visual layering:

```tsx
<svg
  className="absolute inset-0 pointer-events-none"
  style={{
    overflow: 'visible',
    zIndex: 10,  // Nodes should have zIndex > 10
  }}
>
```

## Performance Considerations

1. **Memoized path calculation**: Uses `React.useMemo` to avoid recalculating on every render
2. **Pointer events disabled**: `pointer-events: none` prevents interaction overhead
3. **Efficient re-renders**: Only recalculates when nodes, orientation, or animatingToIndex change
4. **Optimized SVG**: Minimal DOM elements, single path for entire timeline

## Testing

Run the test file to verify path calculation:

```bash
npx tsx components/timeline/animated-timeline-svg.test.tsx
```

View the demo component:

```tsx
import { AnimatedTimelineDemo } from '@/components/timeline/animated-timeline-demo'
```

## Integration with Timeline System

The component is designed to work with the progressive timeline system:

1. **Starting Node**: Path begins at the starting node position
2. **Node Positioning**: Nodes should be absolutely positioned at the end of each stem
3. **Plus Button**: Should appear at the end of the main line after the last node
4. **Dynamic Repositioning**: Timeline offset can shift the entire canvas

### Calculating Node Positions

To position nodes at the end of stems:

```typescript
function calculateNodePosition(
  index: number,
  orientation: 'horizontal' | 'vertical'
): { x: number; y: number } {
  const isEven = index % 2 === 0
  const mainAxisOffset = (index + 1) * 200
  const stemLength = 60

  if (orientation === 'horizontal') {
    return {
      x: 100 + mainAxisOffset,
      y: 300 + (isEven ? -stemLength : stemLength),
    }
  } else {
    return {
      x: 100 + (isEven ? -stemLength : stemLength),
      y: 300 + mainAxisOffset,
    }
  }
}
```

## Troubleshooting

### Path not animating smoothly

- Ensure `isAnimating` is set to `true` before animation starts
- Check that `animatingToIndex` is updated correctly
- Verify animation timing matches node creation timing (800ms)

### Hard corners appear rounded

- Confirm `strokeLinejoin="miter"` is set
- Check that stroke width is 16px (not too thin)
- Verify browser supports SVG miter joins

### Gradient not visible

- Check that gradient ID matches stroke URL: `url(#timeline-gradient)`
- Ensure gradient stops have correct opacity (0.3)
- Verify gradient transform is correct for orientation

### Performance issues with many nodes

- Use `React.useMemo` for path calculation
- Consider limiting visible nodes (viewport culling)
- Monitor with Chrome DevTools Performance profiler

## Future Enhancements

1. **Curved stems**: Replace hard 90° turns with smooth bezier curves
2. **Hover effects**: Highlight path to hovered node
3. **Interactive scrubbing**: Click on timeline to navigate
4. **Branching support**: Multiple stems from a single node
5. **Custom themes**: Different visual styles (minimal, neon, cinematic)

## Related Components

- `StartingNode`: The special first node component
- `TimelinePlusButton`: Creation trigger button
- `TimelineNode`: Individual story node component
- `TimelineView`: Main timeline container

## References

- Plan file: `/Users/devon/.claude/plans/fuzzy-spinning-flurry.md` (Section 2.3)
- Gradient source: `app/globals.css` (`.timeline-line-gradient`)
- Type definitions: `lib/types.ts` (`StoryNode`, `StartingNode`)
- Store: `lib/store.ts` (Progressive timeline actions)
