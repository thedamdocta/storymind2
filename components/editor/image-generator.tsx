"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Wand2, Image as ImageIcon, Loader2 } from "lucide-react"

export function ImageGenerator() {
    const [prompt, setPrompt] = React.useState("")
    const [generating, setGenerating] = React.useState(false)

    return (
        <div className="flex flex-col h-full space-y-4">
            <h3 className="font-heading font-semibold text-lg opacity-80 mb-2">AI Concept Art</h3>

            <div className="flex flex-col gap-3">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the scene or character..."
                    className="w-full bg-foreground/5 rounded-xl border border-foreground/10 p-3 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-violet-500/30 resize-none custom-scrollbar"
                />

                <Button
                    disabled={!prompt || generating}
                    onClick={() => {
                        setGenerating(true)
                        setTimeout(() => setGenerating(false), 2000)
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-md border-0 disabled:opacity-50"
                >
                    {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                    {generating ? "Generating..." : "Generate Concept"}
                </Button>
            </div>

            <div className="flex-1 mt-4 relative group rounded-xl border border-foreground/10 bg-background/50 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                <ImageIcon className="w-10 h-10 opacity-20 mb-3" />
                <p className="text-sm font-sans italic opacity-50 mb-2">
                    Connect fal.ai or local Stable Diffusion
                </p>
                <p className="text-xs font-sans opacity-40 max-w-[200px]">
                    Generated images automatically append to this beat's gallery.
                </p>
            </div>
        </div>
    )
}
