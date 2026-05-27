'use client'

export default function ChatHeader({ title, messageCount, onClear, onNew }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-1 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0 pl-10 lg:pl-0">
        <div className="min-w-0">
          <h1 className="text-sm font-medium text-text-primary truncate max-w-xs">
            {title}
          </h1>
          {messageCount > 0 && (
            <p className="text-[10px] text-text-muted font-mono">
              {messageCount} message{messageCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {messageCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-secondary hover:bg-surface-3 border border-transparent hover:border-border transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
            Clear
          </button>
        )}
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-primary bg-surface-2 hover:bg-surface-3 border border-border hover:border-border-light transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New chat
        </button>
      </div>
    </header>
  )
}
