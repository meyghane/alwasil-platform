'use client';

import { useState } from 'react';
import { Heart, ExternalLink, Search, MapPin, Star, Video, Phone, Globe, CheckCircle } from 'lucide-react';
import { psyProfiles, hijamaProfiles, roqyaProfiles } from '@/data/sante';
import DeptFilter from '@/components/DeptFilter';

type Tab = 'psy' | 'hijama' | 'roqya';

const TABS: { key: Tab; label: string; count: number }[] = [
  { key: 'psy', label: '🧠 Psychologues & Thérapeutes', count: psyProfiles.length },
  { key: 'hijama', label: '🩸 Hijama', count: hijamaProfiles.length },
  { key: 'roqya', label: '📖 Roqya', count: roqyaProfiles.length },
];

const ACCENT = '#ec4899'; // rose-500 — couleur santé
const HIJAMA_COLOR = '#dc2626';
const ROQYA_COLOR = '#7c3aed';

function StarRating({ rating, reviews }: { rating?: number; reviews?: number }) {
  if (!rating) return null;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: '#f59e0b' }}>
      <Star size={13} fill="#f59e0b" />
      <strong style={{ color: 'var(--text-primary)' }}>{rating.toFixed(1)}</strong>
      {reviews && <span style={{ color: 'var(--text-secondary)' }}>({reviews} avis)</span>}
    </span>
  );
}

