import { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage, PlanEditPayload } from '../../types/plan';
import '../../styles/chat.css';

interface ChatPanelProps {
  expanded: boolean;
  onToggleExpand: () => void;
  planContext: unknown;
  onApplyChanges: (edit: PlanEditPayload) => void;
}

/** Extract a plan-edit JSON block from AI response text */
function parsePlanEdit(content: string): { text: string; edit: PlanEditPayload | null } {
  const marker = ':::plan-edit';
  const startIdx = content.indexOf(marker);
  if (startIdx === -1) return { text: content, edit: null };

  const jsonStart = content.indexOf('\n', startIdx) + 1;
  const endIdx = content.indexOf(':::', jsonStart);
  if (endIdx === -1) return { text: content, edit: null };

  const jsonStr = content.slice(jsonStart, endIdx).trim();
  const textPart = (content.slice(0, startIdx) + content.slice(endIdx + 3)).trim();

  try {
    // Strip markdown code fences if the LLM wraps the JSON
    const cleaned = jsonStr.replace(/^```json?\s*/i, '').replace(/\s*```$/, '');
    const parsed = JSON.parse(cleaned);
    if (parsed && parsed.targetPlan && parsed.description) {
      return { text: textPart, edit: parsed as PlanEditPayload };
    }
  } catch {
    console.warn('Could not parse plan-edit JSON from AI response');
  }
  return { text: content, edit: null };
}

type PanelSize = 'normal' | 'wide' | 'collapsed';

export default function ChatPanel({ expanded, onToggleExpand, planContext, onApplyChanges }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your AI travel assistant for the Philippines 2026–27 trip. Ask me anything about the plans, or ask me to make changes — I can update your itinerary, flights, budget, and more! Just tell me what you'd like to adjust.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [panelSize, setPanelSize] = useState<PanelSize>('normal');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
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
      const rawContent = data.content || 'Sorry, I had trouble generating a response. Please try again.';

      const { text: displayText, edit } = parsePlanEdit(rawContent);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: displayText,
        timestamp: Date.now(),
        planEdit: edit,
        applied: false,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '⚠️ Could not reach the AI service. Make sure the GEMINI_API_KEY environment variable is set in your Netlify dashboard and redeploy.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, planContext]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleApply = (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg?.planEdit || msg.applied) return;
    onApplyChanges(msg.planEdit);
    setMessages(prev =>
      prev.map(m => m.id === msgId ? { ...m, applied: true } : m)
    );
  };

  const sizeClass = panelSize === 'collapsed'
    ? 'collapsed'
    : panelSize === 'wide'
      ? 'expanded-wide'
      : '';

  // When not expanded (from App), show collapsed strip
  if (!expanded) {
    return (
      <aside className="chat-panel collapsed">
        <div className="chat-collapsed-strip" onClick={onToggleExpand}>
          <span className="chat-expand-icon">💬</span>
          <span className="chat-collapsed-label">AI Chat</span>
        </div>
      </aside>
    );
  }

  // When panel is self-collapsed (size toggle)
  if (panelSize === 'collapsed') {
    return (
      <aside className={`chat-panel ${sizeClass}`}>
        <div className="chat-collapsed-strip" onClick={() => setPanelSize('normal')}>
          <span className="chat-expand-icon">💬</span>
          <span className="chat-collapsed-label">AI Chat</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`chat-panel ${sizeClass}`}>
      <div className="chat-header">
        <span className="chat-header-left">🤖 AI Travel Assistant</span>
        <div className="chat-header-actions">
          <button
            className={`chat-header-btn ${panelSize === 'wide' ? 'active' : ''}`}
            onClick={() => setPanelSize(panelSize === 'wide' ? 'normal' : 'wide')}
            title={panelSize === 'wide' ? 'Normal width' : 'Expand wider'}
          >
            {panelSize === 'wide' ? '◁' : '▷'}
          </button>
          <button
            className="chat-header-btn"
            onClick={() => setPanelSize('collapsed')}
            title="Collapse chat"
          >
            ▸▸
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-msg ${msg.role}`}>
            <div className="chat-msg-wrapper">
              <div className="chat-bubble">{msg.content}</div>
              {msg.planEdit && (
                <div>
                  <button
                    className={`chat-apply-btn ${msg.applied ? 'applied' : ''}`}
                    onClick={() => handleApply(msg.id)}
                    disabled={msg.applied}
                  >
                    {msg.applied ? '✓ Applied to Plan' : '✨ Apply Changes to Plan'}
                  </button>
                  <div className="chat-edit-summary">{msg.planEdit.description}</div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-msg assistant">
            <div className="chat-msg-wrapper">
              <div className="chat-bubble typing">
                <span></span><span></span><span></span>
              </div>
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
          placeholder="Ask about the trip or request changes..."
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
  );
}
