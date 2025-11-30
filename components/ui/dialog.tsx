import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
}

export function Dialog({ isOpen, onClose, children, title }: DialogProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={onClose}></div>
            <div className="z-50 grid w-full max-w-lg gap-4 border bg-card p-6 shadow-lg duration-200 sm:rounded-lg animate-in fade-in zoom-in-95">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left relative">
                    {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
                    <button
                        className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}
