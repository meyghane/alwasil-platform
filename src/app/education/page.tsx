'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, BookOpen, Globe, Building2, CheckCircle } from 'lucide-react';
import { allInstituts, COURSE_LABELS, type Institut, type CourseType } from '@/data/institutes';
import DeptFilter from '@/components/DeptFilter';

const FORMAT_LABELS = {
  presentiel: 'Présentiel',
  distanciel: 'En ligne',
  hybride: 'Hybride',
};

const TYPE_LABELS = {
  'institut': 'Institut',
  'mosquee': 'Mosquée',
  'professeur': 'Prof. indép.',
  'en-ligne': 'En ligne',
  'cercle': 'Cercle',
};

const TYPE_COLORS: Record<string, string> = {
  'institut': '#0d9488',
  'mosquee': '#6366f1',
  'professeur': '#f59e0b',
  'en-ligne': '#3b82f6',
  'cercle': '#10b981',
};

const COURSE_FILTERS: { key: CourseType | 'all'; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'coran', label: 'Coran' },
  { key: 'tajwid', label: 'Tajwid' },
  { key: 'arabe', label: 'Langue Arabe' },
  { key: 'sciences-islamiques', label: 'Sciences Islamiques' },
  { key: 'memorisation', label: 'Hifz' },
  { key: 'enfants', label: 'Enfants' },
];

export default function EducationPage() {
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseType | 'all'>('all');
  const [selectedDept, setSelectedDept] = useState('Tout');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'presentiel' | 'distanciel'>('all');

  const filtered = allInstituts.filter(inst => {
    const q = search.toLowerCase();
    const matchSearch = !q || inst.name.toLowerCase().includes(q) || inst.city.toLowerCase().includes(q) || inst.tags.some(t => t.toLowerCase().includes(q));
    const matchCourse = selectedCourse === 'all' || inst.courses.includes(selectedCourse);
    const matchDept = selectedDept === 'Tout' || inst.department === selectedDept;
    const matchFormat = selectedFormat === 'all' || inst.format.includes(selectedFormat);
    return matchSearch && matchCourse && matchDept && matchFormat;
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <BookOpen size={28} color="var(--primary-color)" />
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Éducation & Savoir — Ilm (عِلْم)</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          {allInstituts.length} instituts, mosquées et professeurs répertoriés en Île-de-France et en ligne.
        </p>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Rechercher un institut, une ville, un tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.75rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border-color)',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Filtre département */}
      <div style={{ marginBottom: '1.25rem' }}>
        <DeptFilter value={selectedDept} onChange={setSelectedDept} />
      </div>

      {/* Format chips */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['all', 'presentiel', 'distanciel'] as const).map(f => (
          <button
            key={f}
            onClick={() => setSelectedFormat(f)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              border: selectedFormat === f ? '2px solid #6366f1' : '1.5px solid var(--border-color)',
              backgroundColor: selectedFormat === f ? '#6366f1' : 'white',
              color: selectedFormat === f ? 'white' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: selectedFormat === f ? 700 : 400,
              cursor: 'pointer',
            }}
          >
            {f === 'all' ? '📍 Tout' : f === 'presentiel' ? '🏛️ Présentiel' : '💻 En ligne'}
          </button>
        ))}
      </div>

      {/* Course Type Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {COURSE_FILTERS.map(cf => (
          <button
            key={cf.key}
            onClick={() => setSelectedCourse(cf.key)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              backgroundColor: selectedCourse === cf.key ? 'var(--primary-color)' : 'transparent',
              color: selectedCourse === cf.key ? 'white' : 'var(--text-secondary)',
              border: selectedCourse === cf.key ? 'none' : '1px solid var(--border-color)',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontWeight: selectedCourse === cf.key ? 600 : 400,
            }}
          >
            {cf.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        {filtered.length} résultat{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
      </p>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>Aucun résultat. Essaie d'autres filtres.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(inst => (
            <InstitutCard key={inst.id} inst={inst} />
          ))}
        </div>
      )}

      {/* CTA Ajout */}
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        borderRadius: '1rem',
        backgroundColor: 'rgba(13, 148, 136, 0.06)',
        border: '1px solid rgba(13, 148, 136, 0.2)',
        textAlign: 'center',
      }}>
        <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Vous connaissez un institut non listé ?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Aidez la communauté à trouver les meilleures ressources. Proposez un ajout, c'est collaboratif.
        </p>
        <Link href="/contact?type=general" className="btn btn-primary" style={{ textDecoration: 'none' }}>Proposer un ajout</Link>
      </div>
    </div>
  );
}

// ============================================================
// Composant carte Institut
// ============================================================
function InstitutCard({ inst }: { inst: Institut }) {
  const typeColor = TYPE_COLORS[inst.type] || '#6b7280';

  return (
    <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>

      {/* Header coloré */}
      <div style={{
        height: '8px',
        backgroundColor: typeColor,
        borderRadius: '0.75rem 0.75rem 0 0',
      }} />

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Badges top */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span style={{
            backgroundColor: typeColor + '15',
            color: typeColor,
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}>
            {TYPE_LABELS[inst.type]}
          </span>
          {inst.format.map(f => (
            <span key={f} style={{
              backgroundColor: '#f5f5f4',
              color: 'var(--text-secondary)',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}>
              {f === 'distanciel' ? <Globe size={11} /> : <Building2 size={11} />}
              {FORMAT_LABELS[f]}
            </span>
          ))}
          {inst.verified && (
            <span style={{ marginLeft: 'auto', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>
              <CheckCircle size={13} /> Vérifié
            </span>
          )}
        </div>

        {/* Nom */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.3 }}>
          {inst.name}
        </h3>

        {/* Localisation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.825rem', marginBottom: '0.75rem' }}>
          <MapPin size={13} />
          {inst.city}{inst.department !== '00' && ` (${inst.department})`}
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.55, flex: 1 }}>
          {inst.description}
        </p>

        {/* Cours proposés */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {inst.courses.slice(0, 4).map(c => (
            <span key={c} style={{
              backgroundColor: '#f5f5f4',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
            }}>
              {COURSE_LABELS[c]}
            </span>
          ))}
          {inst.courses.length > 4 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', padding: '0.2rem 0' }}>
              +{inst.courses.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {inst.rating ? (
              <>
                <Star size={13} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{inst.rating}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>(nouveau)</span>
              </>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pas encore noté</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {inst.website && (
              <a href={inst.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}>
                Site web
              </a>
            )}
            {inst.phone && (
              <a href={`tel:${inst.phone}`} className="btn btn-primary" style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}>
                Appeler
              </a>
            )}
            {!inst.website && !inst.phone && (
              <Link href="/contact?type=general" className="btn btn-outline" style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem', textDecoration: 'none' }}>
                Laisser un avis
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
