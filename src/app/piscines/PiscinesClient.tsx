'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Waves, MapPin, Clock, Search, AlertTriangle, CheckCircle, ExternalLink, Phone } from 'lucide-react';
import DeptFilter from '@/components/DeptFilter';
import PageHeader from '@/components/PageHeader';
import type { PiscineSheet } from '@/lib/sheets';

type PiscineType = 'municipale' | 'privee' | 'associative';

const TYPE_FILTERS: { key: PiscineType | 'all'; label: string }[] = [
  { key: 'all', label: '🌐 Toutes' },
  { key: 'municipale', label: '🏛️ Municipales' },
  { key: 'privee', label: '🏊 Privées' },
  { key: 'associative', label: '🤝 Associatives' },
];

const ACCENT = '#c9973a';

const JOUR_COLORS: Record<string, string> = {
  Lundi: '#6366f1', Mardi: '#c9973a', Mercredi: '#c9973a',
  Jeudi: '#d4a853', Vendredi: '#f59e0b', Samedi: '#ef4444', Dimanche: '#c9973a',
  'Tous les jours': '#c9973a',
  'Lundi & Jeudi': '#c9973a',
};

function getJourColor(jour: string): string {
  return JOUR_COLORS[jour] ?? '#6b7280';
}

export default function PiscinesClient({ piscines }: { piscines: PiscineSheet[] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<PiscineType | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState('Tout');
  const [confirmedOnly, setConfirmedOnly] = useState(false);

  const filtered = piscines.filter(p => {
    const q = search.toLowerCase();
    return (typeFilter === 'all' || p.type === typeFilter) &&
      (deptFilter === 'Tout' || p.department === deptFilter) &&
      (!confirmedOnly || p.confirmed) &&
      (!q || p.name.toLowerCase().includes(q) || p.ville.toLowerCase().includes(q));
  });

  const sorted = [...filtered].sort((a, b) => {
    if (b.confirmed !== a.confirmed) return b.confirmed ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <PageHeader title="Piscines Burkini" description="Créneaux réservés burkini et maillots couvrants en Île-de-France." color="#a87830" emoji="🏊" />
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>

        {/* Alertes importantes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.875rem 1rem', backgroundColor: '#fffbeb', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#78350f', borderLeft: '3px solid #f59e0b', display: 'flex', gap: '0.5rem' }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span><strong>Toujours appeler avant de vous déplacer.</strong> Les créneaux peuvent être modifiés, suspendus ou annulés sans préavis.</span>
          </div>
          <div style={{ padding: '0.875rem 1rem', backgroundColor: '#f0fff8', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#8a6025', borderLeft: '3px solid #d4a853', display: 'flex', gap: '0.5rem' }}>
            <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>Les fiches <strong>✅ Confirmées</strong> ont été vérifiées récemment.</span>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
          {TYPE_FILTERS.map(f => {
            const isActive = typeFilter === f.key;
            return (
              <button key={f.key} onClick={() => setTypeFilter(f.key)}
                style={{ padding: '0.4rem 0.9rem', borderRadius: '999px', border: isActive ? `2px solid ${ACCENT}` : '1.5px solid var(--border-color)', backgroundColor: isActive ? ACCENT : 'white', color: isActive ? 'white' : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                {f.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Ville, nom..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.3rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <DeptFilter value={deptFilter} onChange={setDeptFilter} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
            <input type="checkbox" checked={confirmedOnly} onChange={e => setConfirmedOnly(e.target.checked)} style={{ accentColor: ACCENT }} />
            ✅ Confirmées uniquement
          </label>
        </div>

        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          <strong style={{ color: 'var(--text-primary)' }}>{sorted.length}</strong> piscine{sorted.length > 1 ? 's' : ''} trouvée{sorted.length > 1 ? 's' : ''}
        </p>

        {/* Cards — grille 3 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {sorted.map(p => (
            <div key={p.id} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e7e5e4',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              {/* Header coloré */}
              <div style={{
                background: p.confirmed
                  ? 'linear-gradient(135deg, #f0fdf410, #fdfbf008)'
                  : 'linear-gradient(135deg, #fffbeb10, #fef3c708)',
                borderBottom: `3px solid ${p.confirmed ? '#d4a853' : '#f59e0b'}`,
                padding: '1rem 1.1rem 0.875rem',
              }}>
                {/* Badges */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                  {p.confirmed
                    ? <span style={{ backgroundColor: '#fdfbf0', color: '#8a6025', padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}><CheckCircle size={9} />Confirmé</span>
                    : <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}><AlertTriangle size={9} />À vérifier</span>
                  }
                  <span style={{ backgroundColor: '#f0f9ff', color: '#8a6025', padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 600 }}>
                    {p.type === 'municipale' ? '🏛️ Municipale' : p.type === 'privee' ? '🏊 Privée' : '🤝 Associative'}
                  </span>
                </div>

                {/* Nom + localisation */}
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.25rem', lineHeight: 1.3, color: '#1c1917' }}>{p.name}</h3>
                <p style={{ fontSize: '0.75rem', color: '#78716c', margin: 0, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <MapPin size={11} /> {p.ville} ({p.department})
                  {p.tarif && <span style={{ marginLeft: '0.5rem', color: '#c9973a', fontWeight: 600 }}>· {p.tarif}</span>}
                </p>
              </div>

              {/* Corps */}
              <div style={{ padding: '0.875rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.78rem', color: '#78716c', lineHeight: 1.5, margin: 0,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                } as React.CSSProperties}>{p.description}</p>

                {/* Créneaux */}
                {p.creneaux.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={10} />Créneaux burkini
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {p.creneaux.slice(0, 3).map((c, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: `${getJourColor(c.jour)}18`, color: getJourColor(c.jour), border: `1px solid ${getJourColor(c.jour)}40`, padding: '1px 8px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {c.jour}
                          </span>
                          <span style={{ fontWeight: 600, fontSize: '0.75rem', color: '#1c1917' }}>{c.horaire}</span>
                        </div>
                      ))}
                      {p.creneaux.length > 3 && (
                        <span style={{ fontSize: '0.68rem', color: '#a8a29e' }}>+{p.creneaux.length - 3} autres créneaux</span>
                      )}
                    </div>
                  </div>
                )}

                {p.note && (
                  <div style={{ backgroundColor: '#fffbeb', borderLeft: `2px solid #f59e0b`, padding: '0.35rem 0.6rem', borderRadius: '0 4px 4px 0', fontSize: '0.72rem', color: '#78350f' }}>
                    {p.note}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {p.tags.slice(0, 4).map(tag => (
                    <span key={tag} style={{ backgroundColor: '#f5f5f4', color: '#78716c', padding: '1px 7px', borderRadius: '4px', fontSize: '0.68rem' }}>#{tag}</span>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div style={{ padding: '0 1.1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {p.phone && (
                  <a href={`tel:${p.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', backgroundColor: ACCENT, color: 'white', padding: '0.55rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                    <Phone size={12} /> Appeler
                  </a>
                )}
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', border: '1px solid #e7e5e4', padding: '0.45rem', borderRadius: '8px', fontSize: '0.75rem', color: '#57534e', textDecoration: 'none' }}>
                      <ExternalLink size={11} /> Site
                    </a>
                  )}
                  {p.maps && (
                    <a href={p.maps} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', border: '1px solid #e7e5e4', padding: '0.45rem', borderRadius: '8px', fontSize: '0.75rem', color: '#57534e', textDecoration: 'none' }}>
                      <MapPin size={11} /> Maps
                    </a>
                  )}
                  {!p.phone && !p.website && !p.maps && (
                    <Link href="/contact?type=piscine" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.45rem', borderRadius: '8px', border: '1px solid #e7e5e4', fontSize: '0.75rem', color: '#78716c', textDecoration: 'none' }}>
                      Infos
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: '2.5rem', padding: '1.75rem', borderRadius: '1rem', backgroundColor: `${ACCENT}06`, border: `1px solid ${ACCENT}25`, textAlign: 'center' }}>
          <Waves size={28} color={ACCENT} style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Vous connaissez un créneau burkini non listé ?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
            Aidez la communauté ! Signalez une piscine ou corrigez une info incorrecte.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact?type=piscine" className="btn btn-primary" style={{ backgroundColor: ACCENT, textDecoration: 'none' }}>Ajouter une piscine</Link>
            <Link href="/contact?type=correction" className="btn btn-outline" style={{ textDecoration: 'none' }}>Corriger une info</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
