'use server'

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com'
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY

const LANGUAGE_MAPPING: Record<string, number> = {
    'python': 71, // Python (3.8.1)
    'javascript': 63, // JavaScript (Node.js 12.14.0)
    'java': 62, // Java (OpenJDK 13.0.1)
    'cpp': 54, // C++ (GCC 9.2.0)
    'c': 50, // C (GCC 9.2.0)
    'html': 63, // Treat HTML as JS for now (or handle differently) - usually not executable in Judge0
    'sql': 82, // SQL (SQLite 3.27.2)
}

export async function executeCode(source_code: string, language: string) {
    if (!JUDGE0_API_KEY) {
        return { success: false, error: 'Judge0 API key not configured' }
    }

    const language_id = LANGUAGE_MAPPING[language.toLowerCase()]
    if (!language_id) {
        return { success: false, error: `Unsupported language: ${language}` }
    }

    try {
        // 1. Create Submission
        const createRes = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&fields=*`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': JUDGE0_API_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify({
                source_code,
                language_id,
            })
        })

        if (!createRes.ok) {
            const err = await createRes.text()
            console.error('Judge0 Create Error:', err)
            return { success: false, error: 'Failed to create submission' }
        }

        const { token } = await createRes.json()

        // 2. Poll for Status
        let attempts = 0
        while (attempts < 10) {
            await new Promise(r => setTimeout(r, 1000)) // Wait 1s

            const getRes = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false&fields=*`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': JUDGE0_API_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            })

            if (!getRes.ok) {
                console.error('Judge0 Get Error:', await getRes.text())
                return { success: false, error: 'Failed to get submission status' }
            }

            const result = await getRes.json()

            // Status ID 1 (In Queue) or 2 (Processing)
            if (result.status.id <= 2) {
                attempts++
                continue
            }

            // Finished
            const output = result.stdout || result.stderr || result.compile_output || result.message || 'No output'
            return { success: true, output }
        }

        return { success: false, error: 'Execution timed out' }

    } catch (error) {
        console.error('Execution error:', error)
        return { success: false, error: 'Internal server error during execution' }
    }
}
