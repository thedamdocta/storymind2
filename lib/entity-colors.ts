import type { EntityType } from './types'

export const ENTITY_CONFIG: Record<EntityType, { color: string; label: string; icon: string }> = {
  character: { color: '#8B5CF6', label: 'Characters', icon: 'user' },
  event: { color: '#F59E0B', label: 'Events', icon: 'zap' },
  place: { color: '#10B981', label: 'Places', icon: 'map-pin' },
  'time-period': { color: '#EC4899', label: 'Time Periods', icon: 'clock' },
  storyline: { color: '#3B82F6', label: 'Storylines', icon: 'git-branch' },
}

export const NODE_COLORS = [
  '#8B5CF6',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#6366F1',
  '#14B8A6',
  '#F97316',
]

export function getEntityColor(type: EntityType): string {
  return ENTITY_CONFIG[type].color
}

export function getEntityLabel(type: EntityType): string {
  return ENTITY_CONFIG[type].label
}

export function getNextNodeColor(index: number): string {
  return NODE_COLORS[index % NODE_COLORS.length]
}
