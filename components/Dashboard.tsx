'use client'

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PracticalCard } from "@/components/PracticalCard"
import { Plus, Search, Trash2 } from "lucide-react"
import { getPracticals, deletePracticals } from "@/actions/practical-actions"
import Link from "next/link"
import { UserButton, useUser } from "@stackframe/stack"

export function Dashboard({ initialPracticals, subjects }: { initialPracticals: any[], subjects: any[] }) {
    const [practicals, setPracticals] = useState(initialPracticals)
    const [search, setSearch] = useState("")
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
    const [selectedPracticals, setSelectedPracticals] = useState<string[]>([])
    const [isDeleting, setIsDeleting] = useState(false)
    const user = useUser()

    useEffect(() => {
        const timer = setTimeout(async () => {
            const res = await getPracticals(search, selectedSubject || undefined)
            if (res.success && res.data) {
                setPracticals(res.data)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [search, selectedSubject])

    const handleSelect = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedPracticals(prev => [...prev, id])
        } else {
            setSelectedPracticals(prev => prev.filter(pId => pId !== id))
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedPracticals.length} practicals?`)) return

        setIsDeleting(true)
        const res = await deletePracticals(selectedPracticals)
        setIsDeleting(false)

        if (res.success) {
            setPracticals(prev => prev.filter(p => !selectedPracticals.includes(p.id)))
            setSelectedPracticals([])
        } else {
            alert("Failed to delete practicals")
        }
    }

    return (
        <main className="flex flex-col h-full p-6 space-y-6 overflow-hidden">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <div className="flex gap-2 items-center">
                        {user ? (
                            <UserButton />
                        ) : (
                            <Link href="/handler/sign-in">
                                <Button variant="outline">Sign In</Button>
                            </Link>
                        )}
                        {selectedPracticals.length > 0 && (
                            <Button variant="destructive" onClick={handleBulkDelete} disabled={isDeleting}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedPracticals.length})
                            </Button>
                        )}
                        <Link href="/practicals/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Practical
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search practicals..."
                        className="pl-9 h-12 text-lg bg-card/50 backdrop-blur-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Badge
                        variant={selectedSubject === null ? "default" : "outline"}
                        className="cursor-pointer text-sm py-1 px-3"
                        onClick={() => setSelectedSubject(null)}
                    >
                        All
                    </Badge>
                    {subjects.map((sub) => (
                        <Badge
                            key={sub.id}
                            variant={selectedSubject === sub.id ? "default" : "outline"}
                            style={selectedSubject === sub.id ? { backgroundColor: sub.color } : { borderColor: sub.color, color: sub.color }}
                            className="cursor-pointer text-sm py-1 px-3"
                            onClick={() => setSelectedSubject(sub.id === selectedSubject ? null : sub.id)}
                        >
                            {sub.name}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                    {practicals.map((practical) => (
                        <PracticalCard
                            key={practical.id}
                            practical={practical}
                            isSelected={selectedPracticals.includes(practical.id)}
                            onSelect={(checked) => handleSelect(practical.id, checked)}
                        />
                    ))}
                    {practicals.length === 0 && (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            No practicals found.
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
