'use client';

import { useState } from 'react';
import { HandHeart, ExternalLink, Users, Target, Search } from 'lucide-react';
import {
  cagnottes,
  initiatives,
  CAGNOTTE_CAT_LABELS,
  CAGNOTTE_CAT_COLORS,
  type CagnotteCategory,
} from '@/data/solidarity';
import DeptFilter from '@/components/DeptFilter';

// Image Unsplash via mot-clé (API publique, pas de clé requise pour les URL statiques)
function unsplashUrl(keyword: string, w = 400, h = 220) {
  return `https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=${w}&h=${h}&fit=crop&q=80`;
}

// Map de photos Unsplash par thème (IDs fixes pour éviter les requêtes dynamiques)
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

const CATS: { key: CagnotteCategory | 'all'; label: string }[] = [
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

export default function SolidarityPage() {
  const [catFilter, setCatFilter] = useState<CagnotteCategory | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState('Tout');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'cagnottes' | 'initiatives'>('cagnottes');

  const filteredCagnottes = cagnottes.filter(c => {
    const q = search.toLowerCase();
    return (catFilter === 'all' || c.category === catFilter) &&
      (!q || c.title.toLowerCase().includes(q) || c.organizer.toLowerCase().includes(q));
  });

  const filteredInitiatives = initiatives.filter(i => {
    const q = search.toLowerCase();
    return (deptFilter === 'Tout' || i.department === deptFilter) &&
      (!q || i.title.toLowerCase().includes(q) || i.organizer.toLowerCase().includes(q));
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
          Cagnottes communautaires, maraudes, visites et initiatives solidaires. Ensemble on va plus loin.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)' }}>
        {(['cagnottes', 'initiatives'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderBottom: tab === t ? '2px solid #ef4444' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: tab === t ? '#ef4444' : 'var(--text-secondary)',
              fontWeight: tab === t ? 700 : 400,
              fontSize: '0.95rem',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.15s',
            }}
          >
            {t === 'cagnottes' ? `🤲 Cagnottes (${cagnottes.length})` : `🙌 Initiatives (${initiatives.length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder={tab === 'cagnottes' ? 'Rechercher une cagnotte...' : 'Rechercher une initiative...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Filters */}
      {tab === 'cagnottes' ? (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATS.map(cat => {
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
      ) : (
        <div style={{ marginBottom: '1.5rem' }}>
          <DeptFilter value={deptFilter} onChange={setDeptFilter} />
        </div>
      )}

      {/* CAGNOTTES */}
      {tab === 'cagnottes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredCagnottes.map(c => {
            const pct = progressPct(c.raised, c.goal);
            const color = CAGNOTTE_CAT_COLORS[c.category];
            return (
              <div key={c.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={getUnsplashUrl(c.imageKeyword)}
                    alt={c.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=220&fit=crop&q=80`; }}
                  />
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

                  {/* Progress */}
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
      )}

      {/* INITIATIVES */}
      {tab === 'initiatives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredInitiatives.map(ini => (
            <div key={ini.id} className="card" style={{ padding: 0, display: 'flex', overflow: 'hidden' }}>
              <div style={{ width: '140px', flexShrink: 0, overflow: 'hidden' }}>
                <img src={getUnsplashUrl(ini.imageKeyword, 280, 200)} alt={ini.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.25rem', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.15rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                    {ini.recurring ? '🔄 Récurrent' : '📅 Ponctuel'}
                  </span>
                  <span style={{ backgroundColor: '#f5f5f4', color: 'var(--text-secondary)', padding: '0.15rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem' }}>
                    📍 {ini.city} ({ini.department})
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
                    <a href={ini.contactUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      Participer <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
