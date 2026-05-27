'use client'
import { useCallback } from 'react'
import { useChat } from '@/hooks/useChat'
import Sidebar     from '@/components/chat/Sidebar'
import ChatHeader  from '@/components/chat/ChatHeader'
import MessageList from '@/components/chat/MessageList'
import ChatInput   from '@/components/chat/ChatInput'

/**
 * Main chat page — client component.
 *
 * Server responsibilities (handled in layout.jsx):
 *   - Font loading, global styles, metadata
 *
 * Client responsibilities (this component):
 *   - All interactive state via useChat hook
 *   - Streaming fetch
 *   - Conversation management
 */
export default function ChatPage() {
  const {
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
  } = useChat()

  const handleSuggestion = useCallback((text) => {
    sendMessage(text)
  }, [sendMessage])

  return (
    <div className="flex h-full bg-surface-0">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={newConversation}
        onDelete={deleteConversation}
        model={model}
        onModelChange={setModel}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <ChatHeader
          title={activeConversation.title}
          messageCount={activeConversation.messages.length}
          onClear={clearConversation}
          onNew={newConversation}
        />

        <MessageList
          messages={activeConversation.messages}
          streaming={streaming}
          onSuggestion={handleSuggestion}
        />

        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          streaming={streaming}
          model={model}
        />
      </div>
    </div>
  )
}
