'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
 Search, MapPin, Star, BookOpen, Building2, CheckCircle, Phone, ExternalLink,
 Landmark, Monitor, Users, User, Baby, GraduationCap, type LucideIcon,
} from 'lucide-react';
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
 color="#c9973a"
 emoji=""
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
 <div style={{
 display: 'grid',
 gridTemplateColumns: 'repeat(3, 1fr)',
 gap: '1rem',
 }}>
 {filtered.map(inst => (
 <InstitutCard key={inst.id} inst={inst} />
 ))}
 </div>
 )}

 {/* CTA */}
 <div style={{
 marginTop: '5rem',
 padding: '3rem 2rem',
 borderRadius: '16px',
 backgroundColor: '#fdfbf0',
 border: '1px solid #fdfbf0',
 textAlign: 'center',
 }}>
 <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#134e4a' }}>Un institut manque à l'appel ?</h3>
 <p style={{ color: '#a87830', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '500px', marginInline: 'auto' }}>
 Contribuez à l'annuaire Al-Wasil en proposant un nouvel établissement d'enseignement.
 </p>
 <Link href="/contact?type=general" className="btn btn-primary" style={{ 
 textDecoration: 'none',
 padding: '0.75rem 2rem',
 backgroundColor: '#a87830',
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

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: LucideIcon }> = {
 'institut': { label: 'Institut', color: '#c9973a', bg: '#fdfbf0', icon: BookOpen },
 'mosquee': { label: 'Mosquée', color: '#4a0e58', bg: '#f8f0ff', icon: Landmark },
 'professeur': { label: 'Professeur', color: '#a87830', bg: '#faf5e8', icon: GraduationCap },
 'en-ligne': { label: 'Formation en ligne', color: '#8a6025', bg: '#faf3e0', icon: Monitor },
 'cercle': { label: 'Cercle de science', color: '#7b2d6e', bg: '#fdf0f8', icon: Users },
};

const AUDIENCE_CONFIG: Record<string, { label: string; icon: LucideIcon; color: string; bg: string }> = {
 hommes: { label: 'Hommes', icon: User, color: '#4a0e58', bg: '#f8f0ff' },
 femmes: { label: 'Femmes', icon: User, color: '#7b2d6e', bg: '#fdf0f8' },
 enfants: { label: 'Enfants', icon: Baby, color: '#a87830', bg: '#faf5e8' },
 mixte: { label: 'Mixte', icon: Users, color: '#8a6025', bg: '#faf3e0' },
};

function InstitutCard({ inst }: { inst: Institut }) {
 const tc = TYPE_CONFIG[inst.type] ?? TYPE_CONFIG['institut'];

 return (
 <div style={{
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
 background: `linear-gradient(135deg, ${tc.color}18, ${tc.color}08)`,
 borderBottom: `3px solid ${tc.color}`,
 padding: '1.25rem 1.25rem 1rem',
 position: 'relative',
 minHeight: '90px',
 display: 'flex',
 flexDirection: 'column',
 justifyContent: 'space-between',
 }}>
 {/* Badges top */}
 <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
 {inst.featured && (
 <span style={{
 fontSize: '0.65rem', fontWeight: 800,
 color: 'white', backgroundColor: '#f59e0b',
 padding: '2px 8px', borderRadius: '20px',
 display: 'inline-flex', alignItems: 'center', gap: '3px',
 }}>
 <Star size={9} strokeWidth={2.5} /> Mis en avant
 </span>
 )}
 <span style={{
 fontSize: '0.65rem', fontWeight: 700,
 color: tc.color, backgroundColor: 'white',
 padding: '2px 8px', borderRadius: '20px',
 border: `1px solid ${tc.color}44`,
 display: 'inline-flex', alignItems: 'center', gap: '3px',
 }}>
 <tc.icon size={10} strokeWidth={2} /> {tc.label}
 </span>
 {inst.verified && (
 <span style={{
 fontSize: '0.65rem', fontWeight: 700,
 color: '#c9973a', backgroundColor: 'white',
 padding: '2px 8px', borderRadius: '20px',
 border: '1px solid #f0dea0',
 display: 'inline-flex', alignItems: 'center', gap: '3px',
 }}>
 <CheckCircle size={10} strokeWidth={2} /> Vérifié
 </span>
 )}
 </div>

 {/* Icône + localisation */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
 <div style={{
 width: 44, height: 44, borderRadius: '10px', flexShrink: 0,
 backgroundColor: tc.bg, border: `1px solid ${tc.color}33`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
 }}>
 <tc.icon size={20} color={tc.color} strokeWidth={1.6} />
 </div>
 <div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#44403c', fontWeight: 600 }}>
 <MapPin size={12} color="#a8a29e" />
 {inst.city}
 {inst.department !== '00' && <span style={{ color: '#a8a29e', fontWeight: 400 }}>({inst.department})</span>}
 </div>
 {inst.rating && (
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#d97706', fontWeight: 600, marginTop: '2px' }}>
 <Star size={11} fill="#d97706" color="#d97706" /> {inst.rating.toFixed(1)}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Corps de la carte */}
 <div style={{ padding: '1rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
 {/* Titre */}
 <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#1c1917', lineHeight: 1.35 }}>
 {inst.name}
 </h3>

 {/* Format badges */}
 <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
 {inst.format.map(f => (
 <span key={f} style={{
 fontSize: '0.65rem', fontWeight: 600,
 color: '#44403c', backgroundColor: '#f5f5f4',
 padding: '2px 8px', borderRadius: '20px',
 border: '1px solid #e7e5e4',
 }}>
 {FORMAT_LABELS[f as keyof typeof FORMAT_LABELS]}
 </span>
 ))}
 </div>

 {/* Description */}
 {inst.description && (
 <p style={{
 margin: 0, fontSize: '0.8rem', color: '#78716c', lineHeight: 1.55, flex: 1,
 display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
 } as React.CSSProperties}>
 {inst.description}
 </p>
 )}

 {/* Audience */}
 {inst.audience?.length > 0 && (
 <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
 {inst.audience.map(a => {
 const ac = AUDIENCE_CONFIG[a];
 return (
 <span key={a} style={{
 fontSize: '0.7rem', fontWeight: 600,
 color: ac.color, backgroundColor: ac.bg,
 padding: '3px 10px', borderRadius: '20px',
 border: `1.5px solid ${ac.color}33`,
 display: 'inline-flex', alignItems: 'center', gap: '4px',
 }}>
 <ac.icon size={11} strokeWidth={1.8} /> {ac.label}
 </span>
 );
 })}
 </div>
 )}

 {/* Cours hashtags */}
 <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
 {inst.courses.slice(0, 5).map(c => (
 <span key={c} style={{
 fontSize: '0.7rem', color: '#57534e',
 backgroundColor: '#f5f5f4', padding: '2px 8px',
 borderRadius: '6px', fontWeight: 500, border: '1px solid #e7e5e4',
 }}>
 #{COURSE_LABELS[c]}
 </span>
 ))}
 </div>
 </div>

 {/* Footer — CTA */}
 <div style={{ padding: '0 1.25rem 1.25rem' }}>
 {inst.website ? (
 <a href={inst.website} target="_blank" rel="noopener noreferrer" style={{
 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
 padding: '0.65rem', borderRadius: '10px', width: '100%',
 backgroundColor: '#1c1917', color: 'white',
 fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
 }}>
 Voir le site <ExternalLink size={13} />
 </a>
 ) : inst.phone ? (
 <a href={`tel:${inst.phone}`} style={{
 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
 padding: '0.65rem', borderRadius: '10px', width: '100%',
 border: '1.5px solid #1c1917', color: '#1c1917',
 fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
 }}>
 <Phone size={13} /> Contacter
 </a>
 ) : (
 <Link href="/contact?type=general" style={{
 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
 padding: '0.65rem', borderRadius: '10px', width: '100%',
 border: '1px solid #e7e5e4', color: '#78716c',
 fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none',
 }}>
 Infos
 </Link>
 )}
 </div>
 </div>
 );
}