export default function SantePage() {
  const [tab, setTab] = useState<Tab>('psy');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('Tout');
  const [visioOnly, setVisioOnly] = useState(false);
  const [femmeOnly, setFemmeOnly] = useState(false);

  const filteredPsy = psyProfiles.filter(p => {
    const q = search.toLowerCase();
    return (deptFilter === 'Tout' || p.department === deptFilter) &&
      (!visioOnly || p.visio) &&
      (!femmeOnly || p.gender === 'f') &&
      (!q || p.name.toLowerCase().includes(q) || p.specialites.some(s => s.toLowerCase().includes(q)) || p.approche.some(a => a.toLowerCase().includes(q)));
  });

  const filteredHijama = hijamaProfiles.filter(h => {
    const q = search.toLowerCase();
    return (deptFilter === 'Tout' || h.department === deptFilter) &&
      (!femmeOnly || h.gender === 'f') &&
      (!q || h.name.toLowerCase().includes(q) || h.tags.some(t => t.includes(q)));
  });

  const filteredRoqya = roqyaProfiles.filter(r => {
    const q = search.toLowerCase();
    return (deptFilter === 'Tout' || r.department === deptFilter) &&
      (!visioOnly || r.visio) &&
      (!femmeOnly || r.gender === 'f') &&
      (!q || r.name.toLowerCase().includes(q) || r.tags.some(t => t.includes(q)));
  });

  const accentColor = tab === 'psy' ? ACCENT : tab === 'hijama' ? HIJAMA_COLOR : ROQYA_COLOR;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Heart size={28} color={ACCENT} />
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Santé — Shifa (شِفَاء)</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Praticiens de confiance orientés communauté : psychologues, hijama et roqya char&apos;iyya.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setSearch(''); }}
            style={{ padding: '0.75rem 1.25rem', border: 'none', borderBottom: tab === t.key ? `2px solid ${accentColor}` : '2px solid transparent', backgroundColor: 'transparent', color: tab === t.key ? accentColor : 'var(--text-secondary)', fontWeight: tab === t.key ? 700 : 400, fontSize: '0.88rem', cursor: 'pointer', marginBottom: '-2px', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <DeptFilter value={deptFilter} onChange={setDeptFilter} />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {tab !== 'hijama' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={visioOnly} onChange={e => setVisioOnly(e.target.checked)} style={{ accentColor }} />
            📹 Visio uniquement
          </label>
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={femmeOnly} onChange={e => setFemmeOnly(e.target.checked)} style={{ accentColor }} />
          🧕 Femmes uniquement
        </label>
      </div>

      {/* ─── PSYCHOLOGUES ─── */}
      {tab === 'psy' && (
        <>
          <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', backgroundColor: 'rgba(236,72,153,0.06)', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: `3px solid ${ACCENT}` }}>
            🧠 Ces praticiens ont une sensibilité particulière aux enjeux culturels et religieux musulmans. Ils ne proposent pas de thérapie islamique, mais comprennent votre contexte de vie.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
            {filteredPsy.map(p => (
              <div key={p.id} className="card" style={{ padding: '1.25rem' }}>
                {/* Header card */}
                <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '0.875rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: `${ACCENT}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', flexShrink: 0 }}>
                    {p.gender === 'f' ? '👩‍⚕️' : '👨‍⚕️'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, lineHeight: 1.2 }}>{p.name}</p>
                    <p style={{ fontSize: '0.78rem', color: ACCENT, fontWeight: 600, margin: '0.1rem 0' }}>{p.title}</p>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                      <StarRating rating={p.rating} reviews={p.reviews} />
                      {p.conventionné && (
                        <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.1rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>✅ Conventionné S{p.secteur}</span>
                      )}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.75rem' }}>{p.description}</p>

                {/* Spécialités */}
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                  {p.specialites.map(s => (
                    <span key={s} style={{ backgroundColor: `${ACCENT}12`, color: ACCENT, padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>{s}</span>
                  ))}
                </div>

                {/* Approche */}
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                  {p.approche.map(a => (
                    <span key={a} style={{ backgroundColor: '#f5f5f4', color: 'var(--text-secondary)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem' }}>{a}</span>
                  ))}
                </div>

                {/* Infos */}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.875rem' }}>
                  <span><MapPin size={11} style={{ display: 'inline' }} /> {p.location}</span>
                  <span style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {p.visio && <span style={{ color: '#3b82f6' }}><Video size={11} style={{ display: 'inline' }} /> Visio OK</span>}
                    {p.arabophone && <span>🗣️ Arabophone</span>}
                    {p.tariف && <span style={{ color: '#10b981', fontWeight: 600 }}>💰 {p.tariف}</span>}
                  </span>
                  <span>🌐 {p.langues.join(' · ')}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', backgroundColor: ACCENT, color: 'white', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                      Prendre RDV <ExternalLink size={12} />
                    </a>
                  )}
                  {p.contact && (
                    <a href={`tel:${p.contact}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                      <Phone size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredPsy.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <p>Aucun profil ne correspond à votre recherche.</p>
            </div>
          )}

          <div style={{ marginTop: '2.5rem', padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'rgba(236,72,153,0.05)', border: '1px solid rgba(236,72,153,0.2)', textAlign: 'center' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Vous êtes praticien·ne ?</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Référencez-vous gratuitement pour être visible de la communauté.</p>
            <button className="btn btn-primary" style={{ backgroundColor: ACCENT }}>Ajouter mon profil</button>
          </div>
        </>
      )}

      {/* ─── HIJAMA ─── */}
      {tab === 'hijama' && (
        <>
          <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', backgroundColor: 'rgba(220,38,38,0.06)', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: `3px solid ${HIJAMA_COLOR}` }}>
            🩸 La hijama (ventouses) est une médecine prophétique recommandée par le Prophète ﷺ. Choisissez toujours un praticien certifié utilisant du matériel stérile à usage unique.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredHijama.map(h => (
              <div key={h.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{h.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={11} style={{ display: 'inline' }} /> {h.location}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.7rem', backgroundColor: h.gender === 'f' ? '#fce7f3' : h.gender === 'm' ? '#eff6ff' : '#f0fdf4', color: h.gender === 'f' ? '#9d174d' : h.gender === 'm' ? '#1e40af' : '#065f46', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                      {h.gender === 'f' ? '🧕 Femmes' : h.gender === 'm' ? '👨 Hommes' : '👥 Mixte'}
                    </span>
                    {h.certifié && (
                      <span style={{ fontSize: '0.7rem', backgroundColor: '#d1fae5', color: '#065f46', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                        <CheckCircle size={10} style={{ display: 'inline', marginRight: '2px' }} />Certifié
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.75rem' }}>{h.description}</p>

                {h.certifOrg && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    📋 Certifié : <strong style={{ color: 'var(--text-primary)' }}>{h.certifOrg}</strong>
                  </p>
                )}

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.875rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span>🕐 {h.disponibilité}</span>
                  {h.tarif && <span style={{ color: HIJAMA_COLOR, fontWeight: 700 }}>💰 {h.tarif}</span>}
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                  {h.tags.map(tag => (
                    <span key={tag} style={{ backgroundColor: '#fee2e2', color: HIJAMA_COLOR, padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem' }}>#{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {h.instagram && (
                    <a href={h.instagram} target="_blank" rel="noopener noreferrer"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', backgroundColor: HIJAMA_COLOR, color: 'white', padding: '0.45rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                      Contacter <ExternalLink size={12} />
                    </a>
                  )}
                  {h.website && (
                    <a href={h.website} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', padding: '0.45rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                      <Globe size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── ROQYA ─── */}
      {tab === 'roqya' && (
        <>
          <div style={{ marginBottom: '0.75rem', padding: '0.875rem 1rem', backgroundColor: 'rgba(124,58,237,0.06)', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: `3px solid ${ROQYA_COLOR}` }}>
            📖 La roqya char&apos;iyya consiste en la récitation de versets coraniques et de doua&apos;s authentiques. Méfiez-vous des charlatans : aucun praticien sérieux ne demande de l&apos;argent pour soigner, ne vous demande vos vêtements/cheveux, ni ne pratique des rites non-islamiques.
          </div>
          <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', backgroundColor: '#fffbeb', borderRadius: '0.5rem', fontSize: '0.82rem', color: '#92400e', borderLeft: '3px solid #f59e0b' }}>
            ⚠️ <strong>Rappel :</strong> Un praticien de roqya sérieux ne demande jamais de grande somme d&apos;argent et ne vous demande pas de ramener des effets personnels. Don libre = signe de sérieux.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredRoqya.map(r => (
              <div key={r.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{r.name}</h3>
                    <p style={{ fontSize: '0.78rem', color: ROQYA_COLOR, fontWeight: 600, margin: 0 }}>{r.title}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.7rem', backgroundColor: r.gender === 'f' ? '#fce7f3' : '#eff6ff', color: r.gender === 'f' ? '#9d174d' : '#1e40af', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                      {r.gender === 'f' ? '🧕 Pour sœurs' : '👨 Hommes & Femmes'}
                    </span>
                    {r.visio && (
                      <span style={{ fontSize: '0.7rem', backgroundColor: '#eff6ff', color: '#3b82f6', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        <Video size={10} style={{ display: 'inline', marginRight: '2px' }} />Visio OK
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.75rem' }}>{r.description}</p>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span><MapPin size={11} style={{ display: 'inline' }} /> {r.location}</span>
                  <span>🕐 {r.disponibilité}</span>
                  <span>🌐 {r.langues.join(' · ')}</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>💚 {r.tarif}</span>
                  {r.école && <span>📚 Approche : {r.école}</span>}
                </div>

                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                  {r.tags.map(tag => (
                    <span key={tag} style={{ backgroundColor: `${ROQYA_COLOR}12`, color: ROQYA_COLOR, padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem' }}>#{tag}</span>
                  ))}
                </div>

                {r.contact && (
                  <a href={r.contact} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', backgroundColor: ROQYA_COLOR, color: 'white', padding: '0.45rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                    Prendre RDV <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
