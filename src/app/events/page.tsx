'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, MapPin, Clock, ExternalLink, Plus } from 'lucide-react';
import {
  allEvents,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_COLORS,
  type Event,
  type EventCategory,
} from '@/data/events';
import DeptFilter from '@/components/DeptFilter';

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

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tout');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [showPast, setShowPast] = useState(false);

  const filtered = allEvents.filter(ev => {
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

  // Trier par date croissante
  const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Grouper par date
  const grouped: Record<string, Event[]> = {};
  sorted.forEach(ev => {
    const key = ev.date;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={28} color="var(--primary-color)" />
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Événements — Liqa (لِقَاء)</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {allEvents.filter(e => isUpcoming(e.date)).length} événements à venir en Île-de-France et en ligne.
              </p>
            </div>
          </div>
          <Link href="/contact?type=evenement" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Plus size={16} /> Proposer un événement
          </Link>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Rechercher un événement, une ville, un organisateur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.75rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border-color)',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Filtre département */}
      <div style={{ marginBottom: '1.25rem' }}>
        <DeptFilter value={selectedDept} onChange={setSelectedDept} />
      </div>

      {/* Catégories */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CATEGORIES.map(cat => {
          const color = cat.key !== 'all' ? EVENT_CATEGORY_COLORS[cat.key] : 'var(--primary-color)';
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                border: isActive ? `2px solid ${color}` : '1.5px solid var(--border-color)',
                backgroundColor: isActive ? color : 'white',
                color: isActive ? 'white' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
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
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            border: '1.5px solid var(--border-color)',
            backgroundColor: showPast ? '#f5f5f4' : 'white',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          {showPast ? 'Masquer passés' : 'Voir événements passés'}
        </button>
      </div>

      {/* Résultats */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>Aucun événement pour ces filtres.</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Essaie un autre département ou une autre catégorie.</p>
        </div>
      ) : (
        <div>
          {Object.entries(grouped).map(([date, events]) => (
            <div key={date} style={{ marginBottom: '2rem' }}>
              {/* Séparateur de date */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
              }}>
                <div style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  textTransform: 'capitalize',
                }}>
                  {formatDate(date)}
                </div>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
              </div>

              {/* Cartes du jour */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {events.map(ev => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        borderRadius: '1rem',
        backgroundColor: 'rgba(13, 148, 136, 0.06)',
        border: '1px solid rgba(13, 148, 136, 0.2)',
        textAlign: 'center',
      }}>
        <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Vous organisez un événement ?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Référencez-le gratuitement pour toucher toute la communauté d'Île-de-France.
        </p>
        <Link href="/contact?type=evenement" className="btn btn-primary" style={{ textDecoration: 'none' }}>Ajouter mon événement</Link>
      </div>
    </div>
  );
}

// ============================================================
// Composant carte événement
// ============================================================
function EventCard({ event }: { event: Event }) {
  const color = EVENT_CATEGORY_COLORS[event.category];
  const past = !isUpcoming(event.date);

  return (
    <div className="card" style={{
      padding: 0,
      display: 'flex',
      overflow: 'hidden',
      opacity: past ? 0.65 : 1,
      flexDirection: 'row',
    }}>
      {/* Bande couleur gauche */}
      <div style={{ width: '5px', backgroundColor: color, flexShrink: 0 }} />

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

        {/* Badges top */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            backgroundColor: color + '18',
            color: color,
            padding: '0.15rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontWeight: 700,
          }}>
            {EVENT_CATEGORY_LABELS[event.category]}
          </span>
          <span style={{
            backgroundColor: event.format === 'enligne' ? '#dbeafe' : '#f5f5f4',
            color: event.format === 'enligne' ? '#2563eb' : 'var(--text-secondary)',
            padding: '0.15rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.72rem',
          }}>
            {event.format === 'enligne' ? '💻 En ligne' : '📍 Présentiel'}
          </span>
          <span style={{
            backgroundColor: event.isFree ? '#dcfce7' : '#fef3c7',
            color: event.isFree ? '#16a34a' : '#b45309',
            padding: '0.15rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontWeight: 600,
          }}>
            {event.isFree ? 'Gratuit' : event.price}
          </span>
          {past && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>Passé</span>
          )}
        </div>

        {/* Titre */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
          {event.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
          {event.description}
        </p>

        {/* Infos pratiques */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <Clock size={13} color={color} />
            {event.timeStart}{event.timeEnd ? ` → ${event.timeEnd}` : ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <MapPin size={13} color={color} />
            {event.location}, <strong>{event.city}</strong>
            {event.department !== '00' && <span style={{ color: color, fontWeight: 600 }}> ({event.department})</span>}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Par <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{event.organizer}</span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {event.tags.map(tag => (
            <span key={tag} style={{
              backgroundColor: '#f5f5f4',
              color: 'var(--text-secondary)',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
            }}>
              #{tag}
            </span>
          ))}
        </div>

      </div>

      {/* Bouton inscription */}
      {event.registrationUrl && !past && (
        <div style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1rem', borderLeft: '1px solid var(--border-color)' }}>
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            S'inscrire <ExternalLink size={13} />
          </a>
        </div>
      )}
    </div>
  );
}
