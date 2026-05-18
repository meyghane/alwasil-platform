'use client';

import { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import { Send, X, MessageCircle, Users, Lock } from 'lucide-react';

const VIOLET = '#c9973a';
const DARK = '#0f0225';

type Message = {
 id: string;
 text: string;
 author: string;
 role: 'admin' | 'modo';
 createdAt: string;
};

type ChatChannel = 'general' | 'admin';

export default function ChatInterne({
 currentUser,
 currentRole,
}: {
 currentUser: string;
 currentRole: 'admin' | 'modo';
}) {
 const [open, setOpen] = useState(false);
 const [activeChannel, setChannel] = useState<ChatChannel>('general');
 const [messages, setMessages] = useState<Record<ChatChannel, Message[]>>({ general: [], admin: [] });
 const [input, setInput] = useState('');
 const [sending, setSending] = useState(false);
 const [unread, setUnread] = useState<Record<ChatChannel, number>>({ general: 0, admin: 0 });
 const [connected, setConnected] = useState(false);
 const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
 const bottomRef = useRef<HTMLDivElement>(null);
 const pusherRef = useRef<Pusher | null>(null);

 // Charger l'historique
 async function loadHistory(ch: ChatChannel) {
 try {
 const res = await fetch(`/api/chat-interne?channel=${ch}`);
 if (res.ok) {
 const data = await res.json();
 setMessages(prev => ({ ...prev, [ch]: data.messages || [] }));
 }
 } catch { /* ignore */ }
 }

 useEffect(() => {
 const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
 const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu';
 if (!key) return;

 const pusher = new Pusher(key, {
 cluster,
 channelAuthorization: { endpoint: '/api/pusher-auth', transport: 'ajax' },
 });
 pusherRef.current = pusher;

 pusher.connection.bind('connected', () => setConnected(true));
 pusher.connection.bind('disconnected', () => setConnected(false));

 // Presence channel pour voir qui est en ligne (modos seulement, pas l'admin)
 const presenceCh = pusher.subscribe('presence-modo-general');
 presenceCh.bind('pusher:subscription_succeeded', (members: { each: (fn: (m: { info: { name: string; visible: boolean } }) => void) => void }) => {
 const online: string[] = [];
 members.each((member) => { if (member.info.visible) online.push(member.info.name); });
 setOnlineUsers(online);
 });
 presenceCh.bind('pusher:member_added', (member: { info: { name: string; visible: boolean } }) => {
 if (member.info.visible) setOnlineUsers(prev => [...prev.filter(n => n !== member.info.name), member.info.name]);
 });
 presenceCh.bind('pusher:member_removed', (member: { info: { name: string; visible: boolean } }) => {
 setOnlineUsers(prev => prev.filter(n => n !== member.info.name));
 });

 const generalCh = pusher.subscribe('modo-general');
 const adminCh = pusher.subscribe('modo-admin');

 const handleMsg = (ch: ChatChannel) => (msg: Message) => {
 setMessages(prev => ({ ...prev, [ch]: [...prev[ch].slice(-49), msg] }));
 if (!open || activeChannel !== ch) {
 setUnread(prev => ({ ...prev, [ch]: prev[ch] + 1 }));
 }
 };

 generalCh.bind('new-message', handleMsg('general'));
 adminCh.bind('new-message', handleMsg('admin'));

 // Charger l'historique au démarrage
 loadHistory('general');
 loadHistory('admin');

 return () => {
 pusher.unsubscribe('presence-modo-general');
 pusher.unsubscribe('modo-general');
 pusher.unsubscribe('modo-admin');
 pusher.disconnect();
 };
 }, []);

 // Scroll en bas à chaque nouveau message
 useEffect(() => {
 bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages, open, activeChannel]);

 // Marquer comme lu quand on ouvre
 useEffect(() => {
 if (open) setUnread(prev => ({ ...prev, [activeChannel]: 0 }));
 }, [open, activeChannel]);

 async function sendMessage(e: React.FormEvent) {
 e.preventDefault();
 if (!input.trim() || sending) return;
 setSending(true);
 try {
 await fetch('/api/chat-interne', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ message: input, channel: activeChannel }),
 });
 setInput('');
 } finally {
 setSending(false);
 }
 }

 const totalUnread = unread.general + unread.admin;
 const currentMessages = messages[activeChannel];

 function formatTime(iso: string) {
 try {
 return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
 } catch { return ''; }
 }

 return (
 <>
 {/* Bouton flottant */}
 <button
 onClick={() => setOpen(!open)}
 style={{
 position: 'fixed', bottom: '5rem', right: '1.5rem', zIndex: 998,
 width: 52, height: 52, borderRadius: '50%',
 background: 'linear-gradient(135deg, #c9973a, #8a6025)',
 border: 'none', cursor: 'pointer',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
 transition: 'transform 0.2s',
 }}
 title="Chat interne"
 >
 <MessageCircle size={22} color="white" strokeWidth={1.8} />
 {totalUnread > 0 && (
 <div style={{
 position: 'absolute', top: -4, right: -4,
 width: 20, height: 20, borderRadius: '50%',
 backgroundColor: '#ef4444', color: 'white',
 fontSize: '0.65rem', fontWeight: 700,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 border: '2px solid white',
 }}>
 {totalUnread > 9 ? '9+' : totalUnread}
 </div>
 )}
 </button>

 {/* Fenêtre de chat */}
 {open && (
 <div style={{
 position: 'fixed', bottom: '9rem', right: '1.5rem', zIndex: 999,
 width: 340, height: 480,
 backgroundColor: 'white',
 borderRadius: '20px',
 boxShadow: '0 24px 64px rgba(0,0,0,0.2), 0 0 0 1px rgba(124,58,237,0.1)',
 display: 'flex', flexDirection: 'column',
 overflow: 'hidden',
 fontFamily: 'Poppins, sans-serif',
 }}>

 {/* Header */}
 <div style={{ background: 'linear-gradient(135deg, #3b0764, #1e0545)', padding: '0.875rem 1rem' }}>
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
 <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: connected ? '#4ade80' : '#9ca3af' }} />
 <span style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>Chat Al-Wasil</span>
 {/* Modos en ligne (visible uniquement pour l'admin) */}
 {currentRole === 'admin' && onlineUsers.length > 0 && (
 <span style={{ fontSize: '0.62rem', backgroundColor: 'rgba(74,222,128,0.2)', color: '#4ade80', padding: '1px 6px', borderRadius: '99px', border: '1px solid rgba(74,222,128,0.3)' }}>
 {onlineUsers.length} en ligne
 </span>
 )}
 </div>
 <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex' }}>
 <X size={16} strokeWidth={2} />
 </button>
 </div>

 {/* Onglets canaux */}
 <div style={{ display: 'flex', gap: '0.4rem' }}>
 {([
 { key: 'general' as ChatChannel, label: 'Équipe', icon: Users },
 { key: 'admin' as ChatChannel, label: 'Admin', icon: Lock },
 ]).map(({ key, label, icon: Icon }) => (
 <button key={key} onClick={() => { setChannel(key); setUnread(prev => ({ ...prev, [key]: 0 })); }}
 style={{
 flex: 1, padding: '0.4rem 0.5rem',
 background: activeChannel === key ? 'rgba(255,255,255,0.15)' : 'transparent',
 border: `1px solid ${activeChannel === key ? 'rgba(255,255,255,0.3)' : 'transparent'}`,
 borderRadius: '8px', color: activeChannel === key ? 'white' : 'rgba(255,255,255,0.5)',
 fontWeight: activeChannel === key ? 700 : 500,
 fontSize: '0.72rem', cursor: 'pointer',
 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
 fontFamily: 'Poppins, sans-serif', position: 'relative',
 }}>
 <Icon size={12} strokeWidth={2} /> {label}
 {unread[key] > 0 && (
 <span style={{ position: 'absolute', top: 2, right: 2, width: 14, height: 14, borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', fontSize: '0.55rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 {unread[key]}
 </span>
 )}
 </button>
 ))}
 </div>
 </div>

 {/* Description canal + présence */}
 <div style={{ padding: '0.5rem 1rem', backgroundColor: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
 <div style={{ fontSize: '0.68rem', color: '#9ca3af', marginBottom: onlineUsers.length > 0 && currentRole === 'admin' ? '0.35rem' : 0 }}>
 {activeChannel === 'general' ? ' Canal ouvert à toute l\'équipe de modération' : ' Messages entre modérateurs et admin uniquement'}
 </div>
 {/* Liste des modos en ligne — visible uniquement pour l'admin */}
 {currentRole === 'admin' && activeChannel === 'general' && onlineUsers.length > 0 && (
 <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
 {onlineUsers.map(name => (
 <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.62rem', backgroundColor: '#f0fdf4', color: '#c9973a', padding: '1px 7px', borderRadius: '99px', border: '1px solid #f0dea0' }}>
 <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block' }} />
 {name}
 </span>
 ))}
 </div>
 )}
 </div>

 {/* Messages */}
 <div style={{ flex: 1, overflowY: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
 {currentMessages.length === 0 && (
 <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.78rem', marginTop: '2rem', lineHeight: 1.6 }}>
 <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></div>
 <p style={{ margin: 0 }}>Aucun message pour l&apos;instant.</p>
 <p style={{ margin: '0.25rem 0 0', fontSize: '0.68rem' }}>Soyez le premier à écrire !</p>
 </div>
 )}

 {currentMessages.map(msg => {
 const isMe = msg.author === currentUser;
 return (
 <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '0.5rem', alignItems: 'flex-end' }}>
 {/* Avatar */}
 {!isMe && (
 <div style={{ width: 28, height: 28, borderRadius: '8px', flexShrink: 0, background: msg.role === 'admin' ? 'linear-gradient(135deg, #c9973a, #8a6025)' : 'linear-gradient(135deg, #a87830, #8a6025)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>
 {msg.author.charAt(0).toUpperCase()}
 </div>
 )}

 <div style={{ maxWidth: '72%' }}>
 {!isMe && (
 <div style={{ fontSize: '0.62rem', color: '#9ca3af', marginBottom: '2px', marginLeft: '2px' }}>
 {msg.author} {msg.role === 'admin' && ''}
 </div>
 )}
 <div style={{
 padding: '0.5rem 0.75rem',
 borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
 backgroundColor: isMe ? VIOLET : '#f3f4f6',
 color: isMe ? 'white' : DARK,
 fontSize: '0.83rem',
 lineHeight: 1.5,
 }}>
 {msg.text}
 </div>
 <div style={{ fontSize: '0.58rem', color: '#9ca3af', marginTop: '2px', textAlign: isMe ? 'right' : 'left' }}>
 {formatTime(msg.createdAt)}
 </div>
 </div>
 </div>
 );
 })}
 <div ref={bottomRef} />
 </div>

 {/* Input */}
 <form onSubmit={sendMessage} style={{ padding: '0.75rem', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '0.5rem' }}>
 <input
 value={input}
 onChange={e => setInput(e.target.value)}
 placeholder="Écrire un message..."
 style={{ flex: 1, padding: '0.6rem 0.875rem', border: '1.5px solid #fdfbf0', borderRadius: '12px', fontSize: '0.85rem', outline: 'none', fontFamily: 'Poppins, sans-serif', backgroundColor: '#faf9ff' }}
 />
 <button type="submit" disabled={!input.trim() || sending}
 style={{ width: 38, height: 38, borderRadius: '10px', background: input.trim() ? 'linear-gradient(135deg, #c9973a, #8a6025)' : '#f3f4f6', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Send size={16} color={input.trim() ? 'white' : '#9ca3af'} strokeWidth={2} />
 </button>
 </form>
 </div>
 )}
 </>
 );
}
