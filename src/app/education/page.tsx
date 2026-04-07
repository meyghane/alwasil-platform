'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, BookOpen, Globe, Building2, CheckCircle, Phone, ExternalLink, Filter } from 'lucide-react';
import { allInstituts, COURSE_LABELS, type Institut, type CourseType } from '@/data/institutes';
import DeptFilter from '@/components/DeptFilter';
import PageHeader from '@/components/PageHeader';

const FORMAT_LABELS = {
  presentiel: 'Présentiel',
  distanciel: 'En ligne',
  hybride: 'Hybride',
};

const TYPE_LABELS = {
  'institut': 'Institut',
  'mosquee': 'Mosquée',
  'professeur': 'Professeur',
  'en-ligne': 'Formation en ligne',
  'cercle': 'Cercle de science',
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
  const [showFilters, setShowFilters] = useState(false);

  const deptCounts: Record<string, number> = {};
  allInstituts.forEach(inst => {
    deptCounts[inst.department] = (deptCounts[inst.department] ?? 0) + 1;
  });

  const filtered = allInstituts.filter(inst => {
    const q = search.toLowerCase();
    const matchSearch = !q || inst.name.toLowerCase().includes(q) || inst.city.toLowerCase().includes(q) || inst.tags.some(t => t.toLowerCase().includes(q));
    const matchCourse = selectedCourse === 'all' || inst.courses.includes(selectedCourse);
    const matchDept = selectedDept === 'Tout' || inst.department === selectedDept;
    return matchSearch && matchCourse && matchDept;
  });

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <PageHeader
        title="Apprentissage"
        titleAr="عِلْم"
        description="Répertoire des instituts, mosquées et professeurs pour l'étude de l'Islam et de la langue arabe."
        color="#0d9488"
        emoji="📚"
      />

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>

        {/* Search & Filters */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem',
          marginBottom: '2.5rem',
          padding: '1.5rem',
          backgroundColor: '#fafaf9',
          borderRadius: '12px',
          border: '1px solid #e7e5e4'
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }} />
            <input
              type="text"
              placeholder="Nom de l'institut, ville, enseignement..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem 0.8rem 3rem',
                borderRadius: '8px',
                border: '1px solid #e7e5e4',
                fontSize: '0.95rem',
                outline: 'none',
                backgroundColor: 'white'
              }}
            />
          </div>

          <DeptFilter value={selectedDept} onChange={setSelectedDept} counts={deptCounts} />

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {COURSE_FILTERS.map(cf => {
              const isActive = selectedCourse === cf.key;
              return (
                <button
                  key={cf.key}
                  onClick={() => setSelectedCourse(cf.key)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid #e7e5e4',
                    backgroundColor: isActive ? '#1c1917' : 'white',
                    color: isActive ? 'white' : '#57534e',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {cf.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#78716c', fontSize: '0.875rem', fontWeight: 500 }}>
            {filtered.length} établissement{filtered.length > 1 ? 's' : ''} référencé{filtered.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Results List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#a8a29e' }}>
            <BookOpen size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Aucun institut trouvé</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map(inst => (
              <InstitutRow key={inst.id} inst={inst} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop: '5rem',
          padding: '3rem 2rem',
          borderRadius: '16px',
          backgroundColor: '#f0fdfa',
          border: '1px solid #ccfbf1',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#134e4a' }}>Un institut manque à l'appel ?</h3>
          <p style={{ color: '#0d9488', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '500px', marginInline: 'auto' }}>
            Contribuez à l'annuaire Al-Wasil en proposant un nouvel établissement d'enseignement.
          </p>
          <Link href="/contact?type=general" className="btn btn-primary" style={{ 
            textDecoration: 'none',
            padding: '0.75rem 2rem',
            backgroundColor: '#0d9488',
            borderRadius: '8px',
            fontWeight: 600
          }}>
            Proposer un ajout
          </Link>
        </div>
      </div>
    </div>
  );
}

function InstitutRow({ inst }: { inst: Institut }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '1.75rem 0',
      borderBottom: '1px solid #f5f5f4',
      gap: '2rem',
    }}>
      {/* Name & Type */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#1c1917' }}>
            {inst.name}
          </h3>
          <span style={{ 
            fontSize: '0.625rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            color: '#0d9488',
            backgroundColor: '#f0fdfa',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid #ccfbf1'
          }}>
            {TYPE_LABELS[inst.type as keyof typeof TYPE_LABELS]}
          </span>
          {inst.verified && (
            <span title="Établissement vérifié" style={{ color: '#0d9488', display: 'flex', alignItems: 'center' }}>
              <CheckCircle size={16} fill="#0d9488" color="white" />
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.875rem', color: '#78716c', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} color="#a8a29e" />
            <span style={{ fontWeight: 500, color: '#44403c' }}>{inst.city}</span> 
            {inst.department !== '00' && <span>({inst.department})</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {inst.format.includes('distanciel') ? <Globe size={15} color="#a8a29e" /> : <Building2 size={15} color="#a8a29e" />}
            {inst.format.map(f => FORMAT_LABELS[f as keyof typeof FORMAT_LABELS]).join(', ')}
          </div>
        </div>

        {/* Courses Tags */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {inst.courses.map(c => (
            <span key={c} style={{
              fontSize: '0.75rem',
              color: '#57534e',
              backgroundColor: '#f5f5f4',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 500
            }}>
              {COURSE_LABELS[c]}
            </span>
          ))}
        </div>
      </div>

      {/* Action column */}
      <div style={{ flexShrink: 0, display: 'flex', gap: '0.75rem' }}>
        {inst.website ? (
          <a
            href={inst.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '0.875rem', 
              color: 'white',
              backgroundColor: '#1c1917',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
          >
            Voir le site <ExternalLink size={15} />
          </a>
        ) : inst.phone ? (
          <a
            href={`tel:${inst.phone}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '0.875rem', 
              color: '#1c1917',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #e7e5e4'
            }}
          >
            Contact <Phone size={15} />
          </a>
        ) : (
          <Link
            href="/contact?type=general"
            style={{ 
              fontSize: '0.875rem', 
              color: '#78716c',
              fontWeight: 500,
              textDecoration: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #e7e5e4'
            }}
          >
            Infos
          </Link>
        )}
      </div>
    </div>
  );
}
