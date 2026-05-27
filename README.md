# ✨ Lumos — AI Chat

A full-stack streaming AI chat app built with Next.js 14 App Router and the Groq API. Responses stream token by token — same UX as ChatGPT — while keeping the API key securely on the server.

**[Live Demo →](https://your-vercel-url.vercel.app)** &nbsp;|&nbsp; **[Portfolio →](https://isaramdev.com)**

---

## Features

- **Token-by-token streaming** — responses arrive live, no waiting for the full reply
- **Multiple conversations** — sidebar with persistent history and timestamps
- **Model selector** — switch between Llama 3.3 70B, Llama 3.1 8B, and Mixtral 8x7B
- **Stop generation** — abort mid-stream with the stop button
- **Markdown rendering** — code blocks, tables, bold, lists via `react-markdown`
- **Suggestion prompts** — starter questions on empty conversations
- **Auto-growing textarea** — input expands up to 5 lines
- **Responsive** — collapsible sidebar works on mobile

---

## Setup

```bash
npm install

# Add your API key
cp .env.local.example .env.local
# Edit .env.local and set GROQ_API_KEY=your_key

npm run dev   # http://localhost:3000
```

Get a Groq API key at [console.groq.com](https://console.groq.com).

---

## Models

| Model | ID | Best for |
|---|---|---|
| Llama 3.3 70B | `llama-3.3-70b-versatile` | Everyday tasks |
| Llama 3.1 8B | `llama-3.1-8b-instant` | Fast, simple queries |
| Mixtral 8x7B | `mixtral-8x7b-32768` | Complex reasoning |

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 App Router | Server API routes, file-based routing, streaming support |
| AI Provider | Groq | Ultra-fast inference, multi-model, OpenAI-compatible API |
| Markdown | react-markdown + remark-gfm | Safe HTML rendering, GitHub Flavored Markdown |
| Styling | Tailwind CSS | Utility-first, no runtime overhead |

---

## Architecture Decisions

### Why a server-side API route for AI calls?
The Groq API key must never be exposed in browser code. The Next.js API route (`app/api/chat/route.js`) acts as a proxy: it receives the conversation from the client, calls Groq with the secret key, and forwards the stream back. The client never sees the key.

### How streaming works end-to-end
1. Client calls `POST /api/chat` with the message history
2. The API route calls Groq with `stream: true`, which returns Server-Sent Events (SSE)
3. The route parses the SSE stream, extracts `choices[0].delta.content` events, and re-emits the raw text as a `ReadableStream`
4. The client reads this stream with `response.body.getReader()` and appends each chunk to the message content in state
5. React re-renders on every chunk — this is what creates the live typing effect

### useChat hook as the single source of truth
All state (conversations, messages, streaming status, model) lives in `useChat.js`. UI components receive data and callbacks as props — they have no internal state except local UI concerns (hover, textarea value). This makes each component easy to test and reason about independently.

### AbortController for stop generation
`useChat` stores an `AbortController` ref. When the user clicks Stop, `abort()` is called on the controller, which cancels the `fetch` and triggers an `AbortError`. The catch block marks the current content as final (whatever arrived before the abort), so the UI doesn't lose the partial response.

### Optimistic UI for message append
The user message and the assistant placeholder are appended to state *before* the fetch returns. This makes the UI feel instant. The assistant placeholder starts with `content: ''` and `streaming: true`, which renders the thinking dots animation. As chunks arrive, the content is updated in place.

---

## Project Structure

```
├── app/
│   ├── layout.jsx          # Root layout (server) — fonts, metadata
│   ├── page.jsx            # Redirect to /chat
│   ├── chat/
│   │   └── page.jsx        # Main chat UI (client component)
│   └── api/chat/
│       └── route.js        # ← Streaming API route (the key piece)
│
├── components/chat/
│   ├── Sidebar.jsx         # Conversation list + model picker
│   ├── ChatHeader.jsx      # Title bar + clear/new buttons
│   ├── MessageList.jsx     # Scrollable messages + empty state
│   ├── Message.jsx         # Single message (markdown + streaming cursor)
│   └── ChatInput.jsx       # Auto-growing textarea + send/stop
│
├── hooks/
│   └── useChat.js          # All state: conversations, streaming, abort
│
└── lib/
    └── utils.js            # ID generator, conversation factory, model list
```

---

## Potential Next Steps

- [ ] Persist conversations to `localStorage`
- [ ] Export conversation as Markdown
- [ ] Custom system prompt per conversation
- [ ] Token usage counter
- [ ] Image upload support (vision models)

---

## License

MIT
