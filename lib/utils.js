/**
 * Generates a short unique ID.
 * Uses crypto.randomUUID when available (browser + Node 18+), falls back to Math.random.
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().slice(0, 8)
  }
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Factory for a new empty conversation object.
 */
export function createConversation() {
  return {
    id:        generateId(),
    title:     'New conversation',
    messages:  [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

/**
 * Formats a timestamp for display in the sidebar.
 * Shows time for today, date otherwise.
 */
export function formatTimestamp(ts) {
  const d   = new Date(ts)
  const now = new Date()
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth()    === now.getMonth() &&
    d.getDate()     === now.getDate()

  if (isToday) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const MODELS = [
  { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B', desc: 'Smart · Everyday tasks' },
  { id: 'openai/gpt-oss-20b',  label: 'GPT-OSS 20B',  desc: 'Fastest · Simple queries' },
  { id: 'qwen/qwen3.6-27b',    label: 'Qwen 3.6 27B', desc: 'Reasoning · Math & coding' },
  { id: 'groq/compound',       label: 'Compound',     desc: 'Agentic · Tool use' },
]