'use client'

import { useState } from "react"
import { CodeEditor } from "@/components/CodeEditor"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { updatePractical, deletePractical } from "@/actions/practical-actions"
import { executeCode } from "@/actions/execute-code"
import { ArrowLeft, Download, Share2, Save, Edit2, Trash2, Play, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

export function PracticalDetail({ practical }: { practical: any }) {
    const router = useRouter()
    const [title, setTitle] = useState(practical.title)
    const [code, setCode] = useState(practical.code_content)
    const [output, setOutput] = useState(practical.output_content || "")
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showLive, setShowLive] = useState(false)
    const [isRunning, setIsRunning] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        await updatePractical(practical.id, {
            title: title,
            code_content: code,
            output_content: output,
        })
        setIsSaving(false)
        setIsEditing(false)
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this practical?")) return
        setIsDeleting(true)
        const res = await deletePractical(practical.id)
        if (res.success) {
            router.push('/')
        } else {
            alert("Failed to delete practical")
            setIsDeleting(false)
        }
    }

    const handleRun = async () => {
        if (!code) return
        setIsRunning(true)
        setOutput("Running...")

        const res = await executeCode(code, practical.language)

        if (res.success) {
            setOutput(res.output)
        } else {
            setOutput(`Error: ${res.error}`)
        }
        setIsRunning(false)
    }

    const handleDownloadPDF = async () => {
        const element = document.getElementById('pdf-content')
        if (!element) return

        try {
            const canvas = await html2canvas(element)
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'landscape',
            })
            const imgProps = pdf.getImageProperties(imgData)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`${practical.title}.pdf`)
        } catch (e) {
            console.error("PDF generation failed", e)
            alert("PDF generation failed. Monaco Editor canvas might be blocking it.")
        }
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="h-8 w-[300px] font-bold text-lg"
                                />
                            ) : (
                                <h1 className="text-xl font-bold flex items-center gap-2">
                                    {title}
                                    <Badge style={{ backgroundColor: practical.subject.color }} className="text-white">{practical.subject.name}</Badge>
                                </h1>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleRun} disabled={isRunning}>
                                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                                Run
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </Button>
                        </>
                    )}
                    <Button variant="outline" onClick={handleDownloadPDF}>
                        <Download className="mr-2 h-4 w-4" /> PDF
                    </Button>
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                </div>
            </div>

            {/* Main Content - Split Pane */}
            <div className="flex-1 overflow-hidden" id="pdf-content">
                <PanelGroup direction="horizontal" className="h-full">
                    <Panel defaultSize={50} minSize={30}>
                        <div className="h-full flex flex-col border-r border-border">
                            <div className="flex-1 overflow-hidden">
                                <CodeEditor
                                    value={code}
                                    language={practical.language}
                                    readOnly={!isEditing}
                                    onChange={(val) => setCode(val || "")}
                                />
                            </div>
                        </div>
                    </Panel>
                    <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors cursor-col-resize" />
                    <Panel defaultSize={50} minSize={30}>
                        <div className="h-full flex flex-col bg-black text-green-400 font-mono">
                            <div className="p-2 border-b border-green-900 flex justify-between items-center bg-zinc-900">
                                <span>OUTPUT</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Live Run</span>
                                    <div
                                        className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${showLive ? 'bg-green-600' : 'bg-zinc-600'}`}
                                        onClick={() => setShowLive(!showLive)}
                                    >
                                        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${showLive ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 p-4 overflow-auto whitespace-pre-wrap font-mono text-sm">
                                {isEditing ? (
                                    <textarea
                                        className="w-full h-full bg-transparent outline-none resize-none text-green-400 placeholder:text-green-900"
                                        value={output}
                                        onChange={(e) => setOutput(e.target.value)}
                                        placeholder="// Output content goes here..."
                                    />
                                ) : (
                                    output
                                )}
                            </div>
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    )
}
