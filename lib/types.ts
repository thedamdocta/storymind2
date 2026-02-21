export type EntityType = 'character' | 'event' | 'place' | 'time-period' | 'storyline'

export type NodeViewState = 'circle' | 'card' | 'editor'

export interface StoryNode {
  id: string
  title: string
  content: Record<string, unknown> | null // Tiptap JSONContent
  plainText: string
  position: number
  color: string
  images: NodeImage[]
  createdAt: number
  updatedAt: number
}

export interface Entity {
  id: string
  name: string
  type: EntityType
  description: string
  color: string
}

export interface EntityMention {
  entityId: string
  nodeId: string
  context: string
}

export interface NodeImage {
  id: string
  url: string
  caption: string
}

export type TimelineOrientation = 'horizontal' | 'vertical'

export interface StartingNode {
  id: string
  title: string
  content: Record<string, unknown> | null // Tiptap JSONContent
  plainText: string
  color: string
  createdAt: number
  updatedAt: number
}

export type TimelineOffset = { x: number; y: number }

export interface StoryProject {
  id: string
  name: string
  nodes: Record<string, StoryNode>
  entities: Record<string, Entity>
  mentions: EntityMention[]
  nodeOrder: string[]
  orientation: TimelineOrientation
  startingNode: StartingNode | null
  timelineOffset: TimelineOffset
}

export type ScriptFormat = 'screenplay' | 'stageplay' | 'novel' | 'synopsis'
