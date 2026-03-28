'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, Search, MapPin, Star, Globe, Phone, Clock, Package, Truck } from 'lucide-react';
import {
  librairies,
  SPECIALITE_LABELS,
  type LibrairieSpecialite,
  type LibrairieType,
} from '@/data/librairies';
import DeptFilter from '@/components/DeptFilter';

const TYPE_FILTERS: { key: LibrairieType | 'all'; label: string }[] = [
  { key: 'all', label: '🌐 Toutes' },
  { key: 'physique', label: '🏪 Physiques' },
  { key: 'en-ligne', label: '💻 En ligne' },
  { key: 'mixte', label: '🔀 Physique + Site' },
];

const SPECIALITE_FILTERS: { key: LibrairieSpecialite | 'all'; label: string }[] = [
  { key: 'all', label: 'Toutes spécialités' },
  { key: 'coran-tafsir', label: '📖 Coran & Tafsir' },
  { key: 'arabe', label: '🔤 Langue arabe' },
  { key: 'enfants', label: '👶 Enfants' },
  { key: 'livres-francais', label: '🇫🇷 Livres français' },
  { key: 'fiqh', label: '⚖️ Fiqh' },
  { key: 'spiritualite', label: '🌙 Spiritualité' },
  { key: 'vetements', label: '👘 Vêtements' },
  { key: 'accessoires', label: '📿 Accessoires' },
];

const ACCENT = '#7c3aed'; // violet — couleur librairies

