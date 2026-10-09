'use client'
import { useState, useCallback, useRef } from 'react'
import { generateId, createConversation } from '@/lib/utils'

/**
 * useChat — core state management hook for the entire chat app.
 *
 * Manages:
 *  - Multiple conversations (sidebar history)
 *  - Streaming AI responses via fetch + ReadableStream
 *  - Abort control (stop generation mid-stream)
 *  - Model selection
 *
 * Architecture note:
 *  The hook owns all state so the UI components are stateless and reusable.
 *  Streaming is handled by reading a ReadableStream from our Next.js API route,
 *  which in turn streams from Anthropic. This keeps the API key server-side only.
 */
export function useChat() {
  const [conversations, setConversations] = useState([createConversation()])
  const [activeId, setActiveId]           = useState(() => conversations[0].id)
  const [streaming, setStreaming]         = useState(false)
  const [model, setModel]                 = useState('openai/gpt-oss-120b')
  const abortRef                          = useRef(null)

  const activeConversation = conversations.find((c) => c.id === activeId) ?? conversations[0]

  /** Append or update a message in a specific conversation. */
  const upsertMessage = useCallback((convId, message) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const exists = c.messages.find((m) => m.id === message.id)
        return {
          ...c,
          messages: exists
            ? c.messages.map((m) => (m.id === message.id ? { ...m, ...message } : m))
            : [...c.messages, message],
          updatedAt: Date.now(),
        }
      })
    )
  }, [])

  /** Send a user message and stream the AI response. */
  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || streaming) return

    const convId = activeId

    // 1. Append the user message immediately
    const userMsg = { id: generateId(), role: 'user', content: content.trim(), createdAt: Date.now() }
    upsertMessage(convId, userMsg)

    // 2. Create a placeholder for the assistant response
    const assistantMsg = { id: generateId(), role: 'assistant', content: '', createdAt: Date.now(), streaming: true }
    upsertMessage(convId, assistantMsg)

    // 3. Update conversation title from first message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId || c.title !== 'New conversation') return c
        return { ...c, title: content.slice(0, 48) + (content.length > 48 ? '…' : '') }
      })
    )

    setStreaming(true)
    const abort = new AbortController()
    abortRef.current = abort

    try {
      // Get current messages for context (exclude the just-added placeholder)
      const history = activeConversation.messages
        .filter((m) => !m.streaming)
        .concat(userMsg)
        .map(({ role, content }) => ({ role, content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, model }),
        signal: abort.signal,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `Server error ${res.status}`)
      }

      // 4. Read the stream and update the assistant message incrementally
      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        // Update the message on every chunk so the UI re-renders live
        upsertMessage(convId, { ...assistantMsg, content: accumulated, streaming: true })
      }

      // 5. Mark streaming complete
      upsertMessage(convId, { ...assistantMsg, content: accumulated, streaming: false })

    } catch (err) {
      if (err.name === 'AbortError') {
        // User stopped generation — mark current content as final
        upsertMessage(convId, { ...assistantMsg, streaming: false })
      } else {
        upsertMessage(convId, {
          ...assistantMsg,
          content: `**Error:** ${err.message}`,
          streaming: false,
          error: true,
        })
      }
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }, [activeId, activeConversation, streaming, model, upsertMessage])

  /** Stop streaming mid-generation. */
  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  /** Create a new conversation and switch to it. */
  const newConversation = useCallback(() => {
    const conv = createConversation()
    setConversations((prev) => [conv, ...prev])
    setActiveId(conv.id)
  }, [])

  /** Delete a conversation. Falls back to a new one if the active one is deleted. */
  const deleteConversation = useCallback((id) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (next.length === 0) {
        const fresh = createConversation()
        setActiveId(fresh.id)
        return [fresh]
      }
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }, [activeId])

  /** Clear all messages in the active conversation. */
  const clearConversation = useCallback(() => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [], title: 'New conversation', updatedAt: Date.now() }
          : c
      )
    )
  }, [activeId])

  return {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    streaming,
    model,
    setModel,
    sendMessage,
    stopStreaming,
    newConversation,
    deleteConversation,
    clearConversation,
  }
}
