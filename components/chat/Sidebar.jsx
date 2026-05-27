'use client'
import { useState } from 'react'
import { MODELS, formatTimestamp } from '@/lib/utils'

export default function Sidebar({
  conversations, activeId, onSelect, onNew, onDelete,
  model, onModelChange,
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="lg:hidden fixed top-3 left-3 z-50 w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Toggle sidebar"
      >
        <MenuIcon />
      </button>

      {/* Backdrop on mobile */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/60"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`
          fixed lg:relative top-0 left-0 bottom-0 z-40
          w-64 flex flex-col bg-surface-1 border-r border-border
          transition-transform duration-200
          ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
              <SparkleIcon />
            </div>
            <span className="font-semibold text-sm text-text-primary">Lumos</span>
          </div>
          <button
            onClick={onNew}
            className="w-7 h-7 rounded-lg border border-border hover:border-border-light hover:bg-surface-3 flex items-center justify-center text-text-muted hover:text-text-primary transition-all"
            aria-label="New conversation"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Conversations list */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {conversations.map((conv) => (
            <ConvItem
              key={conv.id}
              conv={conv}
              active={conv.id === activeId}
              onSelect={() => { onSelect(conv.id); setCollapsed(true) }}
              onDelete={() => onDelete(conv.id)}
            />
          ))}
        </nav>

        {/* Model picker */}
        <div className="border-t border-border px-3 py-3">
          <p className="text-[10px] font-medium text-text-muted uppercase tracking-widest mb-2 px-1">Model</p>
          <div className="space-y-1">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => onModelChange(m.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                  model === m.id
                    ? 'bg-accent/15 border border-accent/30 text-text-primary'
                    : 'text-text-secondary hover:bg-surface-3 hover:text-text-primary'
                }`}
              >
                <span className="font-medium block">{m.label}</span>
                <span className="text-[10px] text-text-muted">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3">
          <p className="text-[10px] text-text-muted">
            Built by{' '}
            <a href="https://isaramdev.com" target="_blank" rel="noopener noreferrer"
              className="text-accent-light hover:text-accent transition-colors underline underline-offset-2">
              Isabel Ramirez
            </a>
          </p>
        </div>
      </aside>
    </>
  )
}

function ConvItem({ conv, active, onSelect, onDelete }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`group relative flex items-center rounded-lg cursor-pointer transition-colors ${
        active ? 'bg-surface-3' : 'hover:bg-surface-2'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0 px-3 py-2.5">
        <p className={`text-xs truncate ${active ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
          {conv.title}
        </p>
        <p className="text-[10px] text-text-muted mt-0.5 font-mono">
          {formatTimestamp(conv.updatedAt)} · {conv.messages.length} msg{conv.messages.length !== 1 ? 's' : ''}
        </p>
      </div>
      {hovered && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(conv.id) }}
          className="mr-2 p-1 rounded hover:bg-surface-4 text-text-muted hover:text-danger transition-colors"
          aria-label="Delete conversation"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      )}
    </div>
  )
}

const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9d8eff" strokeWidth="2">
    <path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z"/>
  </svg>
)
