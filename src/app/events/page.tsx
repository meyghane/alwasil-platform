'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, MapPin, Clock, ExternalLink, Plus, User, Tag } from 'lucide-react';
import {
  allEvents,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_COLORS,
  type Event,
  type EventCategory,
} from '@/data/events';
import DeptFilter from '@/components/DeptFilter';
import PageHeader from '@/components/PageHeader';

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

  // Compteurs par département
  const deptCounts: Record<string, number> = {};
  allEvents.filter(e => isUpcoming(e.date)).forEach(e => {
    deptCounts[e.department] = (deptCounts[e.department] ?? 0) + 1;
  });

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
        color="#0d9488" 
        emoji="📅" 
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

        {/* Results */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#a8a29e' }}>
            <Calendar size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Aucun événement trouvé</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Essayez de modifier vos filtres de recherche.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {Object.entries(grouped).map(([date, events]) => (
              <div key={date}>
                {/* Date Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    color: '#1c1917',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    textTransform: 'capitalize'
                  }}>
                    {formatDate(date)}
                  </div>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e7e5e4' }} />
                </div>

                {/* Events List */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {events.map(ev => (
                    <EventRow key={ev.id} event={ev} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop: '5rem',
          padding: '3rem 2rem',
          borderRadius: '16px',
          backgroundColor: '#f0fdfa',
          border: '1px solid #ccfbf1',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#134e4a' }}>Vous organisez un événement ?</h3>
          <p style={{ color: '#0d9488', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '500px', marginInline: 'auto' }}>
            Référencez vos conférences, séminaires ou maraudes gratuitement sur Al-Wasil.
          </p>
          <Link href="/contact?type=evenement" className="btn btn-primary" style={{ 
            textDecoration: 'none',
            padding: '0.75rem 2rem',
            backgroundColor: '#0d9488',
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

function EventRow({ event }: { event: Event }) {
  const color = EVENT_CATEGORY_COLORS[event.category];
  const past = !isUpcoming(event.date);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '1.5rem 0',
      borderBottom: '1px solid #f5f5f4',
      opacity: past ? 0.5 : 1,
      gap: '2rem',
    }}>
      {/* Time column */}
      <div style={{ width: '90px', flexShrink: 0 }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1c1917' }}>
          {event.timeStart}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#78716c', marginTop: '2px' }}>
          {event.timeEnd || 'Fin variable'}
        </div>
      </div>

      {/* Content column */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: '#1c1917' }}>
            {event.title}
          </h3>
          <span style={{ 
            fontSize: '0.65rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            color: color,
            backgroundColor: color + '12',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            {EVENT_CATEGORY_LABELS[event.category]}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem', color: '#78716c', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} color="#a8a29e" />
            <span style={{ fontWeight: 500, color: '#44403c' }}>{event.city}</span> 
            {event.department !== '00' && <span>({event.department})</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={15} color="#a8a29e" />
            {event.organizer}
          </div>
          {event.isFree ? (
            <div style={{ color: '#0d9488', fontWeight: 600 }}>Gratuit</div>
          ) : (
            <div style={{ color: '#b45309', fontWeight: 600 }}>{event.price}</div>
          )}
        </div>
      </div>

      {/* Action column */}
      <div style={{ flexShrink: 0 }}>
        {event.registrationUrl && !past ? (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '0.875rem', 
              color: 'white',
              backgroundColor: '#1c1917',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
          >
            S'inscrire <ExternalLink size={15} />
          </a>
        ) : past ? (
          <span style={{ fontSize: '0.8rem', color: '#a8a29e', fontWeight: 500 }}>Événement passé</span>
        ) : null}
      </div>
    </div>
  );
}
