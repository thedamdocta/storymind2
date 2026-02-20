"use client"

import * as React from "react"
import { useStoryStore } from "@/lib/store"
import { GlassPanel } from "@/components/ui/glass-panel"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Edit2, Plus, Users, MapPin, Calendar, BookOpen, Route, Search } from "lucide-react"
import { EntityPage } from "./entity-page"

export function AppSidebar() {
    const { entities, sidebarView, selectEntity, addEntity } = useStoryStore()

    const [activeTab, setActiveTab] = React.useState<string | null>(null)
    const [isAdding, setIsAdding] = React.useState(false)
    const [newEntityName, setNewEntityName] = React.useState("")

    const handleAdd = (type: any) => {
        if (newEntityName.trim()) {
            addEntity(newEntityName, type)
            setNewEntityName("")
            setIsAdding(false)
        }
    }

    // Filter entities by type
    const getEntitiesByType = (type: string) => Object.values(entities).filter(e => e.type === type)

    const CategorySection = ({ title, type, icon: Icon, colorClass }: any) => {
        const items = getEntitiesByType(type)
        const isExpanded = activeTab === type

        return (
            <SidebarMenuItem className="flex flex-col">
                <SidebarMenuButton
                    onClick={() => setActiveTab(isExpanded ? null : type)}
                    className="rounded-xl transition-all duration-200 hover:bg-white/50 dark:hover:bg-white/5 w-full flex items-center"
                >
                    <Icon className={`w-4 h-4 drop-shadow-sm ${colorClass}`} />
                    <span className="font-medium text-sm flex-1">{title}</span>
                    <span className="text-xs font-medium text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full">{items.length}</span>
                </SidebarMenuButton>

                {isExpanded && (
                    <div className="ml-6 pl-2 border-l border-foreground/10 my-1 flex flex-col gap-1 py-1">
                        {items.map(entity => (
                            <button
                                key={entity.id}
                                onClick={() => selectEntity(entity.id)}
                                className="text-sm font-sans text-left py-1.5 px-2 rounded-lg hover:bg-foreground/5 truncate transition-colors flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                                {entity.name}
                            </button>
                        ))}

                        {isAdding ? (
                            <div className="flex items-center gap-1 mt-1 pr-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newEntityName}
                                    onChange={e => setNewEntityName(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleAdd(type)
                                        if (e.key === 'Escape') setIsAdding(false)
                                    }}
                                    onBlur={() => handleAdd(type)}
                                    className="bg-foreground/5 rounded px-2 w-full text-sm py-1 outline-none focus:ring-1 focus:ring-foreground/20"
                                    placeholder="Name..."
                                />
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="text-xs flex items-center gap-1 py-1.5 px-2 opacity-50 hover:opacity-100 transition-opacity w-fit"
                            >
                                <Plus className="w-3 h-3" /> Add {title.slice(0, -1)}
                            </button>
                        )}
                    </div>
                )}
            </SidebarMenuItem>
        )
    }

    return (
        <Sidebar className="border-r-0 bg-transparent p-4 shrink-0 transition-all duration-300">
            <GlassPanel intensity="strong" className="h-[calc(100vh-2rem)] w-full flex flex-col overflow-hidden">

                {sidebarView === 'entity-detail' ? (
                    <div className="p-6 h-full w-full custom-scrollbar overflow-y-auto">
                        <EntityPage />
                    </div>
                ) : (
                    <>
                        <SidebarHeader className="p-5 border-b border-foreground/5 dark:border-white/10">
                            <h2 className="text-2xl font-heading font-bold text-foreground/90 tracking-tight">Timeline</h2>
                            <p className="text-xs text-foreground/50 font-sans mt-0.5">Entities Directory</p>

                            <div className="relative mt-4">
                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
                                <input
                                    type="text"
                                    placeholder="Search entities..."
                                    className="w-full bg-background/50 border border-foreground/10 rounded-full pl-8 pr-3 py-1.5 text-sm outline-none focus:border-foreground/30 transition-colors"
                                />
                            </div>
                        </SidebarHeader>

                        <SidebarContent className="p-3 custom-scrollbar overflow-y-auto">
                            <SidebarGroup>
                                <SidebarGroupLabel className="text-xs font-semibold text-foreground/40 uppercase tracking-wider px-2 mb-2">Categories</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu className="space-y-1">
                                        <CategorySection title="Characters" type="character" icon={Users} colorClass="text-[#8B5CF6]" />
                                        <CategorySection title="Places" type="place" icon={MapPin} colorClass="text-[#10B981]" />
                                        <CategorySection title="Events" type="event" icon={Calendar} colorClass="text-[#F59E0B]" />
                                        <CategorySection title="Storylines" type="storyline" icon={Route} colorClass="text-[#3B82F6]" />
                                        <CategorySection title="Time Periods" type="time-period" icon={BookOpen} colorClass="text-[#EC4899]" />
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </>
                )}
            </GlassPanel>
        </Sidebar>
    )
}
