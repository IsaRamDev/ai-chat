/**
 * POST /api/chat
 *
 * Streams an AI response using the Groq API (OpenAI-compatible format).
 * The API key lives only on the server — never exposed to the browser.
 */
export async function POST(req) {
  const { messages, model = 'openai/gpt-oss-120b', systemPrompt } = await req.json()

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY is not set. Add it to your .env.local file.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'messages array is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const groqMessages = [
    {
      role: 'system',
      content: systemPrompt || 'You are a helpful, concise AI assistant. Format responses with markdown when it improves readability.',
    },
    ...messages.map(({ role, content }) => ({ role, content })),
  ]

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: groqMessages,
      stream: true,
      max_tokens: 2048,
    }),
  })

  if (!groqRes.ok) {
    const err = await groqRes.json().catch(() => ({}))
    return new Response(
      JSON.stringify({ error: err?.error?.message ?? `Groq API error ${groqRes.status}` }),
      { status: groqRes.status, headers: { 'Content-Type': 'application/json' } }
    )
  }

  /**
   * Groq uses OpenAI's SSE format:
   *   data: {"choices":[{"delta":{"content":"Hello"},"finish_reason":null}]}
   *   data: [DONE]
   *
   * We extract choices[0].delta.content and forward it as plain text.
   */
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const readable = new ReadableStream({
    async start(controller) {
      const reader = groqRes.body.getReader()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue

            try {
              const event = JSON.parse(data)
              const text = event.choices?.[0]?.delta?.content
              if (text) {
                controller.enqueue(encoder.encode(text))
              }
            } catch {
              // Malformed event — skip
            }
          }
        }
      } finally {
        reader.releaseLock()
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  })
}