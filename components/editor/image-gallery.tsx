"use client"

import * as React from "react"
import { useStoryStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Trash2, Upload } from "lucide-react"

export function ImageGallery({ nodeId }: { nodeId: string }) {
    const { nodes, removeImageFromNode, addImageToNode } = useStoryStore()
    const node = nodes[nodeId]
    const inputRef = React.useRef<HTMLInputElement>(null)

    if (!node) return null

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const result = event.target?.result as string
            if (result) {
                addImageToNode(nodeId, {
                    id: Math.random().toString(36).slice(2, 9),
                    url: result,
                    caption: file.name
                })
            }
        }
        reader.readAsDataURL(file)
        // reset input
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-semibold text-lg opacity-80">Gallery</h3>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs rounded-lg border-foreground/20 hover:bg-foreground/5"
                    onClick={() => inputRef.current?.click()}
                >
                    <Upload className="w-3 h-3 mr-1" /> Add
                </Button>
                <input type="file" accept="image/*" className="hidden" ref={inputRef} onChange={handleFileChange} />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-2 gap-2 content-start pr-1">
                {node.images.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-foreground/10 bg-foreground/5">
                        <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 backdrop-blur-sm">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => removeImageFromNode(nodeId, img.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Caption */}
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-[10px] text-white truncate font-medium drop-shadow-md">{img.caption}</p>
                        </div>
                    </div>
                ))}

                {node.images.length === 0 && (
                    <div className="col-span-2 py-10 flex flex-col items-center justify-center text-center opacity-50 border border-dashed border-foreground/20 rounded-xl">
                        <span className="text-sm font-sans italic">No images attached.</span>
                    </div>
                )}
            </div>
        </div>
    )
}
