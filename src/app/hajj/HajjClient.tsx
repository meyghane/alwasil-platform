'use client';

import { useState } from 'react';
import { Plane, ExternalLink, Search, Star, MapPin, CheckCircle, XCircle, Phone, Globe, Users, BookOpen, Building2, Moon, Zap, type LucideIcon } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import {
 VOYAGE_TYPE_LABELS, VOYAGE_TYPE_COLORS,
 type HajjAgence, type HajjPackage,
 type VoyageType, type StarRating, type DepartCity,
} from '@/data/hajj';

type HajjClientProps = { hajjAgences: HajjAgence[]; hajjPackages: HajjPackage[] };

type Tab = 'packages' | 'agences' | 'guide';

const TABS: { key: Tab; label: string; icon: LucideIcon }[] = [
 { key: 'packages', label: 'Trouver mon offre', icon: Plane },
 { key: 'guide', label: 'Guide du pèlerin', icon: BookOpen },
];

const TYPE_FILTERS: { key: VoyageType | 'all'; label: string; icon: LucideIcon }[] = [
 { key: 'all', label: 'Tous', icon: Globe },
 { key: 'hajj', label: 'Hajj 2027', icon: Plane },
 { key: 'omra-ramadan', label: 'Omra Ramadan', icon: Moon },
 { key: 'omra-hors-saison',label: 'Omra hors saison', icon: Plane },
 { key: 'omra-express', label: 'Omra Express', icon: Zap },
];

const DEPART_CITIES: (DepartCity | 'Tous')[] = ['Tous', 'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille'];

const STAR_FILTERS: { key: StarRating | 0; label: string }[] = [
 { key: 0, label: '⭐ Tous' },
 { key: 5, label: '5' },
 { key: 4, label: '4' },
 { key: 3, label: '3' },
];

const BUDGET_FILTERS: { key: string; label: string; min: number; max: number }[] = [
 { key: 'all', label: ' Tous budgets', min: 0, max: Infinity },
 { key: '-1500', label: '< 1 500€', min: 0, max: 1500 },
 { key: '1500-3000', label: '1 500–3 000€', min: 1500, max: 3000 },
 { key: '3000-6000', label: '3 000–6 000€', min: 3000, max: 6000 },
 { key: '6000+', label: '6 000€+', min: 6000, max: Infinity },
];

function StarsDisplay({ count }: { count: number }) {
 return (
 <span style={{ color: '#f59e0b', fontSize: '0.78rem' }}>
 {''.repeat(count)}{''.repeat(5 - count)}
 </span>
 );
}

function AgenceNameById({ id, agences }: { id: string; agences: HajjAgence[] }) {
 const agence = agences.find(a => a.id === id);
 return <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{agence?.name ?? ' - '}</span>;
}

function offerQualityScore(pkg: HajjPackage, agence: HajjAgence | undefined): number {
 if (typeof pkg.qualityScore === 'number') return Math.max(0, Math.min(100, pkg.qualityScore));
 const fields = [
  pkg.description.length >= 120,
  pkg.includes.length >= 3,
  pkg.excludes.length > 0,
  Boolean(pkg.departure),
  Boolean(pkg.sourceUrl),
  Boolean(pkg.hotelMakkah),
  Boolean(pkg.hotelMadinah),
  Boolean(pkg.distanceMasjidHaram || pkg.distanceMasjidNabawi),
  pkg.verificationStatus === 'verified',
 ];
 const completeness = fields.filter(Boolean).length / fields.length;
 const rating = agence ? Math.min(5, Math.max(0, agence.rating)) / 5 : (pkg.stars || 0) / 5;
 const reviewConfidence = agence ? Math.min(1, Math.log10(Math.max(1, agence.reviews)) / 4) : 0;
 const age = agence ? Math.min(1, Math.max(0, new Date().getFullYear() - agence.since) / 20) : 0;
 return Math.round(completeness * 50 + rating * 25 + reviewConfidence * 15 + age * 10);
}

function isPastOffer(pkg: HajjPackage): boolean {
 const text = `${pkg.departure || ''} ${pkg.seasonYear || ''}`.toLocaleLowerCase('fr-FR');
 const yearMatch = text.match(/20(\d{2})/);
 if (!yearMatch) return false;
 const year = Number(`20${yearMatch[1]}`);
 const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
 const month = monthNames.findIndex(name => text.includes(name));
 if (year < new Date().getFullYear()) return true;
 if (year > new Date().getFullYear() || month < 0) return false;
 return month < new Date().getMonth();
}

