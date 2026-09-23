'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

type Message = {
 role: 'user' | 'assistant';
 content: string;
};

function renderMarkdown(text: string) {
 return text.split(/(\[[^\]]+\]\(\/[^)]+\))/g).map((part, index) => {
  const match = /^\[([^\]]+)\]\((\/(?!\/)[a-z0-9/-]+)\)$/i.exec(part);
  return match ? <Link key={index} href={match[2]} style={{ color: '#7652CA', fontWeight: 600 }}>{match[1]}</Link> : part;
 });
}

export default function ChatBot() {
 const [open, setOpen] = useState(false);
 const [messages, setMessages] = useState<Message[]>([
 {
 role: 'assistant',
 content: 'As-salamu alaykum ! Je suis Wasil. Je recherche les fiches disponibles sur Al-Wasil : cours, mosquées, événements, solidarité et Hajj/Omra. Quelle catégorie et quelle ville cherches-tu ?',
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
 signal: AbortSignal.timeout(12000),
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 messages: newMessages.slice(-20).map(m => ({ role: m.role, content: m.content })),
 }),
 });

 const data = await res.json() as { text?: string; error?: string };
 if (!res.ok || !data.text?.trim()) throw new Error('Recherche indisponible');
 setMessages(prev => [...prev, { role: 'assistant', content: data.text! }]);
 setStreamingText('');
 } catch {
 setMessages(prev => [...prev, {
 role: 'assistant',
 content: 'Désolé, une erreur est survenue. Réessaie dans quelques instants. ',
 }]);
 } finally {
 setLoading(false);
 }
 }

 const SUGGESTIONS = [
 'Cours d\'arabe près de chez moi',
 'Événements à Paris',
 'Mosquées à Paris',
 'Solidarité à Paris',
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
 backgroundColor: '#7652CA',
 color: 'white',
 border: 'none',
 cursor: 'pointer',
 display: open ? 'none' : 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
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
 maxHeight: 'calc(100dvh - 3rem)',
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
 backgroundColor: '#7652CA',
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
 <p style={{ fontSize: '0.72rem', opacity: 0.85, margin: 0 }}>Recherche dans Al-Wasil</p>
 </div>
 </div>
 <button
 aria-label="Fermer la recherche"
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
 backgroundColor: 'rgba(124,58,237,0.12)',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 flexShrink: 0, marginTop: '2px',
 }}>
 <Bot size={15} color="#7652CA" />
 </div>
 )}
 <div style={{
 maxWidth: '80%',
 backgroundColor: msg.role === 'user' ? '#7652CA' : '#f5f5f4',
 color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
 padding: '0.6rem 0.875rem',
 borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
 fontSize: '0.875rem',
 lineHeight: 1.55,
 whiteSpace: 'pre-wrap',
 }}
 >{renderMarkdown(msg.content)}</div>
 {msg.role === 'user' && (
 <div style={{
 width: '28px', height: '28px', borderRadius: '50%',
 backgroundColor: '#7652CA',
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
 backgroundColor: 'rgba(124,58,237,0.12)',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 flexShrink: 0, marginTop: '2px',
 }}>
 <Bot size={15} color="#7652CA" />
 </div>
 <div style={{
 maxWidth: '80%',
 backgroundColor: '#f5f5f4',
 padding: '0.6rem 0.875rem',
 borderRadius: '12px 12px 12px 2px',
 fontSize: '0.875rem',
 lineHeight: 1.55,
 }}
 >{renderMarkdown(streamingText)}</div>
 </div>
 )}

 {/* Loading dots */}
 {loading && !streamingText && (
 <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
 <div style={{ backgroundColor: '#f5f5f4', padding: '0.6rem 1rem', borderRadius: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
 {[0, 1, 2].map(i => (
 <div key={i} style={{
 width: '6px', height: '6px', borderRadius: '50%',
 backgroundColor: '#7652CA',
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
 aria-label="Ta recherche"
 maxLength={2000}
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
 aria-label="Envoyer la recherche"
 onClick={sendMessage}
 disabled={loading || !input.trim()}
 style={{
 width: '38px', height: '38px',
 borderRadius: '0.5rem',
 backgroundColor: loading || !input.trim() ? '#e5e7eb' : '#4a0e58',
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
