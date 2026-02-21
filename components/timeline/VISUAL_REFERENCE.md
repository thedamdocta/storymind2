# AnimatedTimelineSVG Visual Reference

## Coordinate System

### Starting Position
```
Base coordinates:
- BASE_X = 100
- BASE_Y = 300

Starting Node Position:
● (100, 300)
```

---

## Horizontal Orientation

### Visual Layout (3 nodes)

```
                          ○ Node 0                    ○ Node 2
                          (300, 240)                  (700, 240)
                              │                           │
                              │ 60px stem                 │ 60px stem
                              │                           │
  ●─────────────────────┴─────────────────────┬─────────────────────┴─────────►
  (100, 300)          (300, 300)          (500, 300)              (700, 300)
  Start                                        │
                                               │ 60px stem
                                               │
                                           ○ Node 1
                                           (500, 360)

  ◄────────200px──────►◄────────200px──────►◄────────200px──────►
```

### SVG Path Breakdown

```svg
M 100 300              ← Start at starting node
L 300 300              ← Extend horizontally 200px
L 300 240              ← Turn UP 60px (Node 0 stem)
L 500 300              ← Return to main line (300 → 500, y stays 300)
L 500 360              ← Turn DOWN 60px (Node 1 stem)
L 700 300              ← Return to main line (500 → 700, y stays 300)
L 700 240              ← Turn UP 60px (Node 2 stem)
```

### Node Coordinates Table

| Node | Index | Even/Odd | Direction | X Position | Y Position | Coordinates |
|------|-------|----------|-----------|------------|------------|-------------|
| 0    | 0     | Even     | UP        | 300        | 240        | (300, 240)  |
| 1    | 1     | Odd      | DOWN      | 500        | 360        | (500, 360)  |
| 2    | 2     | Even     | UP        | 700        | 240        | (700, 240)  |
| 3    | 3     | Odd      | DOWN      | 900        | 360        | (900, 360)  |

### Calculation Formula

```typescript
// For node at index i in horizontal orientation:
const isEven = i % 2 === 0
const x = 100 + (i + 1) * 200
const y = 300 + (isEven ? -60 : 60)

// Examples:
// Node 0 (i=0): x = 100 + 200 = 300, y = 300 - 60 = 240 ✓
// Node 1 (i=1): x = 100 + 400 = 500, y = 300 + 60 = 360 ✓
// Node 2 (i=2): x = 100 + 600 = 700, y = 300 - 60 = 240 ✓
```

---

## Vertical Orientation

### Visual Layout (3 nodes)

```
   ● (100, 300) Start
   │
   │ 200px spacing
   │
   ├────────────○ Node 0 (40, 500)
   │         60px stem (LEFT)
   │
   │ 200px spacing
   │
   ├──────────────────○ Node 1 (160, 700)
   │             60px stem (RIGHT)
   │
   │ 200px spacing
   │
   ├────────────○ Node 2 (40, 900)
   │         60px stem (LEFT)
   │
   ▼
```

### SVG Path Breakdown

```svg
M 100 300              ← Start at starting node
L 100 500              ← Extend vertically 200px
L 40 500               ← Turn LEFT 60px (Node 0 stem)
L 100 700              ← Return to main line (y: 500 → 700, x stays 100)
L 160 700              ← Turn RIGHT 60px (Node 1 stem)
L 100 900              ← Return to main line (y: 700 → 900, x stays 100)
L 40 900               ← Turn LEFT 60px (Node 2 stem)
```

### Node Coordinates Table

| Node | Index | Even/Odd | Direction | X Position | Y Position | Coordinates |
|------|-------|----------|-----------|------------|------------|-------------|
| 0    | 0     | Even     | LEFT      | 40         | 500        | (40, 500)   |
| 1    | 1     | Odd      | RIGHT     | 160        | 700        | (160, 700)  |
| 2    | 2     | Even     | LEFT      | 40         | 900        | (40, 900)   |
| 3    | 3     | Odd      | RIGHT     | 160        | 1100       | (160, 1100) |

### Calculation Formula

```typescript
// For node at index i in vertical orientation:
const isEven = i % 2 === 0
const x = 100 + (isEven ? -60 : 60)
const y = 300 + (i + 1) * 200

// Examples:
// Node 0 (i=0): x = 100 - 60 = 40, y = 300 + 200 = 500 ✓
// Node 1 (i=1): x = 100 + 60 = 160, y = 300 + 400 = 700 ✓
// Node 2 (i=2): x = 100 - 60 = 40, y = 300 + 600 = 900 ✓
```

---

## Stroke Specifications

### Main Line & Stems
```
strokeWidth: 16px
strokeLinecap: "round"
strokeLinejoin: "miter"  ← CRITICAL for hard 90° turns
fill: "none"
```

### Visual Comparison

```
8px stroke (OLD):
   ○
   │ ← Thin stem
●──┴──

16px stroke (NEW):
   ○
   ║ ← Thick stem (double width)
●══╩══
```

---

## Gradient Definition

### Color Stops

```xml
<linearGradient id="timeline-gradient">
  <stop offset="0%"   stopColor="rgba(139, 92, 246, 0.3)" />  <!-- Violet -->
  <stop offset="33%"  stopColor="rgba(59, 130, 246, 0.3)" />  <!-- Blue -->
  <stop offset="66%"  stopColor="rgba(236, 72, 153, 0.3)" />  <!-- Pink -->
  <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />  <!-- Violet -->
</linearGradient>
```

### Gradient Direction

