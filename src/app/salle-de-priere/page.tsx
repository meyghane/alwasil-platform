'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Star, Droplets, Users, Clock, ChevronRight, Plus, Search } from 'lucide-react';
import {
  espacesPriere,
  PRIERE_LABELS,
  TYPE_LABELS,
  TYPE_COLORS,
  HORAIRES_PARIS,
  type Priere,
  type TypeLieu,
  type EspacePriere,
} from '@/data/priere-espaces';

const PRIERES: Priere[] = ['fajr', 'dhohr', 'asr', 'maghrib', 'icha'];
const TEAL = '#0d9488';

function getPexelsUrl(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop`;
}

function PlacesBar({ dispo, genre }: { dispo: { placesH: number; placesF: number; reservesH: number; reservesF: number }; genre: 'hommes' | 'femmes' | 'tous' }) {
  const items = [];
  if (genre !== 'femmes') {
    const libresH = dispo.placesH - dispo.reservesH;
    items.push(
      <div key="h" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
        <span style={{ color: '#64748b' }}>♂</span>
        <span style={{ fontWeight: 700, color: libresH > 0 ? '#16a34a' : '#dc2626' }}>{libresH}</span>
        <span style={{ color: 'var(--text-secondary)' }}>/ {dispo.placesH} libre{libresH !== 1 ? 's' : ''}</span>
      </div>
    );
  }
  if (genre !== 'hommes') {
    const libresF = dispo.placesF - dispo.reservesF;
    items.push(
      <div key="f" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
        <span style={{ color: '#db2777' }}>♀</span>
        <span style={{ fontWeight: 700, color: libresF > 0 ? '#16a34a' : '#dc2626' }}>{libresF}</span>
        <span style={{ color: 'var(--text-secondary)' }}>/ {dispo.placesF} libre{libresF !== 1 ? 's' : ''}</span>
      </div>
    );
  }
  return <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>{items}</div>;
}

function PrieresPills({ espace, selectedPriere, genre }: { espace: EspacePriere; selectedPriere: Priere | 'toutes'; genre: 'hommes' | 'femmes' | 'tous' }) {
  return (
    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
      {PRIERES.map(p => {
        const dispo = espace.prieres[p];
        if (!dispo) return (
          <span key={p} title={PRIERE_LABELS[p]} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.68rem', backgroundColor: '#f5f5f4', color: '#a8a29e', fontWeight: 500 }}>
            {PRIERE_LABELS[p]}
          </span>
        );
        const libresH = dispo.placesH - dispo.reservesH;
        const libresF = dispo.placesF - dispo.reservesF;
        const libre = genre === 'femmes' ? libresF > 0 : genre === 'hommes' ? libresH > 0 : (libresH > 0 || libresF > 0);
        const isSelected = selectedPriere === p;
        return (
          <span key={p} title={`${PRIERE_LABELS[p]} — ${HORAIRES_PARIS[p]}`} style={{
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.68rem',
            fontWeight: isSelected ? 700 : 500,
            backgroundColor: isSelected ? TEAL : libre ? '#dcfce7' : '#fee2e2',
            color: isSelected ? 'white' : libre ? '#16a34a' : '#dc2626',
            border: isSelected ? `1px solid ${TEAL}` : '1px solid transparent',
          }}>
            {PRIERE_LABELS[p]}
          </span>
        );
      })}
    </div>
  );
}

function EspaceCard({ espace, selectedPriere, genre }: { espace: EspacePriere; selectedPriere: Priere | 'toutes'; genre: 'hommes' | 'femmes' | 'tous' }) {
  const typeColor = TYPE_COLORS[espace.type];
  const dispoSelected = selectedPriere !== 'toutes' ? espace.prieres[selectedPriere] : null;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Photo */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={getPexelsUrl(espace.pexelsId)}
          alt={`Espace de prière — ${espace.quartier}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { (e.target as HTMLImageElement).src = `https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop`; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
        <span style={{ position: 'absolute', top: '0.65rem', left: '0.65rem', backgroundColor: typeColor, color: 'white', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
          {TYPE_LABELS[espace.type]}
        </span>
        {espace.entreeF && (
          <span style={{ position: 'absolute', top: '0.65rem', right: '0.65rem', backgroundColor: '#db2777', color: 'white', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
            ♀ Entrée séparée
          </span>
        )}
        <div style={{ position: 'absolute', bottom: '0.65rem', left: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={12} color="white" />
          <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 500 }}>{espace.quartier}, {espace.ville}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Host + rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{espace.prenom}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}> · Hôte</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem' }}>
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: 700 }}>{espace.rating}</span>
            <span style={{ color: 'var(--text-secondary)' }}>({espace.avis})</span>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          {espace.description}
        </p>

        {/* Features */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: espace.ablutions ? '#0d9488' : '#a8a29e', fontWeight: 500 }}>
            <Droplets size={13} /> {espace.ablutions ? 'Ablutions ✓' : 'Ablutions ✗'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#6366f1', fontWeight: 500 }}>
            <span style={{ fontSize: '0.8rem' }}>🕌</span> FissabiliLlah (gratuit)
          </span>
        </div>

        {/* Prières disponibles */}
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Prières disponibles
          </p>
          <PrieresPills espace={espace} selectedPriere={selectedPriere} genre={genre} />
        </div>

        {/* Places pour la prière sélectionnée */}
        {dispoSelected && (
          <div style={{ backgroundColor: '#f0fdfa', borderRadius: '10px', padding: '0.75rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: TEAL, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {selectedPriere !== 'toutes' ? `${PRIERE_LABELS[selectedPriere]} · ${HORAIRES_PARIS[selectedPriere]}` : 'Places disponibles'}
            </p>
            {/* Hommes */}
            {genre !== 'femmes' && (() => {
              const libres = dispoSelected.placesH - dispoSelected.reservesH;
              return (
                <div style={{ marginBottom: genre !== 'hommes' ? '0.6rem' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>♂ Hommes</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: libres > 0 ? '#16a34a' : '#dc2626' }}>
                      {libres > 0 ? `${libres} place${libres > 1 ? 's' : ''} libre${libres > 1 ? 's' : ''}` : 'Complet'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {Array.from({ length: dispoSelected.placesH }).map((_, i) => (
                      <div key={i} style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: i < dispoSelected.reservesH ? '#dc2626' : '#16a34a', opacity: i < dispoSelected.reservesH ? 0.8 : 1 }} title={i < dispoSelected.reservesH ? 'Réservé' : 'Libre'} />
                    ))}
                  </div>
                </div>
              );
            })()}
            {/* Femmes */}
            {genre !== 'hommes' && (() => {
              const libres = dispoSelected.placesF - dispoSelected.reservesF;
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>♀ Femmes</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: libres > 0 ? '#16a34a' : '#dc2626' }}>
                      {libres > 0 ? `${libres} place${libres > 1 ? 's' : ''} libre${libres > 1 ? 's' : ''}` : 'Complet'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {Array.from({ length: dispoSelected.placesF }).map((_, i) => (
                      <div key={i} style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: i < dispoSelected.reservesF ? '#dc2626' : '#db2777', opacity: i < dispoSelected.reservesF ? 0.5 : 0.85 }} title={i < dispoSelected.reservesF ? 'Réservé' : 'Libre'} />
                    ))}
                  </div>
                </div>
              );
            })()}
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', gap: '0.75rem' }}>
              <span>🟢 Libre</span><span style={{ opacity: 0.5 }}>🔴 Réservé</span>
            </p>
          </div>
        )}

        {/* CTA */}
        <Link href="/connexion" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem 1rem', backgroundColor: TEAL, color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', transition: 'opacity 0.15s' }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
          Réserver une place <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function SalleDePrierePage() {
  const [mode, setMode] = useState<'cherche' | 'propose'>('cherche');
  const [selectedPriere, setSelectedPriere] = useState<Priere | 'toutes'>('toutes');
  const [genre, setGenre] = useState<'hommes' | 'femmes' | 'tous'>('tous');
  const [deptFilter, setDeptFilter] = useState<string>('Tout');
  const [searchAddr, setSearchAddr] = useState('');

  const filtered = useMemo(() => {
    return espacesPriere.filter(e => {
      // Filtre département
      if (deptFilter !== 'Tout' && e.department !== deptFilter) return false;
      // Filtre prière disponible
      if (selectedPriere !== 'toutes') {
        const dispo = e.prieres[selectedPriere];
        if (!dispo) return false;
        if (genre === 'hommes' && dispo.placesH - dispo.reservesH <= 0) return false;
        if (genre === 'femmes' && dispo.placesF - dispo.reservesF <= 0) return false;
      }
      return true;
    });
  }, [selectedPriere, genre, deptFilter]);

  const DEPTS = [
    { code: 'Tout', label: 'Tout IDF' },
    { code: '75', label: 'Paris' },
    { code: '92', label: '92' },
    { code: '93', label: '93' },
    { code: '94', label: '94' },
    { code: '91', label: '91' },
    { code: '78', label: '78' },
    { code: '77', label: '77' },
    { code: '95', label: '95' },
  ];

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2rem' }}>🕌</span>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Where Salat</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: 1.5, margin: 0 }}>
              Des particuliers et commerçants ouvrent leur espace pour que tu puisses prier à l&apos;heure. <strong>Gratuit, FissabiliLlah.</strong> Trouve un espace près de toi ou propose le tien.
            </p>
          </div>
        </div>
      </div>

      {/* Toggle mode */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', backgroundColor: '#f5f5f4', borderRadius: '12px', padding: '0.25rem', width: 'fit-content' }}>
        <button onClick={() => setMode('cherche')} style={{
          padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.15s',
          backgroundColor: mode === 'cherche' ? 'white' : 'transparent',
          color: mode === 'cherche' ? TEAL : 'var(--text-secondary)',
          boxShadow: mode === 'cherche' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
        }}>
          🔍 Je cherche un lieu
        </button>
        <button onClick={() => setMode('propose')} style={{
          padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.15s',
          backgroundColor: mode === 'propose' ? 'white' : 'transparent',
          color: mode === 'propose' ? TEAL : 'var(--text-secondary)',
          boxShadow: mode === 'propose' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
        }}>
          🏠 Je propose mon lieu
        </button>
      </div>

      {/* ─── MODE CHERCHE ─── */}
      {mode === 'cherche' && (
        <>
          {/* Recherche adresse */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search size={17} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Entrez une adresse ou un quartier..."
              value={searchAddr}
              onChange={e => setSearchAddr(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Filtres */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {/* Prière */}
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Prière
              </p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(['toutes', ...PRIERES] as const).map(p => {
                  const label = p === 'toutes' ? 'Toutes' : `${PRIERE_LABELS[p]} · ${HORAIRES_PARIS[p]}`;
                  const isActive = selectedPriere === p;
                  return (
                    <button key={p} onClick={() => setSelectedPriere(p)} style={{
                      padding: '0.35rem 0.8rem', borderRadius: '999px', border: isActive ? `2px solid ${TEAL}` : '1.5px solid var(--border-color)',
                      backgroundColor: isActive ? TEAL : 'white', color: isActive ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.8rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                    }}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {/* Genre */}
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Places pour
              </p>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {([['tous', 'Hommes & Femmes'], ['hommes', '♂ Hommes'], ['femmes', '♀ Femmes']] as const).map(([key, label]) => {
                  const isActive = genre === key;
                  return (
                    <button key={key} onClick={() => setGenre(key)} style={{
                      padding: '0.35rem 0.8rem', borderRadius: '999px', border: isActive ? `2px solid ${TEAL}` : '1.5px solid var(--border-color)',
                      backgroundColor: isActive ? TEAL : 'white', color: isActive ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.8rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                    }}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Département */}
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Département
              </p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {DEPTS.map(d => {
                  const isActive = deptFilter === d.code;
                  return (
                    <button key={d.code} onClick={() => setDeptFilter(d.code)} style={{
                      padding: '0.35rem 0.7rem', borderRadius: '999px', border: isActive ? `2px solid ${TEAL}` : '1.5px solid var(--border-color)',
                      backgroundColor: isActive ? TEAL : 'white', color: isActive ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.78rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                    }}>
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Résultats */}
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{filtered.length} espace{filtered.length !== 1 ? 's' : ''}</strong> disponible{filtered.length !== 1 ? 's' : ''}
            {selectedPriere !== 'toutes' && ` pour ${PRIERE_LABELS[selectedPriere]}`}
            {genre !== 'tous' && ` · ${genre === 'hommes' ? 'Hommes' : 'Femmes'}`}
          </p>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🕌</span>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Aucun espace disponible avec ces filtres</p>
              <p style={{ fontSize: '0.85rem' }}>Essaie de changer la prière ou le département.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filtered.map(e => (
                <EspaceCard key={e.id} espace={e} selectedPriere={selectedPriere} genre={genre} />
              ))}
            </div>
          )}

          {/* CTA proposer */}
          <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f0fdfa', borderRadius: '12px', border: '1px solid #99f6e4', textAlign: 'center' }}>
            <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>Tu as un espace disponible ?</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Propose ton salon, ta boutique ou ton bureau. C&apos;est gratuit, ça prend 2 minutes.</p>
            <button onClick={() => setMode('propose')} style={{ padding: '0.6rem 1.5rem', backgroundColor: TEAL, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
              Proposer mon espace →
            </button>
          </div>
        </>
      )}

      {/* ─── MODE PROPOSE ─── */}
      {mode === 'propose' && (
        <div style={{ maxWidth: '640px' }}>
          {/* Bénéfices */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { icon: '🌟', title: 'Sadaqa jariya', desc: 'Chaque prière facilitée compte pour toi' },
              { icon: '🤝', title: 'Zéro contrainte', desc: 'Tu choisis tes prières et tes horaires' },
              { icon: '🔒', title: 'Profil vérifié', desc: 'Seuls les inscrits validés peuvent réserver' },
              { icon: '💚', title: '100% gratuit', desc: 'Pour toi et pour les priants' },
            ].map(b => (
              <div key={b.title} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.4rem' }}>{b.icon}</span>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.2rem' }}>{b.title}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Ce que tu renseignes */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Ce que tu renseigneras lors de l&apos;inscription</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                '🕌 Type de lieu (appartement, boutique, bureau…)',
                '🙋 Prières acceptées (Fajr / Dhohr / Asr / Maghrib / Icha)',
                '👥 Nombre de places hommes / femmes séparés',
                '🚿 Ablutions disponibles oui/non',
                '📸 Photo du lieu (pour mettre en confiance)',
                '📍 Adresse (visible uniquement aux inscrits validés)',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/connexion" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.875rem 2rem', backgroundColor: TEAL, color: 'white', borderRadius: '10px',
            textDecoration: 'none', fontWeight: 700, fontSize: '1rem', width: '100%', boxSizing: 'border-box',
          }}>
            <Plus size={18} /> Je veux proposer mon espace
          </Link>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
            Ton profil sera validé manuellement avant d&apos;être visible. Pas de mauvaise surprise.
          </p>
        </div>
      )}
    </div>
  );
}
