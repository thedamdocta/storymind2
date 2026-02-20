import type { ScriptFormat, StoryNode } from './types'

function centerText(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2))
  return ' '.repeat(padding) + text
}

function wrapText(text: string, maxWidth: number, indent: number = 0): string {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  const prefix = ' '.repeat(indent)

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxWidth) {
      lines.push(prefix + currentLine.trim())
      currentLine = word
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word
    }
  }
  if (currentLine.trim()) {
    lines.push(prefix + currentLine.trim())
  }
  return lines.join('\n')
}

export function formatScreenplay(nodes: StoryNode[]): string {
  const PAGE_WIDTH = 60
  const lines: string[] = []

  for (const node of nodes) {
    // Scene heading
    lines.push('')
    lines.push(`INT. ${node.title.toUpperCase()} - DAY`)
    lines.push('')

    // Parse content into action and dialogue blocks
    const paragraphs = node.plainText.split('\n').filter(Boolean)

    for (const para of paragraphs) {
      // Check if it looks like dialogue (NAME: text pattern)
      const dialogueMatch = para.match(/^([A-Z][A-Za-z\s]+):\s*(.+)/)
      if (dialogueMatch) {
        const [, name, dialogue] = dialogueMatch
        lines.push(centerText(name.toUpperCase(), PAGE_WIDTH))
        lines.push(wrapText(dialogue, 35, 15))
        lines.push('')
      } else {
        // Action block
        lines.push(wrapText(para, PAGE_WIDTH))
        lines.push('')
      }
    }
  }

  return lines.join('\n')
}

export function formatStagePlay(nodes: StoryNode[]): string {
  const lines: string[] = []

  for (const node of nodes) {
    lines.push('')
    lines.push(`--- ACT: ${node.title.toUpperCase()} ---`)
    lines.push('')

    const paragraphs = node.plainText.split('\n').filter(Boolean)

    for (const para of paragraphs) {
      const dialogueMatch = para.match(/^([A-Z][A-Za-z\s]+):\s*(.+)/)
      if (dialogueMatch) {
        const [, name, dialogue] = dialogueMatch
        lines.push(`${name.toUpperCase()}.`)
        lines.push(`    ${dialogue}`)
        lines.push('')
      } else {
        // Stage direction
        lines.push(`[${para}]`)
        lines.push('')
      }
    }
  }

  return lines.join('\n')
}

export function formatNovel(nodes: StoryNode[]): string {
  const lines: string[] = []

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]

    if (i > 0) {
      lines.push('')
      lines.push('* * *')
      lines.push('')
    }

    lines.push(`Chapter ${i + 1}: ${node.title}`)
    lines.push('')

    const paragraphs = node.plainText.split('\n').filter(Boolean)
    for (const para of paragraphs) {
      lines.push(`    ${para}`)
      lines.push('')
    }
  }

  return lines.join('\n')
}

export function formatSynopsis(nodes: StoryNode[]): string {
  const lines: string[] = []

  lines.push('SYNOPSIS')
  lines.push('========')
  lines.push('')

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const firstSentence = node.plainText.split(/[.!?]/)[0]?.trim() || 'No content yet.'
    lines.push(`${i + 1}. ${node.title}`)
    lines.push(`   ${firstSentence}.`)
    lines.push('')
  }

  return lines.join('\n')
}

export function formatScript(nodes: StoryNode[], format: ScriptFormat): string {
  switch (format) {
    case 'screenplay':
      return formatScreenplay(nodes)
    case 'stageplay':
      return formatStagePlay(nodes)
    case 'novel':
      return formatNovel(nodes)
    case 'synopsis':
      return formatSynopsis(nodes)
  }
}
