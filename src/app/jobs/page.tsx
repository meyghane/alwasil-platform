'use client';

import { useState } from 'react';
import {
  Briefcase, ExternalLink, Search, MapPin, Users,
  Star, CheckCircle, Clock,
} from 'lucide-react';
import {
  jobOffers,
  talentProfiles,
  JOB_TYPE_LABELS,
  JOB_SECTOR_LABELS,
  FRIENDLY_LABELS,
  FRIENDLY_COLORS,
  REMOTE_LABELS,
  type JobSector,
  type FriendlyLevel,
  type JobType,
} from '@/data/jobs';
import DeptFilter from '@/components/DeptFilter';

type Tab = 'offres' | 'talents' | 'reseau';

const TABS: { key: Tab; label: string }[] = [
  { key: 'offres', label: '💼 Offres d\'emploi' },
  { key: 'talents', label: '⭐ Vivier de talents' },
  { key: 'reseau', label: '🤝 Réseau CMN' },
];

const SECTORS: { key: JobSector | 'all'; label: string }[] = [
  { key: 'all', label: '🌐 Tous secteurs' },
  { key: 'tech', label: '💻 Tech' },
  { key: 'sante', label: '🏥 Santé' },
  { key: 'education', label: '📚 Éducation' },
  { key: 'juridique', label: '⚖️ Juridique' },
  { key: 'finance', label: '💼 Finance' },
  { key: 'humanitaire', label: '🤲 Humanitaire' },
  { key: 'communication', label: '📣 Comm' },
  { key: 'autre', label: '🔧 Autre' },
];

const FRIENDLY_FILTERS: { key: FriendlyLevel | 'all'; label: string }[] = [
  { key: 'all', label: '✅ Tous' },
  { key: 'voile-ok', label: '🧕 Voile OK' },
  { key: 'priere-ok', label: '🕌 Prière OK' },
  { key: 'full-friendly', label: '⭐ Full Friendly' },
];

const JOB_TYPE_COLORS: Record<JobType, string> = {
  cdi: '#10b981',
  cdd: '#3b82f6',
  freelance: '#8b5cf6',
  stage: '#f59e0b',
  alternance: '#f97316',
  benevole: '#ef4444',
};

const SECTOR_COLORS: Record<string, string> = {
  tech: '#6366f1',
  sante: '#10b981',
  education: '#f59e0b',
  commerce: '#f97316',
  juridique: '#3b82f6',
  humanitaire: '#ef4444',
  finance: '#059669',
  communication: '#8b5cf6',
  autre: '#6b7280',
};

