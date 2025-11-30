'use client'
import Editor from "@monaco-editor/react"

interface CodeEditorProps {
    value: string
    language: string
    readOnly?: boolean
    onChange?: (value: string | undefined) => void
}

export function CodeEditor({ value, language, readOnly = false, onChange }: CodeEditorProps) {
    return (
        <div className="h-full w-full overflow-hidden rounded-md border bg-zinc-950">
            <Editor
                height="100%"
                defaultLanguage={language}
                value={value}
                theme="vs-dark"
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                }}
                onChange={onChange}
            />
        </div>
    )
}
