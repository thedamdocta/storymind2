"use client"

import * as React from "react"
import { useStoryStore } from "@/lib/store"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

export function TimelineAddButton({ orientation, position }: { orientation: 'horizontal' | 'vertical', position: number }) {
    const { addNode } = useStoryStore()
    const isEven = position % 2 === 0
    const [isHovered, setIsHovered] = React.useState(false)

    // Stem logic
    const stemLengthNum = 60
    const stemScale = isHovered ? (stemLengthNum - 3) / stemLengthNum : 1

    return (
        <motion.div layout className={`relative flex items-center justify-center shrink-0 ${orientation === 'vertical' ? 'h-10 w-0' : 'w-10 h-0'}`}>

            {/* Stem connector */}
            <motion.div
                className="absolute bg-foreground/20 z-0 backdrop-blur-sm"
                initial={false}
                animate={{
                    ...(orientation === 'horizontal' ? { scaleY: stemScale } : { scaleX: stemScale })
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                    ...(orientation === 'horizontal' ? {
                        width: '4px',
                        height: '60px',
                        top: isEven ? '4px' : 'auto',
                        bottom: !isEven ? '4px' : 'auto',
                        left: '50%',
                        marginLeft: '-2px',
                        transformOrigin: isEven ? 'top center' : 'bottom center',
                        borderRadius: '4px'
                    } : {
                        height: '4px',
                        width: '60px',
                        left: isEven ? '4px' : 'auto',
                        right: !isEven ? '4px' : 'auto',
                        top: '50%',
                        marginTop: '-2px',
                        transformOrigin: isEven ? 'center left' : 'center right',
                        borderRadius: '4px'
                    })
                }}
            />

            <motion.button
                layout
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => addNode("")}
                className="absolute w-10 h-10 z-10 rounded-full border-[1.5px] border-dashed border-foreground/30 text-foreground/50 hover:text-foreground hover:border-foreground/60 flex items-center justify-center bg-background/50 backdrop-blur-md transition-colors"
                title="Add new story beat"
                style={{
                    ...(orientation === 'horizontal' ? {
                        top: isEven ? '64px' : 'auto',
                        bottom: !isEven ? '64px' : 'auto',
                    } : {
                        left: isEven ? '64px' : 'auto',
                        right: !isEven ? '64px' : 'auto',
                    })
                }}
            >
                <Plus className="w-5 h-5" />
            </motion.button>
        </motion.div>
    )
}