export default function JobsPage() {
  const [tab, setTab] = useState<Tab>('offres');
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState<JobSector | 'all'>('all');
  const [friendlyFilter, setFriendlyFilter] = useState<FriendlyLevel | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState('Tout');
  const [remoteOnly, setRemoteOnly] = useState(false);

  const filteredOffers = jobOffers.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.tags.some(t => t.includes(q));
    const matchSector = sectorFilter === 'all' || j.sector === sectorFilter;
    const matchFriendly = friendlyFilter === 'all' || j.friendly.includes(friendlyFilter);
    const matchDept = deptFilter === 'Tout' || j.department === deptFilter;
    const matchRemote = !remoteOnly || j.remote === 'full';
    return matchSearch && matchSector && matchFriendly && matchDept && matchRemote;
  });

  const filteredTalents = talentProfiles.filter(t => {
    const q = search.toLowerCase();
    return !q || t.role.toLowerCase().includes(q) ||
      t.skills.some(s => s.toLowerCase().includes(q)) ||
      t.bio.toLowerCase().includes(q);
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Briefcase size={28} color="#10b981" />
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Emploi — Amal (أمَل)</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Offres d&apos;emploi <strong>voile accepté</strong> et <strong>prière acceptée</strong>, vivier de talents communautaires et réseau CMN.
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
              borderBottom: tab === t.key ? '2px solid #10b981' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: tab === t.key ? '#10b981' : 'var(--text-secondary)',
              fontWeight: tab === t.key ? 700 : 400,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '-2px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── OFFRES D'EMPLOI ─── */}
      {tab === 'offres' && (
        <>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Rechercher un poste, une entreprise, une compétence..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Filters row */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <DeptFilter value={deptFilter} onChange={setDeptFilter} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={remoteOnly} onChange={e => setRemoteOnly(e.target.checked)}
                style={{ accentColor: '#10b981' }} />
              🏠 Remote uniquement
            </label>
          </div>

          {/* Friendly filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
            {FRIENDLY_FILTERS.map(f => {
              const color = f.key !== 'all' ? FRIENDLY_COLORS[f.key] : '#10b981';
              const isActive = friendlyFilter === f.key;
              return (
                <button key={f.key} onClick={() => setFriendlyFilter(f.key)}
                  style={{ padding: '0.35rem 0.85rem', borderRadius: '999px', border: isActive ? `2px solid ${color}` : '1.5px solid var(--border-color)', backgroundColor: isActive ? color : 'white', color: isActive ? 'white' : 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Sector filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {SECTORS.map(s => {
              const color = s.key !== 'all' ? SECTOR_COLORS[s.key] : '#10b981';
              const isActive = sectorFilter === s.key;
              return (
                <button key={s.key} onClick={() => setSectorFilter(s.key)}
                  style={{ padding: '0.3rem 0.75rem', borderRadius: '6px', border: isActive ? `2px solid ${color}` : '1.5px solid var(--border-color)', backgroundColor: isActive ? `${color}15` : 'transparent', color: isActive ? color : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{filteredOffers.length}</strong> offre{filteredOffers.length > 1 ? 's' : ''} trouvée{filteredOffers.length > 1 ? 's' : ''}
          </p>

          {/* Job cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredOffers.map(job => (
              <div key={job.id} className="card" style={{ padding: '1.25rem', borderLeft: job.featured ? '3px solid #10b981' : undefined }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* Logo */}
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#f5f5f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                    {job.companyLogo}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Top row */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem', alignItems: 'center' }}>
                      {job.featured && (
                        <span style={{ backgroundColor: '#10b981', color: 'white', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                          ⭐ Mis en avant
                        </span>
                      )}
                      {job.cmn && (
                        <span style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                          🌐 Via CMN
                        </span>
                      )}
                      <span style={{ backgroundColor: `${JOB_TYPE_COLORS[job.type]}20`, color: JOB_TYPE_COLORS[job.type], padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                        {JOB_TYPE_LABELS[job.type]}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{REMOTE_LABELS[job.remote]}</span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem', lineHeight: 1.3 }}>{job.title}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{job.company}</strong>
                      {' '}<MapPin size={12} style={{ display: 'inline', marginLeft: '0.25rem' }} />{' '}{job.location}
                      {job.salary && <span style={{ marginLeft: '0.75rem', color: '#10b981', fontWeight: 600 }}>💰 {job.salary}</span>}
                    </p>

                    <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.75rem' }}>
                      {job.description}
                    </p>

                    {/* Friendly badges */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {job.friendly.map(f => (
                        <span key={f} style={{ backgroundColor: `${FRIENDLY_COLORS[f]}18`, color: FRIENDLY_COLORS[f], border: `1px solid ${FRIENDLY_COLORS[f]}40`, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>
                          {FRIENDLY_LABELS[f]}
                        </span>
                      ))}
                    </div>

                    {/* Tags + footer */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {job.tags.map(tag => (
                        <span key={tag} style={{ backgroundColor: '#f5f5f4', color: 'var(--text-secondary)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem' }}>#{tag}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />
                        Publié le {new Date(job.postedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        {job.postedBy && (
                          <span> • Par <strong style={{ color: 'var(--text-primary)' }}>{job.postedBy}</strong></span>
                        )}
                      </div>
                      <a href={job.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#10b981', color: 'white', padding: '0.45rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                        Postuler <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredOffers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <Briefcase size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>Aucune offre ne correspond à vos critères.</p>
                <p style={{ fontSize: '0.85rem' }}>Essayez de réduire vos filtres.</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ marginTop: '2.5rem', padding: '1.75rem', borderRadius: '1rem', backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Vous recrutez ?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Publiez votre offre gratuitement et touchez des talents de la communauté.
            </p>
            <button className="btn btn-primary">Publier une offre</button>
          </div>
        </>
      )}

      {/* ─── VIVIER DE TALENTS ─── */}
      {tab === 'talents' && (
        <>
          <div style={{ marginBottom: '1rem', padding: '0.875rem 1rem', backgroundColor: 'rgba(16,185,129,0.06)', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid #10b981' }}>
            ⭐ Membres de la communauté ouverts aux opportunités. Contactez-les directement ou partagez leur profil.
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Chercher un profil, une compétence..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {filteredTalents.map(t => (
              <div key={t.id} className="card" style={{ padding: '1.25rem', opacity: t.available ? 1 : 0.65 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.875rem' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: SECTOR_COLORS[t.sector] || '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>{t.name}</p>
                      {t.cmn && <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '0.1rem 0.45rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>CMN</span>}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>{t.role}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                      <MapPin size={10} style={{ display: 'inline' }} /> {t.location}
                      {t.remote && ' • Remote OK'}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{t.bio}</p>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                  {t.skills.map(skill => (
                    <span key={skill} style={{ backgroundColor: `${SECTOR_COLORS[t.sector]}15`, color: SECTOR_COLORS[t.sector], padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 700, color: t.available ? '#10b981' : '#9ca3af' }}>
                    {t.available
                      ? <><CheckCircle size={14} color="#10b981" /> Disponible</>
                      : <><Clock size={14} /> En poste</>}
                  </div>
                  <button style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.4rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                    Contacter
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA rejoindre */}
          <div style={{ marginTop: '2.5rem', padding: '1.75rem', borderRadius: '1rem', backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
            <Users size={32} color="#10b981" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Rejoignez le vivier</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Partagez votre profil et recevez des opportunités de la communauté.
            </p>
            <button className="btn btn-primary">Ajouter mon profil</button>
          </div>
        </>
      )}

      {/* ─── RÉSEAU CMN ─── */}
      {tab === 'reseau' && (
        <div style={{ maxWidth: '700px' }}>
          <div style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '2.5rem' }}>🌐</span>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.35rem' }}>CMN — Cadre Musulman Network</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Le CMN est un réseau de professionnels musulmans en France, réunissant des cadres, entrepreneurs et experts dans tous les secteurs. Al-Wasil Emploi est connecté à leur vivier de talents.
                </p>
              </div>
            </div>
          </div>

          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Pourquoi rejoindre le CMN ?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {[
              { icon: '👔', text: 'Accès à un réseau de +2 000 professionnels musulmans en France' },
              { icon: '💼', text: 'Offres d\'emploi partagées en exclusivité entre membres' },
              { icon: '🎓', text: 'Événements networking, conférences et ateliers carrière' },
              { icon: '🤝', text: 'Mentoring par des cadres expérimentés du réseau' },
              { icon: '🌍', text: 'Présence à Paris, Lyon, Marseille et dans toute la France' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', padding: '0.875rem', borderRadius: '0.5rem', backgroundColor: 'var(--card-background)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="https://cadremusulman.com" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f59e0b', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, textDecoration: 'none' }}>
              Rejoindre le CMN <ExternalLink size={14} />
            </a>
            <button className="btn btn-outline">En savoir plus</button>
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1.5rem', borderRadius: '1rem', backgroundColor: '#f9fafb', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>
              <Star size={16} style={{ display: 'inline', marginRight: '0.35rem', color: '#f59e0b' }} />
              Vous recrutez via le réseau CMN ?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
              Publiez votre offre directement dans la communauté CMN × Al-Wasil pour toucher des talents qualifiés et fiables.
            </p>
            <button className="btn btn-primary">Publier via CMN</button>
          </div>
        </div>
      )}
    </div>
  );
}
