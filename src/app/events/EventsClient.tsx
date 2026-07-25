'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, MapPin, Clock, ExternalLink, User, Star, Monitor, Shuffle, Navigation } from 'lucide-react';
import {
 EVENT_CATEGORY_LABELS,
 EVENT_CATEGORY_COLORS,
 type Event,
 type EventCategory,
} from '@/data/events';
import DeptFilter from '@/components/DeptFilter';
import PageHeader from '@/components/PageHeader';

type EventsClientProps = { events: Event[] };

const CATEGORIES: { key: EventCategory | 'all'; label: string }[] = [
 { key: 'all', label: 'Tout' },
 { key: 'conference', label: 'Conférence' },
 { key: 'maraude', label: 'Maraude' },
 { key: 'cours', label: 'Cours' },
 { key: 'iftar', label: 'Iftar' },
 { key: 'webinaire', label: 'Webinaire' },
 { key: 'jeunesse', label: 'Jeunesse' },
 { key: 'collecte', label: 'Collecte' },
];

function formatDate(iso: string): string {
 const d = new Date(iso);
 return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function isUpcoming(iso: string): boolean {
 return new Date(iso) >= new Date(new Date().toDateString());
}

export default function EventsClient({ events }: EventsClientProps) {
 const [search, setSearch] = useState('');
 const [selectedDept, setSelectedDept] = useState('Tout');
 const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
 const [showPast, setShowPast] = useState(false);

 // Compteurs par département
 const deptCounts: Record<string, number> = {};
 events.filter(e => isUpcoming(e.date)).forEach(e => {
 deptCounts[e.department] = (deptCounts[e.department] ?? 0) + 1;
 });

 const filtered = events.filter(ev => {
 const q = search.toLowerCase();
 const matchSearch = !q ||
 ev.title.toLowerCase().includes(q) ||
 ev.city.toLowerCase().includes(q) ||
 ev.organizer.toLowerCase().includes(q) ||
 ev.tags.some(t => t.toLowerCase().includes(q));
 const matchDept = selectedDept === 'Tout' || ev.department === selectedDept;
 const matchCat = selectedCategory === 'all' || ev.category === selectedCategory;
 const matchTime = showPast ? true : isUpcoming(ev.date);
 return matchSearch && matchDept && matchCat && matchTime;
 });

 const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

 const grouped: Record<string, Event[]> = {};
 sorted.forEach(ev => {
 const key = ev.date;
 if (!grouped[key]) grouped[key] = [];
 grouped[key].push(ev);
 });

 return (
 <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
 <PageHeader 
 title="Événements" 
 titleAr="لِقَاء" 
 description="L'agenda communautaire : conférences, séminaires, et rencontres en France." 
 color="#c9973a" 
 emoji="" 
 />

 <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>

 {/* Search & Filters Bar */}
 <div style={{ 
 display: 'flex', 
 flexDirection: 'column', 
 gap: '1.25rem',
 marginBottom: '2.5rem',
 padding: '1.5rem',
 backgroundColor: '#fafaf9',
 borderRadius: '12px',
 border: '1px solid #e7e5e4'
 }}>
 <div style={{ position: 'relative' }}>
 <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }} />
 <input
 type="text"
 placeholder="Ville, organisateur, mot-clé..."
 value={search}
 onChange={e => setSearch(e.target.value)}
 style={{
 width: '100%',
 padding: '0.8rem 1rem 0.8rem 3rem',
 borderRadius: '8px',
 border: '1px solid #e7e5e4',
 fontSize: '0.95rem',
 outline: 'none',
 backgroundColor: 'white'
 }}
 />
 </div>

 <DeptFilter value={selectedDept} onChange={setSelectedDept} counts={deptCounts} />

 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
 {CATEGORIES.map(cat => {
 const isActive = selectedCategory === cat.key;
 return (
 <button
 key={cat.key}
 onClick={() => setSelectedCategory(cat.key)}
 style={{
 padding: '0.4rem 0.8rem',
 borderRadius: '6px',
 border: '1px solid #e7e5e4',
 backgroundColor: isActive ? '#1c1917' : 'white',
 color: isActive ? 'white' : '#57534e',
 fontSize: '0.8rem',
 fontWeight: 600,
 cursor: 'pointer',
 transition: 'all 0.15s'
 }}
 >
 {cat.label}
 </button>
 );
 })}
 <button
 onClick={() => setShowPast(!showPast)}
 style={{
 marginLeft: 'auto',
 fontSize: '0.8rem',
 color: '#78716c',
 background: 'none',
 border: 'none',
 cursor: 'pointer',
 textDecoration: 'underline'
 }}
 >
 {showPast ? 'Masquer les archives' : 'Voir les archives'}
 </button>
 </div>
 </div>

 {/* Results — grille 3 colonnes */}
 {sorted.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '5rem 0', color: '#a8a29e' }}>
 <Calendar size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
 <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Aucun événement trouvé</p>
 <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Essayez de modifier vos filtres de recherche.</p>
 </div>
 ) : (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
 {sorted.map(ev => (
 <EventCard key={ev.id} event={ev} />
 ))}
 </div>
 )}

 {/* CTA */}
 <div style={{
 marginTop: '5rem',
 padding: '3rem 2rem',
 borderRadius: '16px',
 backgroundColor: '#f0fdfa',
 border: '1px solid #fdfbf0',
 textAlign: 'center',
 }}>
 <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#134e4a' }}>Vous organisez un événement ?</h3>
 <p style={{ color: '#c9973a', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '500px', marginInline: 'auto' }}>
 Référencez vos conférences, séminaires ou maraudes gratuitement sur Al-Wasil.
 </p>
 <Link href="/contact?type=evenement" className="btn btn-primary" style={{ 
 textDecoration: 'none',
 padding: '0.75rem 2rem',
 backgroundColor: '#c9973a',
 borderRadius: '8px',
 fontWeight: 600
 }}>
 Ajouter un événement
 </Link>
 </div>
 </div>
 </div>
 );
}

