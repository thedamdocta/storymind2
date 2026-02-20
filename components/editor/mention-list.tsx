"use client"

import * as React from "react"
import { Entity } from "@/lib/types"

interface MentionListProps {
    items: Entity[]
    command: (item: { id: string; label: string }) => void
}

export const MentionList = React.forwardRef((props: MentionListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    const selectItem = (index: number) => {
        const item = props.items[index]
        if (item) {
            props.command({ id: item.id, label: item.name })
        }
    }

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    React.useEffect(() => setSelectedIndex(0), [props.items])

    React.useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                upHandler()
                return true
            }
            if (event.key === 'ArrowDown') {
                downHandler()
                return true
            }
            if (event.key === 'Enter') {
                enterHandler()
                return true
            }
            return false
        },
    }))

    if (!props.items.length) {
        return <div className="glass-strong rounded-xl p-2 text-sm text-foreground/50 shadow-xl border">No entities found.</div>
    }

    return (
        <div className="glass-strong rounded-xl shadow-xl overflow-hidden flex flex-col py-1 border min-w-[200px]">
            {props.items.map((item, index) => (
                <button
                    key={item.id}
                    className={`flex items-center gap-2 px-3 py-2 text-sm text-left ${index === selectedIndex ? 'bg-foreground/10' : 'bg-transparent'
                        }`}
                    onClick={() => selectItem(index)}
                >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                    <span className="text-[10px] ml-auto uppercase tracking-wider opacity-40">{item.type}</span>
                </button>
            ))}
        </div>
    )
})

MentionList.displayName = 'MentionList'
