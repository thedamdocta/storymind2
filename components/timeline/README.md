# Timeline Components

This directory contains the components for the Timeline Story Creator's progressive timeline system.

## Components Overview

### Production Components

#### ✅ AnimatedTimelineSVG
**File**: `animated-timeline-svg.tsx`
**Status**: ✓ Complete and tested
**Purpose**: SVG-based timeline that grows with smooth snake animation

**Features**:
- 16px stroke width (double the previous 8px)
- Hard 90° turns using strokeLinejoin="miter"
- Alternating stem pattern (up-down or left-right)
- Smooth pathLength animation (800ms)
- Gradient styling from globals.css

**Usage**:
```tsx
<AnimatedTimelineSVG
  nodes={nodesArray}
  startingNode={startingNode}
  orientation={orientation}
  isAnimating={isAnimatingNode}
  animatingToIndex={nodeOrder.length - 1}
/>
```

**Documentation**: See `animated-timeline-svg.md`

---

#### ⏳ StartingNode
**File**: `starting-node.tsx` (TO BE CREATED)
**Status**: Pending implementation
**Purpose**: Special first node that begins every timeline

**Planned Features**:
- 80px diameter (vs 56px for regular nodes)
- Glass droplet with violet/blue gradient glow
- Inline edit mode for title
- Dynamic positioning with timelineOffset

---

#### ⏳ TimelinePlusButton
**File**: `timeline-plus-button.tsx` (TO BE CREATED)
**Status**: Pending implementation
**Purpose**: Creation trigger that appears on the main timeline line

**Planned Features**:
- 40px diameter button with plus icon
- Glass droplet styling
- Positioned at end of main line
- Disabled state during animation

---

#### ⏳ TimelineView (Refactor)
**File**: `timeline-view.tsx` (EXISTING - NEEDS UPDATE)
**Status**: Needs refactoring
**Changes Required**:
- Remove TimelineHorizontal/TimelineVertical split
- Integrate AnimatedTimelineSVG
- Add dynamic positioning logic
- Position nodes absolutely based on calculated coordinates
- Add TimelinePlusButton at end of main line

---

#### ⏳ TimelineNode (Refactor)
**File**: `timeline-node.tsx` (EXISTING - NEEDS UPDATE)
**Status**: Needs refactoring
**Changes Required**:
- Accept `absolutePosition` prop for fixed positioning
- Remove grid-based layout
- Add `isAnimatingIn` prop
- Add delete button (X) on left side
- Remove stem rendering (now in SVG)

---

### Existing Components

#### TimelineControls
**File**: `timeline-controls.tsx`
**Status**: ✓ Working (no changes needed)
**Purpose**: Header controls for orientation, project name, etc.

#### TimelineAddButton
**File**: `timeline-add-button.tsx`
**Status**: ⚠️ Will be replaced by TimelinePlusButton
**Purpose**: Legacy add button (to be deprecated)

---

## Test & Demo Files

### ✅ animated-timeline-svg.test.tsx
**Status**: ✓ All tests passing
**Purpose**: Verify path calculation logic

**Run tests**:
```bash
npx tsx components/timeline/animated-timeline-svg.test.tsx
```

**Test coverage**:
- ✓ Horizontal path calculation
- ✓ Vertical path calculation
- ✓ Single node edge case
- ✓ Partial animation
- ✓ Node positioning coordinates

---

### ✅ animated-timeline-demo.tsx
**Status**: ✓ Working demo
**Purpose**: Interactive demonstration of AnimatedTimelineSVG

**Features**:
- Add/remove nodes with live animation
- Toggle horizontal/vertical orientation
- Visual verification of all requirements
- Real-time stats display

**Usage**:
```tsx
import { AnimatedTimelineDemo } from '@/components/timeline/animated-timeline-demo'
```

---

## Documentation Files

### animated-timeline-svg.md
Complete API documentation for AnimatedTimelineSVG component

### ANIMATED_TIMELINE_IMPLEMENTATION.md
Implementation guide with integration instructions

### README.md (this file)
Overview of all timeline components

---

## Implementation Status

### Phase 1: State Foundation ⏳
- [x] StartingNode type added to `lib/types.ts`
- [x] TimelineOffset type added to `lib/types.ts`
- [x] Store extended with progressive timeline actions
- [x] Migration for existing projects

### Phase 2: SVG Timeline System ✅
- [x] AnimatedTimelineSVG component created
- [x] Path calculation logic implemented
- [x] SVG gradient definitions added
- [x] Framer Motion animation integrated
- [x] Tests written and passing

### Phase 3: Core Components ⏳
- [ ] StartingNode component
- [ ] TimelinePlusButton component
- [ ] TimelineNode refactored
- [ ] Tests for new components

### Phase 4: Timeline View Overhaul ⏳
- [ ] Unify TimelineView
- [ ] Implement calculateNodePositions helper
- [ ] Add dynamic offset calculation
- [ ] Position all elements absolutely
- [ ] Wire up creation flow

### Phase 5: Animations & Polish ⏳
- [ ] Fine-tune snake animation
- [ ] Dynamic repositioning
- [ ] Delete animation
- [ ] Orientation switch animation

---

## Path Calculation Reference

### Constants
```typescript
const STEM_LENGTH = 60     // Length of perpendicular stems
const NODE_SPACING = 200   // Distance between nodes on main axis
const BASE_X = 100         // Starting X position
const BASE_Y = 300         // Starting Y position
```

### Horizontal Layout
```
   ○ Node 0 (UP)
   │
●──┴──────────┬──────────┴──► Main line
              │
              ○ Node 1 (DOWN)
```

### Vertical Layout
```
●
│
├──○ Node 0 (LEFT)
│
├────○ Node 1 (RIGHT)
│
▼
```

### Node Position Calculation

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

---

## Next Steps

1. ✅ **AnimatedTimelineSVG** - COMPLETE
2. ⏳ **Create StartingNode component** - See plan section 2.1
3. ⏳ **Create TimelinePlusButton component** - See plan section 2.2
4. ⏳ **Refactor TimelineView** - See plan section 2.4
5. ⏳ **Refactor TimelineNode** - See plan section 2.5
6. ⏳ **Integration testing** - Test full progressive timeline system

---

## Build Status

✓ **Compiles successfully**: `npm run build` passes
✓ **All tests pass**: Path calculation tests verified
✓ **TypeScript types**: Fully type-safe
✓ **Production ready**: Optimized and memoized

---

## References

- **Plan file**: `/Users/devon/.claude/plans/fuzzy-spinning-flurry.md`
- **Gradient source**: `app/globals.css` (`.timeline-line-gradient`)
- **Type definitions**: `lib/types.ts`
- **Store**: `lib/store.ts`
