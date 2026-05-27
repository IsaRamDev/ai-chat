'use client'
import { useEffect, useRef } from 'react'
import Message from './Message'

const SUGGESTIONS = [
  'Explain how React Server Components work',
  'Write a TypeScript utility type for deep partial',
  'What\'s the difference between useMemo and useCallback?',
  'Help me review my component architecture',
]

/**
 * Scrollable message list.
 * Auto-scrolls to the bottom whenever messages change or streaming updates.
 * Shows suggestion prompts when the conversation is empty.
 */
export default function MessageList({ messages, streaming, onSuggestion }) {
  const bottomRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-12">
        {/* Empty state header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9d8eff" strokeWidth="1.5">
              <path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary">How can I help?</h2>
          <p className="text-sm text-text-muted max-w-xs">
            Ask me anything — I can help with code, writing, analysis, and more.
          </p>
        </div>

        {/* Suggestion chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestion(s)}
              className="text-left text-xs text-text-secondary bg-surface-2 border border-border hover:border-border-light hover:bg-surface-3 hover:text-text-primary rounded-xl px-4 py-3 transition-all duration-150"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-5"
    >
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
