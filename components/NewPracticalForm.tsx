'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { CodeEditor } from '@/components/CodeEditor'
import { createPractical } from '@/actions/practical-actions'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface NewPracticalFormProps {
    subjects: any[]
}

export function NewPracticalForm({ subjects }: NewPracticalFormProps) {
    const inferLanguage = (name: string) => {
        const n = name.toLowerCase()
        if (n.includes('python')) return 'python'
        if (n.includes('java')) return 'java'
        if (n.includes('web')) return 'html'
        if (n.includes('c++')) return 'cpp'
        if (n.includes('sql')) return 'sql'
        return 'javascript'
    }

    const router = useRouter()
    const [title, setTitle] = useState('')
    const [subjectId, setSubjectId] = useState(subjects.length > 0 ? subjects[0].id : '')
    const [code, setCode] = useState('')
    const [output, setOutput] = useState('')
    const [language, setLanguage] = useState(subjects.length > 0 ? inferLanguage(subjects[0].name) : 'javascript')
    const [submitting, setSubmitting] = useState(false)

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subId = e.target.value
        setSubjectId(subId)

        const subject = subjects.find(s => s.id === subId)
        if (subject) {
            setLanguage(inferLanguage(subject.name))
        }
    }

    const handleSubmit = async () => {
        if (!title || !subjectId || !code) {
            alert("Please fill in Title, Subject and Code.")
            return
        }

        setSubmitting(true)
        const res = await createPractical({
            title,
            description: "",
            subjectId,
            code_content: code,
            output_content: output,
            language,
            tags: [],
            difficulty: 'EASY',
            userId: 'user-id-placeholder' // Handled by server action connectOrCreate
        })

        setSubmitting(false)
        if (res.success) {
            router.push('/')
        } else {
            alert('Failed to create practical')
        }
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold">New Practical</h1>
                </div>
                <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Create Practical
                </Button>
            </div>

            {/* Form Content */}
            <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
                {/* Top Row: Title and Practical (Subject) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            placeholder="Practical Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Practical</label>
                        <Select value={subjectId} onChange={handleSubjectChange}>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Editor and Output Area - Flex Grow to fill space */}
                <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                    {/* Code Editor */}
                    <div className="flex-1 flex flex-col gap-2 min-h-0">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Code ({language})</label>
                        </div>
                        <div className="flex-1 border rounded-md overflow-hidden relative">
                            <CodeEditor value={code} language={language} onChange={(val) => setCode(val || '')} />
                        </div>
                    </div>

                    {/* Output */}
                    <div className="flex-1 lg:flex-[0.5] flex flex-col gap-2 min-h-0">
                        <label className="text-sm font-medium">Expected Output</label>
                        <div className="flex-1 border rounded-md overflow-hidden bg-black">
                            <textarea
                                className="w-full h-full bg-black text-green-400 font-mono p-4 outline-none resize-none"
                                placeholder="// Output content..."
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
