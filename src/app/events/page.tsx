'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Clock, ExternalLink, Plus } from 'lucide-react';
import type { Evenement } from '@/lib/sheets';
import DeptFilter from '@/components/DeptFilter';

const CATEGORIES = [
  { key: 'all', label: 'Tout' }, { key: 'conference', label: 'Conférence' },
  { key: 'maraude', label: 'Maraude' }, { key: 'cours', label: 'Cours' },
  { key: 'iftar', label: 'Iftar' }, { key: 'webinaire', label: 'Webinaire' },
  { key: 'jeunesse', label: 'Jeunesse' }, { key: 'collecte', label: 'Collecte' },
];

const CATEGORY_LABELS: Record<string, string> = {
  conference: 'Conférence', maraude: 'Maraude', cours: 'Cours / Formation',
  iftar: 'Iftar solidaire', webinaire: 'Webinaire', jeunesse: 'Jeunesse',
  famille: 'Famille', collecte: 'Collecte', autre: 'Autre',
};

const CATEGORY_COLORS: Record<string, string> = {
  conference: '#6366f1', maraude: '#ef4444', cours: '#0d9488',
  iftar: '#f59e0b', webinaire: '#3b82f6', jeunesse: '#10b981',
  famille: '#ec4899', collecte: '#f97316', autre: '#6b7280',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function groupByDate(events: Evenement[]): Record<string, Evenement[]> {
  return events.reduce((acc, e) => {
    const key = e.date_debut.split('T')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {} as Record<string, Evenement[]>);
}

function EventCard({ e }: { e: Evenement }) {
  const color = CATEGORY_COLORS[e.categorie] || '#6b7280';
  return (
    <div style={{ background: 'white', borderLeft: `4px solid ${color}`, borderRadius: '0 12px 12px 0', border: `1px solid #e5e7eb`, borderLeftColor: color, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ background: color, color: 'white', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            {CATEGORY_LABELS[e.categorie] || e.categorie}
          </span>
          <span style={{ background: e.format === 'enligne' ? '#dbeafe' : '#f3f4f6', color: e.format === 'enligne' ? '#1d4ed8' : '#374151', padding: '2px 10px', borderRadius: 20, fontSize: 12 }}>
            {e.format === 'enligne' ? '🖥 En ligne' : '📍 Présentiel'}
          </span>
          {e.gratuit
            ? <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Gratuit</span>
            : e.prix && <span style={{ background: '#fef9c3', color: '#854d0e', padding: '2px 10px', borderRadius: 20, fontSize: 12 }}>{e.prix}</span>
          }
        </div>
        <h3 style={{ fontWeight: 700, fontSize: 18, margin: '0 0 6px', color: '#111' }}>{e.titre}</h3>
        {e.description && <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, margin: '0 0 10px' }}>{e.description}</p>}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: '#6b7280', fontSize: 13 }}>
          {(e.heure_debut || e.heure_fin) && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} /> {e.heure_debut}{e.heure_fin ? ` → ${e.heure_fin}` : ''}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={13} /> {e.lieu || e.ville}{e.departement ? `, ${e.ville} (${e.departement})` : ''}
          </span>
          {e.organisateur && <span>Par <strong>{e.organisateur}</strong></span>}
        </div>
        {e.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {e.tags.map(t => <span key={t} style={{ color: '#6b7280', fontSize: 12 }}>#{t}</span>)}
          </div>
        )}
      </div>
      {e.url_inscription && (
        <a href={e.url_inscription} target="_blank" rel="noopener noreferrer"
          style={{ background: '#0d9488', color: 'white', padding: '10px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
          S&apos;inscrire <ExternalLink size={13} />
        </a>
      )}
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedDept, setSelectedDept] = useState('Tout');

  useEffect(() => {
    fetch('/api/evenements')
      .then(r => r.json())
      .then(d => { setEvents(d.data || []); setLoading(false); })
      .catch(() => { setError('Impossible de charger les événements.'); setLoading(false); });
  }, []);

  const filtered = events.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.titre.toLowerCase().includes(q) || e.organisateur.toLowerCase().includes(q) || e.ville.toLowerCase().includes(q);
    const matchCat = selectedCat === 'all' || e.categorie === selectedCat;
    const matchDept = selectedDept === 'Tout' || e.departement === selectedDept;
    return matchSearch && matchCat && matchDept;
  });

  const grouped = groupByDate(filtered);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Calendar size={32} color="#f59e0b" /> Événements — Liqa (لِقَاء)
          </h1>
          <p style={{ color: '#6b7280', marginTop: 8 }}>
            {loading ? 'Chargement...' : `${filtered.length} événement${filtered.length > 1 ? 's' : ''} à venir`}
          </p>
        </div>
        <a href="mailto:al-wasil@hotmail.com?subject=Proposer un événement"
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0d9488', color: 'white', padding: '12px 20px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          <Plus size={16} /> Proposer un événement
        </a>
      </div>

      {/* Recherche */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input type="text" placeholder="Rechercher un événement, une ville, un organisateur..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 16px 14px 46px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* Filtres */}
      <DeptFilter selected={selectedDept} onChange={setSelectedDept} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0 32px' }}>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setSelectedCat(c.key)}
            style={{ padding: '8px 18px', borderRadius: 24, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: selectedCat === c.key ? '#f59e0b' : '#f3f4f6', color: selectedCat === c.key ? 'white' : '#374151' }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {loading && <p style={{ textAlign: 'center', color: '#9ca3af', padding: 48 }}>Chargement des événements...</p>}
      {error && <p style={{ textAlign: 'center', color: '#ef4444', padding: 48 }}>{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9ca3af', padding: 48 }}>Aucun événement trouvé.</p>
      )}
      {!loading && !error && sortedDates.map(date => (
        <div key={date} style={{ marginBottom: 32 }}>
          <div style={{ background: '#0d9488', color: 'white', display: 'inline-block', padding: '6px 18px', borderRadius: 20, fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            {formatDate(date)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {grouped[date].map(e => <EventCard key={e.id} e={e} />)}
          </div>
        </div>
      ))}
    </main>
  );
}