```
Horizontal: gradientTransform="rotate(0)"
├─ Violet ─ Blue ─ Pink ─ Violet ─►

Vertical: gradientTransform="rotate(90)"
├─ Violet
│
├─ Blue
│
├─ Pink
│
├─ Violet
▼
```

---

## Z-Index Layering

```
┌─────────────────────────────────────┐
│  Editor Overlay (z-index: 40)      │
│  ┌───────────────────────────────┐ │
│  │ Plus Button (z-index: 30)     │ │
│  │ ┌─────────────────────────┐   │ │
│  │ │ Nodes (z-index: 20)     │   │ │
│  │ │ ┌───────────────────┐   │   │ │
│  │ │ │ SVG Timeline      │   │   │ │
│  │ │ │ (z-index: 10)     │   │   │ │
│  │ │ └───────────────────┘   │   │ │
│  │ └─────────────────────────┘   │ │
│  └───────────────────────────────┘ │
│  Background (z-index: 0)           │
└─────────────────────────────────────┘
```

---

## Animation Sequence

### Snake Animation Timeline

```
t=0ms     Path animation starts
          ┌─── pathLength: 0 → 1
          │
          ├─── Smooth easing: [0.4, 0.0, 0.2, 1]
          │
t=500ms   Node entrance begins
          ┌─── Scale: 0 → 1
          │    Opacity: 0 → 1
          │
t=800ms   Path animation complete
          │
t=900ms   Node fully visible
          └─── Animation state clears
```

### PathLength Calculation

```typescript
// For animating to node at index N out of total T nodes:
const pathLength = (N + 1) / T

// Examples:
// Animating to node 0 out of 3: (0 + 1) / 3 = 0.33 (33%)
// Animating to node 1 out of 3: (1 + 1) / 3 = 0.67 (67%)
// Animating to node 2 out of 3: (2 + 1) / 3 = 1.00 (100%)
```

---

## Plus Button Positioning

### Horizontal
```
   ○ Last Node
   │
●──┴──────────┬──────────⊕ Plus Button
              │      (x = BASE_X + (N+1) * SPACING)
              ○      (y = BASE_Y)
```

### Vertical
```
   ●
   │
   ├──○ Last Node
   │
   ├──⊕ Plus Button
   │  (x = BASE_X)
   │  (y = BASE_Y + (N+1) * SPACING)
   ▼
```

### Calculation

```typescript
function calculatePlusPosition(
  nodeCount: number,
  orientation: 'horizontal' | 'vertical'
): { x: number; y: number } {
  if (orientation === 'horizontal') {
    return {
      x: 100 + (nodeCount + 1) * 200,
      y: 300,
    }
  } else {
    return {
      x: 100,
      y: 300 + (nodeCount + 1) * 200,
    }
  }
}
```

---

## Node Sizing

### Starting Node
```
┌────────────────┐
│                │
│   80 × 80 px   │  ← Larger than regular nodes
│                │
│   "Start"      │
└────────────────┘
```

### Regular Nodes
```
┌──────────┐
│          │
│ 56×56 px │  ← Standard glass droplet size
│          │
└──────────┘
```

### Plus Button
```
┌────────┐
│  ⊕     │
│ 40×40  │  ← Smaller, floating button
│        │
└────────┘
```

---

## Viewport Dimensions

### Minimum Canvas Size

```
Horizontal:
Width:  100 (base) + N × 200 (spacing) + 200 (buffer)
Height: 600 (300 - 60 up, 300 + 60 down, + buffers)

Vertical:
Width:  300 (100 - 60 left, 100 + 60 right, + buffers)
Height: 300 (base) + N × 200 (spacing) + 200 (buffer)
```

### Example for 5 Nodes

```
Horizontal:
Width:  100 + 5×200 + 200 = 1,300px
Height: 600px

Vertical:
Width:  300px
Height: 300 + 5×200 + 200 = 1,500px
```

---

## Integration Checklist

### Component Props
- [x] `nodes`: Array of StoryNode objects
- [x] `startingNode`: StartingNode object
- [x] `orientation`: 'horizontal' | 'vertical'
- [x] `isAnimating`: boolean (from store)
- [x] `animatingToIndex`: number (last node index)

### Positioning
- [x] SVG positioned absolute, inset-0
- [x] SVG z-index: 10 (under nodes)
- [x] pointer-events: none
- [x] overflow: visible

### Animation
- [x] pathLength transition: 800ms
- [x] Easing: [0.4, 0.0, 0.2, 1]
- [x] Coordinates with store.createNextNode()

### Styling
- [x] 16px strokeWidth
- [x] strokeLinejoin: "miter"
- [x] Gradient from globals.css
- [x] Glow filter applied

### Testing
- [x] Run test file (all pass)
- [x] Build succeeds
- [x] Demo works
- [x] Both orientations verified

---

## Quick Reference

```typescript
// Constants
STEM_LENGTH = 60
NODE_SPACING = 200
BASE_X = 100
BASE_Y = 300

// Horizontal node position
x = BASE_X + (index + 1) * NODE_SPACING
y = BASE_Y + (index % 2 === 0 ? -STEM_LENGTH : STEM_LENGTH)

// Vertical node position
x = BASE_X + (index % 2 === 0 ? -STEM_LENGTH : STEM_LENGTH)
y = BASE_Y + (index + 1) * NODE_SPACING

// Plus button position (horizontal)
x = BASE_X + (nodeCount + 1) * NODE_SPACING
y = BASE_Y

// Plus button position (vertical)
x = BASE_X
y = BASE_Y + (nodeCount + 1) * NODE_SPACING
```
