'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, Globe, CheckCircle, Phone, ExternalLink } from 'lucide-react';
import type { Mosquee } from '@/lib/sheets';
import DeptFilter from '@/components/DeptFilter';

const COURS_LABELS: Record<string, string> = {
  coran: 'Coran', tajwid: 'Tajwid', arabe: 'Langue Arabe',
  'sciences-islamiques': 'Sciences Islamiques', fiqh: 'Fiqh',
  aqida: 'Aqida', tafsir: 'Tafsir', hadith: 'Hadith',
  sirah: 'Sîrah', enfants: 'Enfants', memorisation: 'Hifz',
};

const COURS_FILTERS = [
  { key: 'all', label: 'Tout' }, { key: 'coran', label: 'Coran' },
  { key: 'tajwid', label: 'Tajwid' }, { key: 'arabe', label: 'Langue Arabe' },
  { key: 'sciences-islamiques', label: 'Sciences Islamiques' },
  { key: 'memorisation', label: 'Hifz' }, { key: 'enfants', label: 'Enfants' },
];

function MosqueeCard({ m }: { m: Mosquee }) {
  return (
    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ background: '#6366f1', color: 'white', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Mosquée</span>
          {m.cours_format && (
            <span style={{ background: m.cours_format === 'distanciel' ? '#3b82f6' : '#6366f1', color: 'white', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              {m.cours_format === 'distanciel' ? 'En ligne' : m.cours_format === 'hybride' ? 'Hybride' : 'Présentiel'}
            </span>
          )}
        </div>
        {m.cours_verified && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontSize: 13, fontWeight: 600 }}>
            <CheckCircle size={14} /> Vérifié
          </div>
        )}
      </div>
      <div>
        <h3 style={{ fontWeight: 700, fontSize: 17, margin: 0, color: '#111' }}>{m.nom}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 13, marginTop: 4 }}>
          <MapPin size={13} /> {m.ville}{m.departement ? ` (${m.departement})` : ''}
        </div>
      </div>
      {m.cours_description && <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{m.cours_description}</p>}
      {m.cours_types.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {m.cours_types.map(c => (
            <span key={c} style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '2px 10px', borderRadius: 20, fontSize: 12 }}>
              {COURS_LABELS[c] || c}
            </span>
          ))}
        </div>
      )}
      {m.cours_audience.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {m.cours_audience.map(a => (
            <span key={a} style={{ background: '#fefce8', color: '#854d0e', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>{a}</span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
        {m.website && <a href={m.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0d9488', fontSize: 13, textDecoration: 'none' }}><Globe size={13} /> Site web</a>}
        {m.telephone && <a href={`tel:${m.telephone}`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 13, textDecoration: 'none' }}><Phone size={13} /> {m.telephone}</a>}
        {m.instagram && <a href={m.instagram} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#e1306c', fontSize: 13, textDecoration: 'none' }}><ExternalLink size={13} /> Instagram</a>}
        {m.facebook && <a href={m.facebook} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1877f2', fontSize: 13, textDecoration: 'none' }}><ExternalLink size={13} /> Facebook</a>}
      </div>
    </div>
  );
}

export default function EducationPage() {
  const [mosques, setMosques] = useState<Mosquee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCours, setSelectedCours] = useState('all');
  const [selectedDept, setSelectedDept] = useState('Tout');

  useEffect(() => {
    fetch('/api/mosques?courses=true')
      .then(r => r.json())
      .then(d => { setMosques(d.data || []); setLoading(false); })
      .catch(() => { setError('Impossible de charger les données.'); setLoading(false); });
  }, []);

  const filtered = mosques.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.nom.toLowerCase().includes(q) || m.ville.toLowerCase().includes(q) || m.cours_types.some(t => t.includes(q));
    const matchCours = selectedCours === 'all' || m.cours_types.includes(selectedCours);
    const matchDept = selectedDept === 'Tout' || m.departement === selectedDept;
    return matchSearch && matchCours && matchDept;
  });

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12 }}>
          <BookOpen size={32} color="#0d9488" /> Éducation &amp; Savoir — Ilm (عِلْم)
        </h1>
        <p style={{ color: '#6b7280', marginTop: 8 }}>
          {loading ? 'Chargement...' : `${filtered.length} mosquée${filtered.length > 1 ? 's' : ''} avec des cours`}
        </p>
      </div>
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input type="text" placeholder="Rechercher une mosquée, une ville, un cours..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 16px 14px 46px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
      </div>
      <DeptFilter selected={selectedDept} onChange={setSelectedDept} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0 24px' }}>
        {COURS_FILTERS.map(f => (
          <button key={f.key} onClick={() => setSelectedCours(f.key)}
            style={{ padding: '8px 18px', borderRadius: 24, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: selectedCours === f.key ? '#0d9488' : '#f3f4f6', color: selectedCours === f.key ? 'white' : '#374151' }}>
            {f.label}
          </button>
        ))}
      </div>
      {loading && <p style={{ textAlign: 'center', color: '#9ca3af', padding: 48 }}>Chargement des mosquées...</p>}
      {error && <p style={{ textAlign: 'center', color: '#ef4444', padding: 48 }}>{error}</p>}
      {!loading && !error && (
        <>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>{filtered.length} résultat{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>
          {filtered.length === 0
            ? <p style={{ textAlign: 'center', color: '#9ca3af', padding: 48 }}>Aucune mosquée trouvée avec ces filtres.</p>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>{filtered.map(m => <MosqueeCard key={m.id_osm} m={m} />)}</div>
          }
        </>
      )}
    </main>
  );
}
