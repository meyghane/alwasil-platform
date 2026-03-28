'use client';

import { useState } from 'react';
import { Waves, MapPin, Clock, Search, AlertTriangle, CheckCircle, ExternalLink, Phone } from 'lucide-react';
import { piscines, type PiscineType } from '@/data/piscines';
import DeptFilter from '@/components/DeptFilter';

const TYPE_FILTERS: { key: PiscineType | 'all'; label: string }[] = [
  { key: 'all', label: '🌐 Toutes' },
  { key: 'municipale', label: '🏛️ Municipales' },
  { key: 'privee', label: '🏊 Privées' },
  { key: 'associative', label: '🤝 Associatives' },
];

const ACCENT = '#0ea5e9'; // sky-500

const JOUR_COLORS: Record<string, string> = {
  Lundi: '#6366f1', Mardi: '#8b5cf6', Mercredi: '#0ea5e9',
  Jeudi: '#10b981', Vendredi: '#f59e0b', Samedi: '#ef4444', Dimanche: '#059669',
  'Tous les jours': '#0d9488',
  'Lundi & Jeudi': '#8b5cf6',
};

function getJourColor(jour: string): string {
  return JOUR_COLORS[jour] ?? '#6b7280';
}

export default function PiscinesPage() {
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
    return (b.rating ?? 0) - (a.rating ?? 0);
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Waves size={28} color={ACCENT} />
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Piscines — Créneaux Burkini</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Piscines d&apos;Île-de-France acceptant le burkini et maillots couvrants. Créneaux dédiés ou accueil inclusif toute la semaine.
        </p>
      </div>

      {/* Alertes importantes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '0.875rem 1rem', backgroundColor: '#fffbeb', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#78350f', borderLeft: '3px solid #f59e0b', display: 'flex', gap: '0.5rem' }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span><strong>Toujours appeler avant de vous déplacer.</strong> Les créneaux peuvent être modifiés, suspendus ou annulés sans préavis, surtout en intersaison. Les fiches marquées ⚠️ sont à vérifier impérativement.</span>
        </div>
        <div style={{ padding: '0.875rem 1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#065f46', borderLeft: '3px solid #10b981', display: 'flex', gap: '0.5rem' }}>
          <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>Les fiches <strong>✅ Confirmées</strong> ont été vérifiées récemment (appel ou visite). Date de vérification indiquée sur chaque fiche.</span>
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

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sorted.map(p => (
          <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    {p.confirmed
                      ? <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}><CheckCircle size={10} style={{ display: 'inline', marginRight: '2px' }} />Confirmé — {p.lastVerified}</span>
                      : <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}><AlertTriangle size={10} style={{ display: 'inline', marginRight: '2px' }} />À vérifier</span>
                    }
                    <span style={{ backgroundColor: '#f0f9ff', color: '#0369a1', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                      {p.type === 'municipale' ? '🏛️ Municipale' : p.type === 'privee' ? '🏊 Privée' : '🤝 Associative'}
                    </span>
                    {p.rating && (
                      <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                        ★ <strong style={{ color: 'var(--text-primary)' }}>{p.rating}</strong>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}> ({p.reviews})</span>
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem', lineHeight: 1.2 }}>{p.name}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={11} style={{ display: 'inline' }} /> {p.adresse}, {p.ville} ({p.department})
                    {p.tarif && <span style={{ marginLeft: '0.75rem', color: '#059669', fontWeight: 600 }}>💰 {p.tarif}</span>}
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.875rem' }}>{p.description}</p>

              {/* Créneaux */}
              <div style={{ marginBottom: '0.875rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />Créneaux burkini
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {p.creneaux.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <span style={{ backgroundColor: `${getJourColor(c.jour)}18`, color: getJourColor(c.jour), border: `1px solid ${getJourColor(c.jour)}40`, padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {c.jour}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{c.horaire}</span>
                      {c.info && <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{c.info}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              {p.note && (
                <div style={{ backgroundColor: p.confirmed ? '#fffbeb' : '#fff1f2', borderLeft: `3px solid ${p.confirmed ? '#f59e0b' : '#ef4444'}`, padding: '0.4rem 0.6rem', borderRadius: '0 4px 4px 0', fontSize: '0.75rem', color: p.confirmed ? '#78350f' : '#9f1239', marginBottom: '0.875rem' }}>
                  {p.note}
                </div>
              )}

              {/* Tags */}
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                {p.tags.map(tag => (
                  <span key={tag} style={{ backgroundColor: '#f5f5f4', color: 'var(--text-secondary)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem' }}>#{tag}</span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {p.phone && (
                  <a href={`tel:${p.phone}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: ACCENT, color: 'white', padding: '0.45rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                    <Phone size={13} /> Appeler pour confirmer
                  </a>
                )}
                {p.website && (
                  <a href={p.website} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', border: '1px solid var(--border-color)', padding: '0.45rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    <ExternalLink size={13} /> Site
                  </a>
                )}
                {p.maps && (
                  <a href={p.maps} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', border: '1px solid var(--border-color)', padding: '0.45rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    <MapPin size={13} /> Itinéraire
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA signalement */}
      <div style={{ marginTop: '2.5rem', padding: '1.75rem', borderRadius: '1rem', backgroundColor: `${ACCENT}06`, border: `1px solid ${ACCENT}25`, textAlign: 'center' }}>
        <Waves size={28} color={ACCENT} style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Vous connaissez un créneau burkini non listé ?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
          Aidez la communauté ! Signalez une piscine ou corrigez une info incorrecte.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ backgroundColor: ACCENT }}>Signaler une piscine</button>
          <button className="btn btn-outline">Corriger une info</button>
        </div>
      </div>
    </div>
  );
}
