"use client"

import * as React from "react"
import { useStoryStore } from "@/lib/store"
import { formatScript } from "@/lib/script-formatter"
import { Button } from "@/components/ui/button"
import { FileText, Download, Copy, CheckCircle2 } from "lucide-react"

export function ScriptFormatterPanel() {
    const { nodes, nodeOrder } = useStoryStore()
    const [format, setFormat] = React.useState<'screenplay' | 'stageplay' | 'novel' | 'synopsis'>('screenplay')
    const [output, setOutput] = React.useState("")
    const [copied, setCopied] = React.useState(false)

    const handleFormat = () => {
        // Collect all nodes in order
        const orderedNodes = nodeOrder.map(id => nodes[id]).filter(Boolean)
        const result = formatScript(orderedNodes, format)
        setOutput(result)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const blob = new Blob([output], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `story-${format}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="flex flex-col h-full space-y-4">
            <h3 className="font-heading font-semibold text-lg opacity-80 mb-2">Script Formatter</h3>

            <div className="grid grid-cols-2 gap-2">
                {['screenplay', 'stageplay', 'novel', 'synopsis'].map(f => (
                    <Button
                        key={f}
                        variant="outline"
                        size="sm"
                        onClick={() => setFormat(f as any)}
                        className={`capitalize rounded-xl ${format === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-foreground/10 hover:bg-foreground/5'}`}
                    >
                        {f}
                    </Button>
                ))}
            </div>

            <Button onClick={handleFormat} className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-md">
                <FileText className="w-4 h-4 mr-2" />
                Generate Full Export
            </Button>

            <div className="flex-1 min-h-[200px] mt-4 relative group rounded-xl border border-foreground/10 bg-background/50 overflow-hidden flex flex-col">
                {output ? (
                    <>
                        <div className="flex items-center justify-end gap-1 p-1 bg-foreground/5 border-b border-foreground/10 absolute top-0 right-0 left-0">
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={handleCopy} title="Copy to clipboard">
                                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={handleDownload} title="Download .txt">
                                <Download className="w-3.5 h-3.5 opacity-70" />
                            </Button>
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            className="w-full h-full p-4 pt-10 text-xs font-mono bg-transparent outline-none resize-none custom-scrollbar"
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-6 text-center text-sm font-sans italic opacity-50">
                        Select a format and click generate to convert all your story timeline beats into a single formatted document.
                    </div>
                )}
            </div>
        </div>
    )
}
