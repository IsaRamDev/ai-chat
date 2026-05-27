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
  { id: 'llama-3.3-70b-versatile',                          label: 'Llama 3.3 70B',        desc: 'Fast · Everyday tasks'         },
  { id: 'llama-3.1-8b-instant',                             label: 'Llama 3.1 8B',         desc: 'Fastest · Simple queries'      },
  { id: 'meta-llama/llama-4-scout-17b-16e-instruct',        label: 'Llama 4 Scout',        desc: 'Latest · Multimodal'           },
  { id: 'meta-llama/llama-4-maverick-17b-128e-instruct',    label: 'Llama 4 Maverick',     desc: 'Latest · Long context'         },
  { id: 'deepseek-r1-distill-llama-70b',                    label: 'DeepSeek R1 70B',      desc: 'Reasoning · Step-by-step'      },
  { id: 'qwen-qwq-32b',                                     label: 'Qwen QwQ 32B',         desc: 'Reasoning · Math & coding'     },
  { id: 'gemma2-9b-it',                                     label: 'Gemma 2 9B',           desc: 'Efficient · Instruction tuned' },
  { id: 'mixtral-8x7b-32768',                               label: 'Mixtral 8x7B',         desc: 'Smart · Complex reasoning'     },
  { id: 'compound-beta',                                    label: 'Compound Beta',        desc: 'Agentic · Tool use'            },
]