export default function HajjClient({ hajjAgences, hajjPackages }: HajjClientProps) {
 const [tab, setTab] = useState<Tab>('packages');
 const [typeFilter, setTypeFilter] = useState<VoyageType | 'all'>('all');
 const [starsFilter, setStarsFilter] = useState<StarRating | 0>(0);
 const [budgetFilter, setBudgetFilter] = useState('all');
 const [departFilter, setDepartFilter] = useState<DepartCity | 'Tous'>('Tous');
 const [search, setSearch] = useState('');
 const [view, setView] = useState<'grid' | 'list'>('grid');

 const budgetObj = BUDGET_FILTERS.find(b => b.key === budgetFilter) ?? BUDGET_FILTERS[0];

 // Les anciennes offres Hajj 2026 ne doivent plus être proposées comme si elles étaient disponibles.
 // Elles restent dans la source historique, mais seules les offres 2027 vérifiées pourront apparaître ici.
 const currentPackages = hajjPackages.filter(p => !isPastOffer(p) && (p.type !== 'hajj' || (p.seasonYear ?? 0) >= 2027));
 const filteredPackages = currentPackages.filter(p => {
 const q = search.toLowerCase();
 return (typeFilter === 'all' || p.type === typeFilter) &&
 (starsFilter === 0 || p.stars === starsFilter) &&
 (p.price >= budgetObj.min && p.price <= budgetObj.max) &&
 (departFilter === 'Tous' || p.departCities.includes(departFilter as DepartCity)) &&
 (!q || p.name.toLowerCase().includes(q) || (hajjAgences.find(a => a.id === p.agenceId)?.name.toLowerCase() ?? '').includes(q));
 });

 // Sort: featured first
 const sorted = [...filteredPackages].sort((a, b) => {
  const scoreA = offerQualityScore(a, hajjAgences.find(agency => agency.id === a.agenceId));
  const scoreB = offerQualityScore(b, hajjAgences.find(agency => agency.id === b.agenceId));
  return scoreB - scoreA || Number(b.featured) - Number(a.featured);
 });

 return (
 <div>
 <PageHeader title="Hajj & Omra" titleAr="الحج والعمرة" description="Explorez des offres vérifiables, puis bénéficiez d’un accompagnement pour contacter le professionnel adapté à votre projet." color="#7652CA" emoji="" />
 <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>

 {/* Tabs */}
 <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' }}>
 {TABS.map(t => {
 const Icon = t.icon;
 return (
 <button key={t.key} onClick={() => setTab(t.key)}
 style={{ padding: '0.75rem 1.25rem', border: 'none', borderBottom: tab === t.key ? '2px solid #7652CA' : '2px solid transparent', backgroundColor: 'transparent', color: tab === t.key ? '#7652CA' : 'var(--text-secondary)', fontWeight: tab === t.key ? 700 : 400, fontSize: '0.88rem', cursor: 'pointer', marginBottom: '-2px', whiteSpace: 'nowrap', transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
 <Icon size={14} strokeWidth={1.8} />
 {t.label}
 </button>
 );
 })}
 </div>

 {/* ─── COMPARATEUR PACKAGES ─── */}
 {tab === 'packages' && (
 <>
 {/* Filters */}
 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
 {TYPE_FILTERS.map(f => {
 const color = f.key !== 'all' ? VOYAGE_TYPE_COLORS[f.key] : '#7652CA';
 const isActive = typeFilter === f.key;
 return (
 <button key={f.key} onClick={() => setTypeFilter(f.key)}
 style={{ padding: '0.4rem 0.9rem', borderRadius: '999px', border: isActive ? `2px solid ${color}` : '1.5px solid var(--border-color)', backgroundColor: isActive ? color : 'white', color: isActive ? 'white' : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
 {f.label}
 </button>
 );
 })}
 </div>

 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem', alignItems: 'center' }}>
 {/* Étoiles */}
 <div style={{ display: 'flex', gap: '0.35rem' }}>
 {STAR_FILTERS.map(f => (
 <button key={f.key} onClick={() => setStarsFilter(f.key)}
 style={{ padding: '0.3rem 0.7rem', borderRadius: '6px', border: starsFilter === f.key ? '2px solid #f59e0b' : '1.5px solid var(--border-color)', backgroundColor: starsFilter === f.key ? '#fffbeb' : 'transparent', color: starsFilter === f.key ? '#b45309' : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: starsFilter === f.key ? 700 : 400, cursor: 'pointer' }}>
 {f.label}
 </button>
 ))}
 </div>

 {/* Budget */}
 <select value={budgetFilter} onChange={e => setBudgetFilter(e.target.value)}
 style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1.5px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-primary)', backgroundColor: 'white', cursor: 'pointer', outline: 'none' }}>
 {BUDGET_FILTERS.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
 </select>

 {/* Ville départ */}
 <select value={departFilter} onChange={e => setDepartFilter(e.target.value as DepartCity | 'Tous')}
 style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1.5px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-primary)', backgroundColor: 'white', cursor: 'pointer', outline: 'none' }}>
 {DEPART_CITIES.map(c => <option key={c} value={c}> {c}</option>)}
 </select>

 {/* Search */}
 <div style={{ position: 'relative', flex: '1 1 200px' }}>
 <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
 <input type="text" placeholder="Chercher..." value={search} onChange={e => setSearch(e.target.value)}
 style={{ width: '100%', padding: '0.4rem 0.75rem 0.4rem 2rem', borderRadius: '6px', border: '1.5px solid var(--border-color)', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
 </div>
 </div>

 <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
 <strong style={{ color: 'var(--text-primary)' }}>{sorted.length}</strong> offre{sorted.length > 1 ? 's' : ''} trouvée{sorted.length > 1 ? 's' : ''}
 </p>

 {typeFilter === 'hajj' && sorted.length === 0 && (
 <div style={{ marginBottom: '1.25rem', padding: '1rem 1.1rem', borderRadius: '0.75rem', border: '1px solid #7652CA55', backgroundColor: '#7652CA0d', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
 <strong style={{ color: '#543398' }}>Hajj 2027 : offres à venir.</strong>{' '}
 Les offres seront présentées au fur et à mesure des disponibilités, avec leurs conditions et leurs détails pratiques.
 </div>
 )}

 {/* Package cards */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
 {sorted.map(pkg => {
 const typeColor = VOYAGE_TYPE_COLORS[pkg.type];
 const placesRatio = pkg.placesRestantes && pkg.places ? pkg.placesRestantes / pkg.places : 1;
 return (
 <div key={pkg.id} className="card" style={{ padding: 0, overflow: 'hidden', border: `1px solid ${typeColor}33`, borderTop: `3px solid ${typeColor}`, background: `linear-gradient(180deg, ${typeColor}08 0%, #ffffff 60%)` }}>
 {/* Top */}
 <div style={{ padding: '1.25rem 1.25rem 0.875rem' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
 <div>
 <span style={{ backgroundColor: `${typeColor}18`, color: typeColor, padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${typeColor}33` }}>
 {VOYAGE_TYPE_LABELS[pkg.type]}
 </span>
 {pkg.featured && (
 <span style={{ marginLeft: '0.35rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
 Mis en avant
 </span>
 )}
 </div>
 {pkg.stars && <StarsDisplay count={pkg.stars} />}
 </div>

 <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem', lineHeight: 1.2 }}><a href={`/hajj/offres/${encodeURIComponent(pkg.id)}`} style={{ color: 'inherit', textDecoration: 'none' }}>{pkg.name}</a></h3>
 <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
 Offre référencée et accompagnée par Al-Wasil
 </p>
 {/* Prix */}
 <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
 <span style={{ fontSize: '1.75rem', fontWeight: 800, color: typeColor }}>
 {pkg.price.toLocaleString('fr-FR')}€
 </span>
 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/ personne</span>
 {pkg.priceDouble && (
 <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>
 ({pkg.priceDouble.toLocaleString('fr-FR')}€ en double)
 </span>
 )}
 </div>

 {pkg.promo && (
 <div style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.75rem' }}>
 {pkg.promo}
 </div>
 )}

 <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.875rem' }}>{pkg.description}</p>

 {/* Infos clés */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.875rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
 <span> {pkg.duration} jours</span>
 <span> {pkg.departCities.join(', ')}</span>
 {pkg.distanceMasjidHaram && <span> {pkg.distanceMasjidHaram}m du Haram</span>}
 {pkg.distanceMasjidNabawi && <span> {pkg.distanceMasjidNabawi}m du Nabawi</span>}
 {pkg.departure && <span> {pkg.departure}</span>}
 {pkg.hotelMakkah && <span> {pkg.hotelMakkah.length > 22 ? pkg.hotelMakkah.slice(0, 22) + '…' : pkg.hotelMakkah}</span>}
 {pkg.hotelMadinah && <span> {pkg.hotelMadinah.length > 22 ? pkg.hotelMadinah.slice(0, 22) + '…' : pkg.hotelMadinah}</span>}
 </div>
 </div>

 {/* Includes/Excludes */}
 <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafaf9' }}>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
 {pkg.includes.slice(0, 6).map(inc => (
 <div key={inc} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.3rem', fontSize: '0.72rem', color: '#543398' }}>
 <CheckCircle size={11} color="#c9b6ec" style={{ flexShrink: 0, marginTop: '2px' }} />
 <span>{inc}</span>
 </div>
 ))}
 {pkg.excludes.slice(0, 2).map(exc => (
 <div key={exc} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.3rem', fontSize: '0.72rem', color: '#7f1d1d' }}>
 <XCircle size={11} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
 <span>{exc}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Footer */}
 <div style={{ padding: '0.875rem 1.25rem' }}>
 {pkg.placesRestantes !== undefined && pkg.places && (
 <div style={{ marginBottom: '0.875rem' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
 <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
 <Users size={11} /> {pkg.placesRestantes} places restantes
 </span>
 <span>{pkg.places - pkg.placesRestantes}/{pkg.places} réservées</span>
 </div>
 <div style={{ height: '5px', backgroundColor: '#f5f5f4', borderRadius: '999px', overflow: 'hidden' }}>
 <div style={{ height: '100%', width: `${(1 - placesRatio) * 100}%`, backgroundColor: placesRatio < 0.2 ? '#ef4444' : typeColor, borderRadius: '999px' }} />
 </div>
 {placesRatio < 0.2 && (
 <p style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, marginTop: '0.25rem' }}> Dernières places !</p>
 )}
 </div>
 )}

 <a href={`/contact?type=hajj-devis&offer_id=${encodeURIComponent(pkg.id)}&partner_id=${encodeURIComponent(pkg.agenceId)}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', backgroundColor: typeColor, color: 'white', padding: '0.6rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
 Demander un devis <ExternalLink size={13} />
 </a>
 </div>
 </div>
 );
 })}
 </div>

 {sorted.length === 0 && (
 <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
 <Plane size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
 <p>Aucune offre ne correspond à vos critères.</p>
 </div>
 )}
 <section aria-labelledby="hajj-faq" style={{ marginTop: '2rem', maxWidth: '820px' }}>
  <h2 id="hajj-faq" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Questions fréquentes</h2>
  {[
   ['Al-Wasil vend-il directement les séjours ?', 'Non. Al-Wasil référence des offres documentées, vous aide à formuler votre demande et la transmet au professionnel concerné. Le contrat et le paiement sont ensuite conclus directement avec lui.'],
   ['Les prix et les places sont-ils définitifs ?', 'Non. Ils correspondent à la dernière information disponible au moment de la vérification. Le professionnel doit confirmer le prix, les places et les conditions avant toute réservation.'],
   ['Que contient une demande de devis ?', 'Vos dates, votre ville de départ, le nombre de voyageurs, votre budget et vos besoins particuliers. Ces informations permettent au professionnel de répondre avec une formule adaptée.'],
  ].map(([question, answer]) => <details key={question} style={{ background: 'white', border: '1px solid #e2d7f5', borderRadius: 10, padding: '0.8rem 1rem', marginBottom: '0.55rem' }}><summary style={{ cursor: 'pointer', fontWeight: 700 }}>{question}</summary><p style={{ color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 0 }}>{answer}</p></details>)}
 </section>
 </>
 )}

 {/* ─── AGENCES ─── */}
 {tab === 'agences' && (
 <>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
 {hajjAgences.map(a => (
 <div key={a.id} className="card" style={{ padding: '1.5rem' }}>
 <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
 <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#f0fff8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
 {a.logoEmoji}
 </div>
 <div style={{ flex: 1 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
 <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{a.name}</h3>
 {a.agrée && <span style={{ backgroundColor: '#f0ebfa', color: '#543398', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}> Agréé</span>}
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
 <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', color: '#f59e0b' }}>
 <Star size={13} fill="#f59e0b" />
 <strong style={{ color: 'var(--text-primary)' }}>{a.rating}</strong>
 <span style={{ color: 'var(--text-secondary)' }}>({a.reviews.toLocaleString('fr-FR')} avis)</span>
 </span>
 <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>depuis {a.since}</span>
 </div>
 <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
 <MapPin size={10} style={{ display: 'inline' }} /> {a.location}
 </p>
 </div>
 </div>

 <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.875rem' }}>{a.description}</p>

 <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
 {a.tags.map(tag => (
 <span key={tag} style={{ backgroundColor: '#f0fff8', color: '#7652CA', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem' }}>#{tag}</span>
 ))}
 </div>

 <div style={{ display: 'flex', gap: '0.5rem' }}>
 {a.website && (
 <a href={a.website} target="_blank" rel="noopener noreferrer"
 style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', backgroundColor: '#7652CA', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
 <Globe size={14} /> Visiter <ExternalLink size={12} />
 </a>
 )}
 {a.phone && (
 <a href={`tel:${a.phone}`}
 style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
 <Phone size={14} />
 </a>
 )}
 </div>
 </div>
 ))}
 </div>
 </>
 )}

 {/* ─── GUIDE DU PÈLERIN ─── */}
 {tab === 'guide' && (
 <article style={{ maxWidth: '820px' }}>
 <header style={{ marginBottom: '2.5rem' }}><p style={{ color: '#7652CA', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.75rem', marginBottom: '.6rem' }}>Préparer son pèlerinage</p><h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', lineHeight: 1.05, margin: 0, maxWidth: 680 }}>Les informations essentielles avant votre Hajj ou votre Omra</h2><p style={{ maxWidth: 680, color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '1rem' }}>Documents, budget, calendrier et conseils pratiques : cette page vous aide à préparer votre départ avec méthode. Les conditions administratives et sanitaires doivent toujours être confirmées auprès de votre agence et des autorités compétentes.</p></header>
 {[
 {
 icon: '',
 title: 'Documents obligatoires',
 color: '#7652CA',
 items: [
 'Passeport valide (min. 6 mois après le retour)',
 'Visa Hajj ou Omra (obtenu via votre agence)',
 'Vaccin méningite ACWY (obligatoire)',
 'Vaccin COVID selon conditions en vigueur',
 'Assurance voyage internationale',
 'Acte de mariage (pour les couples)',
 'Mahram obligatoire pour les femmes (Hajj)',
 ],
 },
 {
 icon: '',
 title: 'Budget à prévoir (en plus du package)',
 color: '#f59e0b',
 items: [
 'Vaccins : 50–100€',
 'Ihram (2 pièces) : 20–50€',
 'Argent de poche (Makkah/Madinah) : 300–500€',
 'Sacrifices/Udhiyya si non inclus : 100–150€',
 'Cadeaux/souvenirs : selon budget',
 'Médicaments (anti-douleur, antidiarrhéique) : 30€',
 ],
 },
 {
 icon: '',
 title: 'Calendrier - prochain Hajj',
 color: '#7652CA',
 items: [
 '8 Dhul Hijja : Départ vers Mina (Yawm al-Tarwiyah)',
 '9 Dhul Hijja : Arafat - Le jour le plus important du Hajj',
 '10 Dhul Hijja : Muzdalifah, lapidation, sacrifice, tawaf',
 '11–12 Dhul Hijja : Jours de Tachrik (nuit à Mina)',
 '13 Dhul Hijja : Départ progressif',
 ' Dates du Hajj 2027 : à confirmer selon le calendrier officiel et les autorités saoudiennes',
 ],
 },
 {
 icon: '',
 title: 'Essentiels à emporter',
 color: '#7652CA',
 items: [
 'Ihram (hommes) ou vêtements couvrants (femmes)',
 'Chaussures légères/sandales pour le Haram',
 'Spray eau de ZamZam pour la chaleur',
 'Ventilateur portable (été = 40°C+)',
 'Poche de prière (tapis léger)',
 'Chapelet (subha)',
 'Livre de doua\' du Hajj/Omra',
 'Médicaments personnels x2 (réserve)',
 ],
 },
 {
 icon: '',
 title: 'Erreurs fréquentes à éviter',
 color: '#ef4444',
 items: [
 'Choisir uniquement sur le prix sans vérifier l\'agrément',
 'Partir sans apprendre les rites du Hajj/Omra',
 'Ne pas prendre d\'assurance voyage',
 'Oublier les vaccins obligatoires (refus à l\'aéroport)',
 'Emporter trop de bagages (chaleur + déplacements fréquents)',
 'Négliger sa santé avant le départ (bilan médical conseillé)',
 ],
 },
 ].map(section => (
 <section key={section.title} style={{ marginBottom: '2.4rem', paddingBottom: '2rem', borderBottom: '1px solid #e6e1ef' }}>
 <h3 style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: '.85rem', color: section.color }}>{section.title}</h3>
 <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'grid', gap: '.65rem' }}>{section.items.map(item => <li key={item} style={{ fontSize: '.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, paddingLeft: '.25rem' }}>{item}</li>)}</ul>
 </section>
 ))}
 <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '.86rem' }}>Al-Wasil facilite la recherche d’une offre et la mise en relation avec un professionnel. Les formalités, tarifs, visas, réservations et conditions finales relèvent de l’agence sélectionnée.</p>
 </article>
 )}
 </div>
 </div>
 );
}
