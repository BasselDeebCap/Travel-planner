import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types/plan';
import '../../styles/chat.css';

interface ChatPanelProps {
  open: boolean;
  onToggle: () => void;
  planContext: unknown;
}

export default function ChatPanel({ open, onToggle, planContext }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your AI travel assistant for the Philippines 2026–27 trip. Ask me anything about the plans — activities, hotels, budget, comparisons — or ask me to suggest changes!",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
          planContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content || 'Sorry, I had trouble generating a response. Please try again.',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '⚠️ Could not reach the AI service. Make sure the OPENROUTER_API_KEY environment variable is set in your Netlify dashboard and redeploy.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating toggle button (always visible) */}
      <button className="chat-fab" onClick={onToggle} title="AI Travel Assistant">
        {open ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      <aside className={`chat-panel ${open ? 'open' : ''}`}>
        <div className="chat-header">
          <span>🤖 AI Travel Assistant</span>
          <button className="chat-close" onClick={onToggle}>✕</button>
        </div>

        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-msg ${msg.role}`}>
              <div className="chat-bubble">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-msg assistant">
              <div className="chat-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the trip plans..."
            rows={2}
            disabled={loading}
          />
          <button
            className="chat-send"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            ➤
          </button>
        </div>
      </aside>
    </>
  );
}
