"use client"

import * as React from "react"
import { useEditor, EditorContent, JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Mention from "@tiptap/extension-mention"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import { suggestion } from "./mention-suggestion"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote } from "lucide-react"

interface TiptapEditorProps {
    content: JSONContent | null
    onChange: (content: JSONContent, text: string) => void
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-foreground/10 bg-foreground/5 rounded-t-xl mb-2 backdrop-blur-sm">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`h-8 w-8 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-foreground/20' : ''}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`h-8 w-8 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-foreground/20' : ''}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-foreground/10 mx-1" />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`h-8 w-8 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-foreground/20' : ''}`}
                title="Heading 1"
            >
                <Heading1 className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`h-8 w-8 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-foreground/20' : ''}`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-foreground/10 mx-1" />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`h-8 w-8 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-foreground/20' : ''}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`h-8 w-8 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-foreground/20' : ''}`}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-foreground/10 mx-1" />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`h-8 w-8 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-foreground/20' : ''}`}
                title="Blockquote"
            >
                <Quote className="w-4 h-4" />
            </Button>
        </div>
    )
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Write your story beat here... Type '@' to mention an entity.",
            }),
            Image,
            Mention.configure({
                HTMLAttributes: {
                    class: 'mention',
                },
                suggestion,
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON(), editor.getText())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm font-sans font-light sm:prose-base dark:prose-invert focus:outline-none max-w-none w-full min-h-[50vh] p-4',
            },
        },
    })

    return (
        <div className="flex flex-col h-full w-full tiptap-editor custom-scrollbar bg-background/30 rounded-xl relative z-10">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="flex-1 overflow-y-auto px-4 pb-8 h-full" />
        </div>
    )
}
