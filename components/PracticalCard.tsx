'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Calendar } from "lucide-react"
import Link from "next/link"

interface PracticalCardProps {
    practical: any
    isSelected?: boolean
    onSelect?: (checked: boolean) => void
}

export function PracticalCard({ practical, isSelected, onSelect }: PracticalCardProps) {
    return (
        <div className="relative group h-full">
            {onSelect && (
                <div className="absolute top-2 right-2 z-10">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelect(checked as boolean)}
                        className="bg-background/80 backdrop-blur-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                </div>
            )}
            <Link href={`/practicals/${practical.id}`} className="block h-full">
                <Card className={`hover:border-primary/50 transition-colors cursor-pointer h-full flex flex-col bg-card/50 backdrop-blur-sm ${isSelected ? 'border-primary ring-1 ring-primary' : ''}`}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <Badge style={{ backgroundColor: practical.subject.color }} className="text-white hover:opacity-90">
                                {practical.subject.name}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                                e.preventDefault()
                                navigator.clipboard.writeText(practical.code_content)
                            }}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <CardTitle className="mt-2 line-clamp-1 text-lg">{practical.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {practical.description}
                        </p>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground flex items-center gap-2 border-t pt-4 mt-auto">
                        <Calendar className="h-3 w-3" />
                        {new Date(practical.createdAt).toLocaleDateString()}
                    </CardFooter>
                </Card>
            </Link>
        </div>
    )
}
