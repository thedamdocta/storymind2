import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  StoryNode,
  Entity,
  EntityMention,
  EntityType,
  TimelineOrientation,
  NodeViewState,
  NodeImage,
} from './types'
import { getNextNodeColor, getEntityColor } from './entity-colors'

interface StoryState {
  // Project data
  projectName: string
  nodes: Record<string, StoryNode>
  entities: Record<string, Entity>
  mentions: EntityMention[]
  nodeOrder: string[]
  orientation: TimelineOrientation

  // UI state (not persisted)
  nodeViewStates: Record<string, NodeViewState>
  selectedEntityId: string | null
  sidebarView: 'entities' | 'entity-detail'

  // Node actions
  addNode: (title: string) => string
  updateNode: (id: string, updates: Partial<StoryNode>) => void
  deleteNode: (id: string) => void
  reorderNodes: (newOrder: string[]) => void
  setNodeViewState: (id: string, state: NodeViewState) => void
  collapseAllNodes: () => void

  // Entity actions
  addEntity: (name: string, type: EntityType, description?: string) => string
  updateEntity: (id: string, updates: Partial<Entity>) => void
  deleteEntity: (id: string) => void
  selectEntity: (id: string | null) => void

  // Mention actions
  addMention: (entityId: string, nodeId: string, context: string) => void
  removeMentionsForNode: (nodeId: string) => void
  syncMentions: (nodeId: string, mentions: EntityMention[]) => void

  // Image actions
  addImageToNode: (nodeId: string, image: NodeImage) => void
  removeImageFromNode: (nodeId: string, imageId: string) => void

  // Settings
  setOrientation: (orientation: TimelineOrientation) => void
  setProjectName: (name: string) => void
  setSidebarView: (view: 'entities' | 'entity-detail') => void
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      projectName: 'Untitled Story',
      nodes: {},
      entities: {},
      mentions: [],
      nodeOrder: [],
      orientation: 'horizontal',
      nodeViewStates: {},
      selectedEntityId: null,
      sidebarView: 'entities',

      addNode: (title: string) => {
        const id = generateId()
        const position = get().nodeOrder.length
        const node: StoryNode = {
          id,
          title,
          content: null,
          plainText: '',
          position,
          color: getNextNodeColor(position),
          images: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({
          nodes: { ...state.nodes, [id]: node },
          nodeOrder: [...state.nodeOrder, id],
        }))
        return id
      },

      updateNode: (id, updates) => {
        set((state) => ({
          nodes: {
            ...state.nodes,
            [id]: { ...state.nodes[id], ...updates, updatedAt: Date.now() },
          },
        }))
      },

      deleteNode: (id) => {
        set((state) => {
          const { [id]: _, ...remainingNodes } = state.nodes
          const { [id]: __, ...remainingViewStates } = state.nodeViewStates
          return {
            nodes: remainingNodes,
            nodeOrder: state.nodeOrder.filter((nId) => nId !== id),
            nodeViewStates: remainingViewStates,
            mentions: state.mentions.filter((m) => m.nodeId !== id),
          }
        })
      },

      reorderNodes: (newOrder) => {
        set({ nodeOrder: newOrder })
      },

      setNodeViewState: (id, viewState) => {
        set((state) => ({
          nodeViewStates: { ...state.nodeViewStates, [id]: viewState },
        }))
      },

      collapseAllNodes: () => {
        set({ nodeViewStates: {} })
      },

      addEntity: (name, type, description = '') => {
        const id = generateId()
        const entity: Entity = {
          id,
          name,
          type,
          description,
          color: getEntityColor(type),
        }
        set((state) => ({
          entities: { ...state.entities, [id]: entity },
        }))
        return id
      },

      updateEntity: (id, updates) => {
        set((state) => ({
          entities: { ...state.entities, [id]: { ...state.entities[id], ...updates } },
        }))
      },

      deleteEntity: (id) => {
        set((state) => {
          const { [id]: _, ...remaining } = state.entities
          return {
            entities: remaining,
            mentions: state.mentions.filter((m) => m.entityId !== id),
            selectedEntityId: state.selectedEntityId === id ? null : state.selectedEntityId,
          }
        })
      },

      selectEntity: (id) => {
        set({
          selectedEntityId: id,
          sidebarView: id ? 'entity-detail' : 'entities',
        })
      },

      addMention: (entityId, nodeId, context) => {
        set((state) => ({
          mentions: [...state.mentions, { entityId, nodeId, context }],
        }))
      },

      removeMentionsForNode: (nodeId) => {
        set((state) => ({
          mentions: state.mentions.filter((m) => m.nodeId !== nodeId),
        }))
      },

      syncMentions: (nodeId, newMentions) => {
        set((state) => ({
          mentions: [
            ...state.mentions.filter((m) => m.nodeId !== nodeId),
            ...newMentions,
          ],
        }))
      },

      addImageToNode: (nodeId, image) => {
        set((state) => ({
          nodes: {
            ...state.nodes,
            [nodeId]: {
              ...state.nodes[nodeId],
              images: [...state.nodes[nodeId].images, image],
              updatedAt: Date.now(),
            },
          },
        }))
      },

      removeImageFromNode: (nodeId, imageId) => {
        set((state) => ({
          nodes: {
            ...state.nodes,
            [nodeId]: {
              ...state.nodes[nodeId],
              images: state.nodes[nodeId].images.filter((img) => img.id !== imageId),
              updatedAt: Date.now(),
            },
          },
        }))
      },

      setOrientation: (orientation) => set({ orientation }),
      setProjectName: (name) => set({ projectName: name }),
      setSidebarView: (view) => set({ sidebarView: view }),
    }),
    {
      name: 'timeline-story-editor',
      partialize: (state) => ({
        projectName: state.projectName,
        nodes: state.nodes,
        entities: state.entities,
        mentions: state.mentions,
        nodeOrder: state.nodeOrder,
        orientation: state.orientation,
      }),
    }
  )
)
