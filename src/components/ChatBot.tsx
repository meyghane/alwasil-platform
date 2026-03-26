'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function renderMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--primary-color);font-weight:600;text-decoration:underline">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'As-salamu alaykum ! Je suis Wasil, l\'assistant d\'Al-Wasil. Je suis là pour t\'aider à trouver des cours, des événements, des initiatives solidaires ou des ressources juridiques. Comment puis-je t\'aider ?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setStreamingText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error('API error');

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              fullText += parsed.text;
              setStreamingText(fullText);
            } catch { /* skip */ }
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
      setStreamingText('');
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Réessaie dans quelques instants. 🙏',
      }]);
    } finally {
      setLoading(false);
    }
  }

  const SUGGESTIONS = [
    'Cours d\'arabe près de chez moi',
    'Prochain iftar à Paris',
    'Mes droits au travail',
    'Bénévolat ce weekend',
  ];

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: open ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(13,148,136,0.4)',
          zIndex: 1000,
          transition: 'transform 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
        title="Parler à Wasil"
      >
        <MessageCircle size={26} />
      </button>

      {/* Fenêtre chat */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '380px',
          maxWidth: 'calc(100vw - 2rem)',
          height: '520px',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={20} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Wasil</p>
                <p style={{ fontSize: '0.72rem', opacity: 0.85, margin: 0 }}>Assistant Al-Wasil · En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.25rem' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: '0.5rem',
                alignItems: 'flex-start',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: 'rgba(13,148,136,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '2px',
                  }}>
                    <Bot size={15} color="var(--primary-color)" />
                  </div>
                )}
                <div style={{
                  maxWidth: '80%',
                  backgroundColor: msg.role === 'user' ? 'var(--primary-color)' : '#f5f5f4',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  padding: '0.6rem 0.875rem',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  fontSize: '0.875rem',
                  lineHeight: 1.55,
                }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
                {msg.role === 'user' && (
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '2px',
                  }}>
                    <User size={15} color="white" />
                  </div>
                )}
              </div>
            ))}

            {/* Streaming */}
            {streamingText && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: 'rgba(13,148,136,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '2px',
                }}>
                  <Bot size={15} color="var(--primary-color)" />
                </div>
                <div style={{
                  maxWidth: '80%',
                  backgroundColor: '#f5f5f4',
                  padding: '0.6rem 0.875rem',
                  borderRadius: '12px 12px 12px 2px',
                  fontSize: '0.875rem',
                  lineHeight: 1.55,
                }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingText) + '<span style="display:inline-block;width:2px;height:14px;background:var(--primary-color);margin-left:2px;animation:blink 0.8s infinite">▌</span>' }}
                />
              </div>
            )}

            {/* Loading dots */}
            {loading && !streamingText && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ backgroundColor: '#f5f5f4', padding: '0.6rem 1rem', borderRadius: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      backgroundColor: 'var(--primary-color)',
                      animation: `bounce 1s ${i * 0.15}s infinite`,
                      opacity: 0.6,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only on first message) */}
          {messages.length === 1 && (
            <div style={{ padding: '0 0.875rem 0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); }}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '999px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'white',
                    fontSize: '0.72rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.5rem',
            flexShrink: 0,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Pose ta question..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.6rem 0.875rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: '38px', height: '38px',
                borderRadius: '0.5rem',
                backgroundColor: loading || !input.trim() ? '#e5e7eb' : 'var(--primary-color)',
                color: 'white',
                border: 'none',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
            </button>
          </div>

          <style>{`
            @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
            @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
            @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          `}</style>
        </div>
      )}
    </>
  );
}
