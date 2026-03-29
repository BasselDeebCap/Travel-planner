import { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage, PlanEditPayload } from '../../types/plan';
import '../../styles/chat.css';

const MIN_WIDTH = 300;
const MAX_WIDTH = 700;
const DEFAULT_WIDTH = 380;

interface ChatPanelProps {
  expanded: boolean;
  onToggleExpand: () => void;
  planContext: unknown;
  onApplyChanges: (edit: PlanEditPayload) => void;
}

/** Extract a plan-edit JSON block from AI response text */
function parsePlanEdit(content: string): { text: string; edit: PlanEditPayload | null } {
  // Try multiple patterns the AI might use
  const patterns = [
    /:::plan-edit\s*\n([\s\S]*?)\n:::/,          // standard :::plan-edit ... :::
    /:::plan-edit\s*\n([\s\S]*?)$/,                // no closing ::: (truncated)
    /```json\s*\n([\s\S]*?)\n```/,                 // ```json ... ```
    /```\s*\n(\{[\s\S]*?\})\s*\n```/,              // ``` { ... } ```
  ];

  let jsonStr: string | null = null;
  let textPart = content;

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      jsonStr = match[1].trim();
      // Remove the matched block from the display text
      textPart = content.replace(match[0], '').trim();
      break;
    }
  }

  if (!jsonStr) return { text: content, edit: null };

  try {
    // Strip any remaining markdown fences
    const cleaned = jsonStr.replace(/^```json?\s*/i, '').replace(/\s*```$/, '');
    const parsed = JSON.parse(cleaned);

    if (parsed && parsed.targetPlan && parsed.description) {
      return { text: textPart, edit: parsed as PlanEditPayload };
    }
  } catch {
    // If the JSON is there but malformed, still hide it from the chat display
    // and show just the human-readable text
    const fallbackText = content.replace(/:::plan-edit[\s\S]*?(:::|$)/, '').trim()
      || content.replace(/```json[\s\S]*?(```|$)/, '').trim();
    if (fallbackText !== content) {
      console.warn('Plan-edit JSON found but could not be parsed');
      return { text: fallbackText + '\n\n⚠️ (Plan changes could not be parsed — try rephrasing your request)', edit: null };
    }
  }
  return { text: content, edit: null };
}

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
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDragging = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Drag-to-resize handlers
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleDragMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const newWidth = window.innerWidth - ev.clientX;
      setPanelWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth)));
    };

    const handleDragEnd = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  }, []);

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

  // When not expanded (from App) or self-collapsed
  if (!expanded || isCollapsed) {
    return (
      <aside className="chat-panel collapsed">
        <div className="chat-collapsed-strip" onClick={() => { if (!expanded) onToggleExpand(); else setIsCollapsed(false); }}>
          <span className="chat-expand-icon">💬</span>
          <span className="chat-collapsed-label">AI Chat</span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="chat-panel"
      ref={panelRef}
      style={{ width: panelWidth, minWidth: panelWidth }}
    >
      {/* Drag handle on left edge */}
      <div className="chat-drag-handle" onMouseDown={handleDragStart} />

      <div className="chat-header">
        <span className="chat-header-left">🤖 AI Travel Assistant</span>
        <button
          className="chat-header-btn"
          onClick={() => setIsCollapsed(true)}
          title="Collapse chat"
        >
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-msg ${msg.role}`}>
            <div className="chat-msg-wrapper">
              <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: msg.content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>') }} />
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
          onChange={e => {
            setInput(e.target.value);
            // Auto-resize textarea
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the trip or request changes..."
          rows={1}
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
