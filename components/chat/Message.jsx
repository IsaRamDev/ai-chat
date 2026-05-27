'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Renders a single chat message.
 * AI messages use ReactMarkdown for rich formatting.
 * The streaming cursor blinks at the end while content is arriving.
 */
export default function Message({ message }) {
  const isUser = message.role === 'user'
  const isError = message.error

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}>

      {/* AI avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center mt-0.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9d8eff" strokeWidth="2">
            <path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z"/>
          </svg>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
          isUser
            ? 'bg-user-bg border border-user-border text-text-primary rounded-tr-sm'
            : isError
            ? 'bg-red-950/40 border border-red-800/40 text-red-300'
            : 'bg-surface-2 border border-border text-text-primary rounded-tl-sm'
        }`}
      >
        {isUser ? (
          /* User messages: plain text, preserve newlines */
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          /* AI messages: full markdown */
          <div className="prose-chat">
            {message.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            ) : (
              /* Thinking dots before first token */
              <ThinkingDots />
            )}
            {message.streaming && message.content && (
              <span className="inline-block w-0.5 h-3.5 bg-accent ml-0.5 animate-cursor-blink align-middle" />
            )}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-user-bg border border-user-border flex items-center justify-center mt-0.5 text-[10px] font-bold text-accent-light">
          U
        </div>
      )}
    </div>
  )
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="Thinking…">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-text-muted animate-thinking"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  )
}