export default function LibrairiePage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<LibrairieType | 'all'>('all');
  const [specialiteFilter, setSpecialiteFilter] = useState<LibrairieSpecialite | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState('Tout');
  const [livraisonOnly, setLivraisonOnly] = useState(false);

  const filtered = librairies.filter(l => {
    const q = search.toLowerCase();
    return (typeFilter === 'all' || l.type === typeFilter) &&
      (specialiteFilter === 'all' || l.specialites.includes(specialiteFilter)) &&
      (deptFilter === 'Tout' || l.department === deptFilter) &&
      (!livraisonOnly || l.livraison) &&
      (!q || l.name.toLowerCase().includes(q) || l.ville.toLowerCase().includes(q) || l.tags.some(t => t.includes(q)));
  });

  const sorted = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <BookOpen size={28} color={ACCENT} />
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Librairies islamiques — Île-de-France</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Toutes les librairies islamiques d&apos;Île-de-France : livres, Corans, manuels d&apos;arabe, vêtements et accessoires.
          Bientôt étendu à toute la France.
        </p>
      </div>

      {/* Bandeau info */}
      <div style={{ marginBottom: '1.5rem', padding: '0.875rem 1rem', backgroundColor: `${ACCENT}08`, borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: `3px solid ${ACCENT}`, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <span>📍</span>
        <span>
          Cette liste couvre actuellement l&apos;Île-de-France. Les prochains batchs couvriront PACA, Rhône-Alpes, Grand-Est…
          Vous connaissez une librairie non listée ? <strong style={{ color: ACCENT, cursor: 'pointer' }}>Signalez-la</strong>
        </span>
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

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Nom, ville, spécialité..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.4rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        {/* Dept */}
        <DeptFilter value={deptFilter} onChange={setDeptFilter} />

        {/* Livraison */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
          <input type="checkbox" checked={livraisonOnly} onChange={e => setLivraisonOnly(e.target.checked)} style={{ accentColor: ACCENT }} />
          <Truck size={13} /> Livraison disponible
        </label>
      </div>

      {/* Spécialité filter */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {SPECIALITE_FILTERS.map(f => {
          const isActive = specialiteFilter === f.key;
          return (
            <button key={f.key} onClick={() => setSpecialiteFilter(f.key)}
              style={{ padding: '0.3rem 0.7rem', borderRadius: '6px', border: isActive ? `2px solid ${ACCENT}` : '1.5px solid var(--border-color)', backgroundColor: isActive ? `${ACCENT}15` : 'transparent', color: isActive ? ACCENT : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
              {f.label}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        <strong style={{ color: 'var(--text-primary)' }}>{sorted.length}</strong> librairie{sorted.length > 1 ? 's' : ''} trouvée{sorted.length > 1 ? 's' : ''}
      </p>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
        {sorted.map(lib => (
          <div key={lib.id} className="card" style={{ padding: '1.25rem', borderTop: lib.featured ? `3px solid ${ACCENT}` : undefined }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  {lib.featured && (
                    <span style={{ backgroundColor: `${ACCENT}18`, color: ACCENT, padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>⭐ Référence</span>
                  )}
                  <span style={{ backgroundColor: lib.type === 'physique' ? '#f0fdf4' : lib.type === 'en-ligne' ? '#eff6ff' : '#fdf4ff', color: lib.type === 'physique' ? '#065f46' : lib.type === 'en-ligne' ? '#1e40af' : ACCENT, padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                    {lib.type === 'physique' ? '🏪 Physique' : lib.type === 'en-ligne' ? '💻 En ligne' : '🔀 Physique + Site'}
                  </span>
                  {lib.livraison && (
                    <span style={{ backgroundColor: '#f0fdf4', color: '#059669', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                      <Truck size={9} style={{ display: 'inline', marginRight: '2px' }} />Livraison
                    </span>
                  )}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2, marginBottom: '0.2rem' }}>{lib.name}</h3>
                {lib.rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                    <Star size={12} fill="#f59e0b" color="#f59e0b" />
                    <strong style={{ color: 'var(--text-primary)' }}>{lib.rating}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>({lib.reviews} avis)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Adresse + horaires */}
            {(lib.adresse || lib.ville) && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {lib.adresse && (
                  <span><MapPin size={11} style={{ display: 'inline' }} /> {lib.adresse}, {lib.ville} ({lib.department})</span>
                )}
                {!lib.adresse && <span><MapPin size={11} style={{ display: 'inline' }} /> {lib.ville}</span>}
                {lib.horaires && (
                  <span><Clock size={11} style={{ display: 'inline' }} /> {lib.horaires}
                    {lib.fermeture && <em style={{ color: '#ef4444', marginLeft: '0.3rem' }}>• {lib.fermeture}</em>}
                  </span>
                )}
              </div>
            )}

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.75rem' }}>{lib.description}</p>

            {/* Note spéciale */}
            {lib.note && (
              <div style={{ backgroundColor: '#fef9c3', borderLeft: '3px solid #f59e0b', padding: '0.4rem 0.6rem', borderRadius: '0 4px 4px 0', fontSize: '0.75rem', color: '#78350f', marginBottom: '0.75rem' }}>
                💡 {lib.note}
              </div>
            )}

            {/* Spécialités */}
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
              {lib.specialites.map(s => (
                <span key={s} style={{ backgroundColor: `${ACCENT}10`, color: ACCENT, padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600 }}>
                  {SPECIALITE_LABELS[s]}
                </span>
              ))}
            </div>

            {/* Langues */}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.875rem' }}>
              📚 Livres en : <strong>{lib.langues.join(', ')}</strong>
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {lib.website && lib.website !== '#' && (
                <a href={lib.website} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', backgroundColor: ACCENT, color: 'white', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                  <Globe size={13} /> Site web <ExternalLink size={11} />
                </a>
              )}
              {lib.maps && lib.maps !== '#' && (
                <a href={lib.maps} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  <MapPin size={13} />
                </a>
              )}
              {lib.phone && (
                <a href={`tel:${lib.phone}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  <Phone size={13} />
                </a>
              )}
              {lib.instagram && lib.instagram !== '#' && (
                <a href={lib.instagram} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.78rem', color: '#e1306c', textDecoration: 'none', fontWeight: 600 }}>
                  📷 Insta
                </a>
              )}
              {!lib.website && !lib.phone && !lib.instagram && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Coordonnées non disponibles — vérifiez Google Maps</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <BookOpen size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p>Aucune librairie ne correspond à vos critères.</p>
        </div>
      )}

      {/* CTA Proposer */}
      <div style={{ marginTop: '2.5rem', padding: '1.75rem', borderRadius: '1rem', backgroundColor: `${ACCENT}06`, border: `1px solid ${ACCENT}25`, textAlign: 'center' }}>
        <Package size={28} color={ACCENT} style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Vous connaissez une librairie non listée ?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
          Signalez-la en quelques clics. Vous gérez une librairie ? Réclamez votre fiche gratuitement.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact?type=librairie" className="btn btn-primary" style={{ backgroundColor: ACCENT, textDecoration: 'none' }}>Signaler une librairie</Link>
          <Link href="/contact?type=revendiquer-librairie" className="btn btn-outline" style={{ textDecoration: 'none' }}>Je gère cette librairie</Link>
        </div>
      </div>
    </div>
  );
}
