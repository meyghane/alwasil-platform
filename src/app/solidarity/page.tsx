'use client';

import { useState } from 'react';
import {
  HandHeart, ExternalLink, Search, MapPin, Heart,
  Globe, Users, Plane, Building2, Phone,
} from 'lucide-react';
import {
  cagnottes,
  initiatives,
  visiteMalades,
  voyagesHumanitaires,
  associations,
  CAGNOTTE_CAT_LABELS,
  CAGNOTTE_CAT_COLORS,
  type CagnotteCategory,
} from '@/data/solidarity';
import DeptFilter from '@/components/DeptFilter';

// Map de photos Unsplash par thème
const UNSPLASH_PHOTOS: Record<string, string> = {
  'hope solidarity hands': 'photo-1488521787991-ed7bbaae773c',
  'water well africa': 'photo-1594398901394-4e34939a4fd0',
  'mosque interior prayer': 'photo-1564769625905-50e93615e769',
  'quran book reading': 'photo-1609599006353-e629aaabfeae',
  'children education school': 'photo-1503676260728-1c00da094a0b',
  'family solidarity community': 'photo-1529156069898-49953e39b3ac',
  'humanitarian aid relief': 'photo-1469571486292-0ba58a3f068b',
  'children learning arabic quran': 'photo-1555861496-0666c8981751',
  'volunteer food distribution night': 'photo-1488521787991-ed7bbaae773c',
  'ramadan iftar table food': 'photo-1563245372-f21724e3856d',
  'elderly people visit care': 'photo-1576765607924-3f7b8410a787',
  'clothes donation collection': 'photo-1532996122724-e3c354a0b15b',
};

