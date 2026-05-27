'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { MODELS } from '@/lib/utils'

/**
 * Chat input bar.
 * - Enter to send (Shift+Enter for newline)
 * - Auto-grows with content up to 5 lines
 * - Shows Stop button while streaming
 * - Disabled while streaming (except Stop)
 */
export default function ChatInput({ onSend, onStop, streaming, model }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)
  const modelLabel  = MODELS.find((m) => m.id === model)?.label ?? model

  // Auto-resize the textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }, [value])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!streaming && value.trim()) {
        onSend(value)
        setValue('')
      }
    }
  }, [value, streaming, onSend])

  const handleSubmit = useCallback(() => {
    if (!streaming && value.trim()) {
      onSend(value)
      setValue('')
    }
  }, [value, streaming, onSend])

  return (
    <div className="border-t border-border bg-surface-1 px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <div className={`flex items-end gap-3 bg-surface-2 border rounded-2xl px-4 py-3 transition-colors ${
          streaming ? 'border-border' : 'border-border focus-within:border-accent/50'
        }`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Lumos… (Enter to send, Shift+Enter for newline)"
            disabled={streaming}
            rows={1}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none min-h-[24px] max-h-[140px] leading-6 disabled:opacity-60"
          />

          {streaming ? (
            <button
              onClick={onStop}
              className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-400 hover:bg-red-600/30 transition-colors"
              aria-label="Stop generating"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 bg-accent hover:bg-accent-dark text-white disabled:bg-surface-4 disabled:text-text-muted"
              aria-label="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[10px] text-text-muted">
            {modelLabel}
          </p>
          <p className="text-[10px] text-text-muted">
            {streaming ? 'Generating…' : 'Enter to send'}
          </p>
        </div>
      </div>
    </div>
  )
}