function EventCard({ event }: { event: Event }) {
 const color = EVENT_CATEGORY_COLORS[event.category];
 const past = !isUpcoming(event.date);
 const d = new Date(event.date);
 const dayNum = d.toLocaleDateString('fr-FR', { day: 'numeric' });
 const monthStr = d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');

 return (
 <div style={{
 backgroundColor: 'white',
 borderRadius: '16px',
 border: '1px solid #e7e5e4',
 borderTop: `3px solid ${color}`,
 overflow: 'hidden',
 display: 'flex',
 flexDirection: 'column',
 boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
 opacity: past ? 0.6 : 1,
 }}>
 {/* Header */}
 <div style={{ padding: '1rem 1.1rem 0.75rem', background: `linear-gradient(135deg, ${color}10, transparent)` }}>
 {/* Badges */}
 <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
 {event.featured && (
 <span style={{ backgroundColor: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
 <Star size={9} strokeWidth={2.5} /> En avant
 </span>
 )}
 <span style={{ backgroundColor: color + '18', color, border: `1px solid ${color}33`, padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700 }}>
 {EVENT_CATEGORY_LABELS[event.category]}
 </span>
 <span style={{ backgroundColor: '#f5f5f4', color: '#57534e', padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
 {event.format === 'enligne'
 ? <><Monitor size={9} strokeWidth={2} /> En ligne</>
 : event.format === 'hybride'
 ? <><Shuffle size={9} strokeWidth={2} /> Hybride</>
 : <><Navigation size={9} strokeWidth={2} /> Présentiel</>
 }
 </span>
 </div>

 {/* Date + heure */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
 <div style={{
 width: 44, height: 44, borderRadius: '10px', flexShrink: 0,
 backgroundColor: color, display: 'flex', flexDirection: 'column',
 alignItems: 'center', justifyContent: 'center',
 }}>
 <span style={{ color: 'white', fontSize: '1rem', fontWeight: 800, lineHeight: 1 }}>{dayNum}</span>
 <span style={{ color: 'white', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.85 }}>{monthStr}</span>
 </div>
 <div>
 <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1c1917' }}>
 {event.timeStart}{event.timeEnd ? ` — ${event.timeEnd}` : ''}
 </div>
 <div style={{ fontSize: '0.72rem', color: '#a8a29e', marginTop: '1px', textTransform: 'capitalize' }}>
 {d.toLocaleDateString('fr-FR', { weekday: 'long' })}
 </div>
 </div>
 </div>
 </div>

 {/* Corps */}
 <div style={{ padding: '0.75rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
 <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#1c1917', lineHeight: 1.35 }}>
 {event.title}
 </h3>

 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#78716c' }}>
 <MapPin size={11} color="#a8a29e" />
 <span style={{ fontWeight: 500, color: '#44403c' }}>{event.city}</span>
 {event.department !== '00' && <span style={{ color: '#a8a29e' }}>({event.department})</span>}
 </div>
 <div style={{ fontSize: '0.72rem', color: '#a8a29e' }}>par {event.organizer}</div>
 </div>

 <p style={{
 fontSize: '0.78rem', color: '#78716c', lineHeight: 1.5, margin: 0, flex: 1,
 display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
 } as React.CSSProperties}>
 {event.description}
 </p>

 <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
 {event.tags.slice(0, 3).map(t => (
 <span key={t} style={{ backgroundColor: '#f5f5f4', color: '#78716c', padding: '1px 7px', borderRadius: '4px', fontSize: '0.68rem' }}>#{t}</span>
 ))}
 </div>
 </div>

 {/* Footer */}
 <div style={{ padding: '0 1.1rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
 <span style={{ fontSize: '0.75rem', fontWeight: 700, color: event.isFree ? '#c9973a' : '#b45309' }}>
 {event.isFree ? ' Gratuit' : event.price}
 </span>
 {past ? (
 <span style={{ fontSize: '0.72rem', color: '#a8a29e' }}>Événement passé</span>
 ) : event.registrationUrl ? (
 <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer"
 style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#1c1917', color: 'white', padding: '0.5rem 0.875rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
 S'inscrire <ExternalLink size={11} />
 </a>
 ) : (
 <span style={{ fontSize: '0.72rem', color: '#78716c', fontWeight: 500 }}>Entrée libre</span>
 )}
 </div>
 </div>
 );
}