function getUnsplashUrl(keyword: string, w = 400, h = 220): string {
  const photoId = UNSPLASH_PHOTOS[keyword];
  if (photoId) return `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;
  return `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=${w}&h=${h}&fit=crop&q=80&auto=format`;
}

function progressPct(raised?: number, goal?: number) {
  if (!raised || !goal) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

function formatAmount(n?: number, currency = 'EUR') {
  if (!n) return '—';
  const sym = currency === 'USD' ? '$' : '€';
  return n >= 1000 ? `${sym}${(n / 1000).toFixed(0)}k` : `${sym}${n}`;
}

const CAGNOTTE_CATS: { key: CagnotteCategory | 'all'; label: string }[] = [
  { key: 'all', label: '🌐 Tout' },
  { key: 'palestine', label: '🇵🇸 Palestine' },
  { key: 'urgence', label: '🚨 Urgence' },
  { key: 'eau-puits', label: '💧 Eau & Puits' },
  { key: 'orphelins', label: '🤲 Orphelins' },
  { key: 'mosquee', label: '🕌 Mosquées' },
  { key: 'education', label: '📚 Éducation' },
  { key: 'famille', label: '👨‍👩‍👧 Familles' },
  { key: 'afrique', label: '🌍 Afrique' },
];

const TYPE_LIEU_LABELS: Record<string, string> = {
  ehpad: '🏠 EHPAD',
  hopital: '🏥 Hôpital',
  domicile: '🏡 Domicile',
  prison: '🔒 Prison',
};

type Tab = 'cagnottes' | 'maraudes' | 'visites' | 'voyages' | 'associations';

const TABS: { key: Tab; label: string; count?: number }[] = [
  { key: 'cagnottes', label: '🤲 Cagnottes', count: cagnottes.length },
  { key: 'maraudes', label: '🍲 Maraudes', count: initiatives.length },
  { key: 'visites', label: '💚 Visites malades', count: visiteMalades.length },
  { key: 'voyages', label: '✈️ Voyages humanitaires', count: voyagesHumanitaires.length },
  { key: 'associations', label: '🏛️ Associations', count: associations.length },
];

export default function SolidarityPage() {
  const [tab, setTab] = useState<Tab>('cagnottes');
  const [catFilter, setCatFilter] = useState<CagnotteCategory | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState('Tout');
  const [search, setSearch] = useState('');

  const filteredCagnottes = cagnottes.filter(c => {
    const q = search.toLowerCase();
    return (catFilter === 'all' || c.category === catFilter) &&
      (!q || c.title.toLowerCase().includes(q) || c.organizer.toLowerCase().includes(q));
  });

  const filteredMaraudes = initiatives.filter(i => {
    const q = search.toLowerCase();
    return (deptFilter === 'Tout' || i.department === deptFilter) &&
      (!q || i.title.toLowerCase().includes(q) || i.organizer.toLowerCase().includes(q));
  });

  const filteredVisites = visiteMalades.filter(v => {
    const q = search.toLowerCase();
    return (deptFilter === 'Tout' || v.department === deptFilter) &&
      (!q || v.title.toLowerCase().includes(q) || v.organizer.toLowerCase().includes(q));
  });

  const filteredVoyages = voyagesHumanitaires.filter(v => {
    const q = search.toLowerCase();
    return !q || v.title.toLowerCase().includes(q) ||
      v.destination.toLowerCase().includes(q) ||
      v.organizer.toLowerCase().includes(q);
  });

  const filteredAssociations = associations.filter(a => {
    const q = search.toLowerCase();
    return !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <HandHeart size={28} color="#ef4444" />
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Solidarité — Takaful (تَكَافُل)</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Cagnottes, maraudes, visites de malades, voyages humanitaires et associations. Ensemble on va plus loin.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSearch(''); }}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderBottom: tab === t.key ? '2px solid #ef4444' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: tab === t.key ? '#ef4444' : 'var(--text-secondary)',
              fontWeight: tab === t.key ? 700 : 400,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '-2px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {t.label}{t.count !== undefined ? ` (${t.count})` : ''}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* ─── CAGNOTTES ─── */}
      {tab === 'cagnottes' && (
        <>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {CAGNOTTE_CATS.map(cat => {
              const color = cat.key !== 'all' ? CAGNOTTE_CAT_COLORS[cat.key] : '#ef4444';
              const isActive = catFilter === cat.key;
              return (
                <button key={cat.key} onClick={() => setCatFilter(cat.key)}
                  style={{ padding: '0.4rem 0.9rem', borderRadius: '999px', border: isActive ? `2px solid ${color}` : '1.5px solid var(--border-color)', backgroundColor: isActive ? color : 'white', color: isActive ? 'white' : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredCagnottes.map(c => {
              const pct = progressPct(c.raised, c.goal);
              const color = CAGNOTTE_CAT_COLORS[c.category];
              return (
                <div key={c.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img src={getUnsplashUrl(c.imageKeyword)} alt={c.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=220&fit=crop&q=80`; }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                    <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', backgroundColor: color, color: 'white', padding: '0.2rem 0.65rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {CAGNOTTE_CAT_LABELS[c.category]}
                    </span>
                    {c.featured && (
                      <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: '#f59e0b', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                        ⭐ En avant
                      </span>
                    )}
                    <p style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', margin: 0 }}>
                      📍 {c.country || 'France'} • via {c.platform}
                    </p>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.5rem' }}>{c.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>{c.description}</p>

                    {c.goal && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                          <span style={{ fontWeight: 700, color }}>{formatAmount(c.raised, c.currency)} collectés</span>
                          <span style={{ color: 'var(--text-secondary)' }}>objectif {formatAmount(c.goal, c.currency)}</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#f5f5f4', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: '999px', transition: 'width 0.3s' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                          <span>{pct}% atteint</span>
                          <span>{c.backers?.toLocaleString()} donateurs • {c.daysLeft}j restants</span>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        par <strong style={{ color: 'var(--text-primary)' }}>{c.organizer}</strong>
                      </span>
                      <a href={c.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: color, color: 'white', padding: '0.45rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                        Donner <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ─── MARAUDES ─── */}
      {tab === 'maraudes' && (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <DeptFilter value={deptFilter} onChange={setDeptFilter} />
          </div>
          <div style={{ marginBottom: '1rem', padding: '0.875rem 1rem', backgroundColor: 'rgba(239,68,68,0.06)', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid #ef4444' }}>
            🍲 Les maraudes sont des distributions nocturnes de repas et produits d&apos;hygiène aux personnes sans-abri. Aucune compétence requise — votre présence suffit.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredMaraudes.map(ini => (
              <div key={ini.id} className="card" style={{ padding: 0, display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: '130px', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={getUnsplashUrl(ini.imageKeyword, 280, 200)} alt={ini.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.25rem', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.15rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                      {ini.recurring ? '🔄 Récurrent' : '📅 Ponctuel'}
                    </span>
                    <span style={{ backgroundColor: '#f5f5f4', color: 'var(--text-secondary)', padding: '0.15rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem' }}>
                      <MapPin size={10} style={{ display: 'inline', marginRight: '2px' }} />{ini.city} ({ini.department})
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{ini.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{ini.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Par <strong style={{ color: 'var(--text-primary)' }}>{ini.organizer}</strong>
                      {ini.nextDate && ` • Prochain : ${new Date(ini.nextDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`}
                    </span>
                    {ini.contactUrl && (
                      <a href={ini.contactUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#ef4444', color: 'white', padding: '0.4rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                        Participer <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── VISITES MALADES ─── */}
      {tab === 'visites' && (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <DeptFilter value={deptFilter} onChange={setDeptFilter} />
          </div>
          <div style={{ marginBottom: '1rem', padding: '0.875rem 1rem', backgroundColor: 'rgba(16,185,129,0.06)', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid #10b981' }}>
            💚 Visiter un malade ou une personne âgée est une sunnah du Prophète ﷺ. Ces initiatives vous permettent de le faire de manière organisée, en EHPAD, hôpital, ou à domicile.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredVisites.map(v => (
              <div key={v.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: '#f0fdf4', color: '#10b981', padding: '0.15rem 0.65rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {TYPE_LIEU_LABELS[v.typeLieu]}
                  </span>
                  <span style={{ backgroundColor: '#f5f5f4', color: 'var(--text-secondary)', padding: '0.15rem 0.65rem', borderRadius: '4px', fontSize: '0.72rem' }}>
                    📍 {v.city} ({v.department})
                  </span>
                  {v.recurring && (
                    <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.15rem 0.65rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                      🔄 Récurrent
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.3 }}>{v.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{v.description}</p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{v.lieu}</strong>
                  {v.nextDate && ` • ${new Date(v.nextDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {v.tags.map(tag => (
                    <span key={tag} style={{ backgroundColor: '#f5f5f4', color: 'var(--text-secondary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem' }}>#{tag}</span>
                  ))}
                </div>
                {v.contactUrl && (
                  <a href={v.contactUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', width: 'fit-content' }}>
                    Je m&apos;inscris <ExternalLink size={12} />
                  </a>
                )}
                {v.phone && (
                  <a href={`tel:${v.phone}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', color: '#10b981', fontSize: '0.82rem', textDecoration: 'none' }}>
                    <Phone size={13} /> {v.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── VOYAGES HUMANITAIRES ─── */}
      {tab === 'voyages' && (
        <>
          <div style={{ marginBottom: '1rem', padding: '0.875rem 1rem', backgroundColor: 'rgba(59,130,246,0.06)', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid #3b82f6' }}>
            ✈️ Des voyages organisés pour aller aider là où c&apos;est le plus nécessaire. Distribution alimentaire, chantiers solidaires, soutien psychosocial. Cliquez pour vous inscrire directement auprès de l&apos;organisateur.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filteredVoyages.map(v => (
              <div key={v.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img src={getUnsplashUrl(v.imageKeyword)} alt={v.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=220&fit=crop&q=80`; }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }}>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>
                      ✈️ {v.destination}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', margin: '0.15rem 0 0' }}>
                      {v.duration}
                      {v.price && ` • ${v.price}`}
                    </p>
                  </div>
                  {v.places && (
                    <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: '#3b82f6', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {v.places} places
                    </span>
                  )}
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.5rem' }}>{v.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{v.description}</p>
                  {v.nextDeparture && (
                    <p style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, marginBottom: '0.75rem' }}>
                      📅 Prochain départ : {new Date(v.nextDeparture).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {v.tags.map(tag => (
                      <span key={tag} style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem' }}>#{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>par <strong style={{ color: 'var(--text-primary)' }}>{v.organizer}</strong></span>
                    <a href={v.organizerUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#3b82f6', color: 'white', padding: '0.45rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                      Candidater <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── ASSOCIATIONS ─── */}
      {tab === 'associations' && (
        <>
          <div style={{ marginBottom: '1rem', padding: '0.875rem 1rem', backgroundColor: 'rgba(107,114,128,0.06)', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid #6b7280' }}>
            🏛️ Associations, ONG et plateformes où vous pouvez vous engager, donner ou participer. Liens directs vers leurs pages officielles.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {filteredAssociations.map(a => (
              <div key={a.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{a.logoEmoji}</div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.25rem' }}>{a.name}</h3>
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#f5f5f4', color: 'var(--text-secondary)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {a.national ? '🌐 National' : '🌍 International'}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{a.description}</p>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                  {a.tags.map(tag => (
                    <span key={tag} style={{ backgroundColor: '#f5f5f4', color: 'var(--text-secondary)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem' }}>#{tag}</span>
                  ))}
                </div>
                <a href={a.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary-color)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                  <Globe size={13} /> Visiter le site <ExternalLink size={11} />
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CTA */}
      <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '1rem', backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Tu organises une initiative ou une cagnotte ?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Référencie-la gratuitement pour toucher toute la communauté.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary">Proposer une cagnotte</button>
          <button className="btn btn-outline">Proposer une initiative</button>
        </div>
      </div>
    </div>
  );
}
