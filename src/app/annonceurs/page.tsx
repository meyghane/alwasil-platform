'use client';

import { useState } from 'react';
import { TrendingUp, Eye, MousePointer, Users, BarChart2, Mail, CheckCircle, Image, Tag, Zap } from 'lucide-react';

const ACCENT = '#c9973a';
const GREEN = '#c9973a';

type Segment = 'solo' | 'boost' | 'pro' | 'agence';

type FormatCard = {
 id: string;
 name: string;
 emoji: string;
 description: string;
 placement: string;
 imageDims?: string;
 imageFormat?: string;
 price: string;
 duration: string;
 renewalNote?: string;
 audience: string;
 cta: string;
 featured?: boolean;
 badge?: string;
 permanent?: boolean;
};

const FORMATS_BY_SEGMENT: Record<Segment, FormatCard[]> = {
 solo: [
 {
 id: 'fiche-avant',
 name: 'Fiche Mise en Avant',
 emoji: '⭐',
 description: 'Ta librairie, cabinet ou service passe en tête de liste dans sa catégorie avec un badge "Sponsorisé" discret.',
 placement: 'En tête de la section correspondante',
 price: '199€',
 duration: '3 mois',
 renewalNote: 'Renouvellement 159€',
 audience: 'Visiteurs de la section ciblée',
 cta: 'Mettre en avant',
 featured: true,
 badge: '⭐ Recommandé',
 },
 {
 id: 'article-seo',
 name: 'Article Sponsorisé SEO',
 emoji: '',
 description: 'Un article dédié à ta marque, rédigé par Al-Wasil ou fourni par toi. Indexé sur Google. Visible indéfiniment.',
 placement: 'Blog / section actualités',
 imageDims: '1200×628px',
 imageFormat: 'JPEG ou WebP · max 500ko',
 price: '299€',
 duration: 'Permanent',
 audience: 'Trafic organique Google + visiteurs fidèles',
 cta: 'Publier un article',
 permanent: true,
 },
 {
 id: 'pack-lancement',
 name: 'Pack Lancement',
 emoji: '',
 description: 'Fiche mise en avant + mention dans la newsletter de lancement. Idéal pour un nouveau commerce ou une nouvelle offre.',
 placement: 'Section ciblée + Newsletter',
 price: '299€',
 duration: '3 mois',
 renewalNote: 'Renouvellement 239€',
 audience: 'Visiteurs section + abonnés newsletter',
 cta: 'Démarrer',
 badge: ' Pack',
 },
 ],
 boost: [
 {
 id: 'sidebar',
 name: 'Bannière Sidebar',
 emoji: '',
 description: 'Bannière Medium Rectangle dans la colonne latérale des pages à forte intention d\'achat : Emploi, Santé, Solidarité.',
 placement: 'Sidebar Emploi · Santé · Solidarité',
 imageDims: '300×250px',
 imageFormat: 'JPEG/PNG/WebP · max 150ko · fond plein obligatoire',
 price: '399€',
 duration: '3 mois',
 renewalNote: 'Renouvellement 319€',
 audience: 'Visiteurs pages à forte intention',
 cta: 'Réserver',
 featured: true,
 badge: '⭐ Recommandé',
 },
 {
 id: 'newsletter',
 name: 'Sponsoring Newsletter',
 emoji: '',
 description: 'Ta marque présentée dans notre newsletter mensuelle envoyée à la base email qualifiée.',
 placement: 'Newsletter mensuelle (bandeau dédié)',
 imageDims: '600×200px',
 imageFormat: 'JPEG/PNG · max 100ko · ratio 3:1',
 price: '199€',
 duration: 'par envoi',
 audience: 'Abonnés email qualifiés',
 cta: 'Sponsoriser',
 },
 {
 id: 'habillage',
 name: 'Habillage / Skin Premium',
 emoji: '',
 description: 'Les deux gouttières latérales + header coordonnés. Votre univers visuel enveloppe toute la page. Impact maximal.',
 placement: 'Gouttière gauche + droite + header (toutes pages)',
 imageDims: '160×600px × 2 + 970×90px',
 imageFormat: 'PNG/WebP · Fond transparent ou plein · max 300ko/pièce',
 price: '599€',
 duration: '3 mois',
 renewalNote: 'Renouvellement 479€',
 audience: 'Tous les visiteurs du site',
 cta: 'Réserver',
 badge: ' Premium',
 },
 ],
 pro: [
 {
 id: 'header',
 name: 'Bannière Header Leaderboard',
 emoji: '',
 description: 'Emplacement premium en haut de toutes les pages, visible en premier à l\'ouverture. Maximum de visibilité brute.',
 placement: 'En-tête de toutes les pages',
 imageDims: '970×90px (ou 728×90px mobile)',
 imageFormat: 'JPEG/PNG/WebP · max 200ko · fond plein · texte lisible sans survol',
 price: '990€',
 duration: '3 mois',
 renewalNote: 'Renouvellement 790€',
 audience: 'Tous les visiteurs du site',
 cta: 'Réserver',
 featured: true,
 badge: '⭐ Premium',
 },
 {
 id: 'article-long',
 name: 'Article Long Format (SEO renforcé)',
 emoji: '',
 description: 'Article 1500+ mots rédigé par Al-Wasil avec maillage interne, FAQ Schema.org, et optimisation GEO (ChatGPT/Perplexity). Visible pour des années.',
 placement: 'Blog + mise en avant section thématique',
 imageDims: '1200×628px (OG) + visuels internes 800×450px',
 imageFormat: 'JPEG/WebP · max 500ko · ratio 1.91:1 pour OG',
 price: '490€',
 duration: 'Permanent',
 audience: 'Trafic organique + visiteurs fidèles',
 cta: 'Commander l\'article',
 permanent: true,
 },
 {
 id: 'pack-pro',
 name: 'Pack Pro',
 emoji: '',
 description: 'Header leaderboard + article long format + newsletter × 2. Le pack pour installer ta marque durablement. Économie 35%.',
 placement: 'Multi-placements',
 price: '1 490€',
 duration: '3 mois',
 renewalNote: 'Renouvellement 1 190€',
 audience: 'Ensemble des visiteurs',
 cta: 'Demander ce pack',
 badge: ' Pack Pro',
 featured: true,
 },
 ],
 agence: [
 {
 id: 'agence-starter',
 name: 'Pack Agence Starter',
 emoji: '',
 description: 'Pour tester avec 1 client. Accès tarif grossiste, rapport co-brandé, facturation mensuelle acceptée.',
 placement: 'Au choix (1 format BOOST inclus)',
 price: '279€',
 duration: '3 mois',
 audience: '1 client',
 cta: 'Contacter',
 },
 {
 id: 'agence-multi',
 name: 'Pack Agence Multi-clients',
 emoji: '',
 description: 'Tarif grossiste −30% sur tous les formats. Pour les agences gérant plusieurs marques halal-friendly. Rapport PDF mensuel co-brandé pour chaque client.',
 placement: 'Tous formats disponibles',
 price: '−30%',
 duration: 'sur tous les formats',
 audience: '3 clients minimum',
 cta: 'Contacter',
 featured: true,
 badge: ' Agence',
 },
 {
 id: 'partenariat',
 name: 'Partenariat & Échange de visibilité',
 emoji: '',
 description: 'Influenceur, créateur, media Muslim-friendly : tu promeus Al-Wasil, on te donne de la visibilité. Story, reel, mention newsletter — à définir ensemble.',
 placement: 'À définir selon audience',
 price: 'Sur devis',
 duration: 'Variable',
 audience: 'Audience du partenaire',
 cta: 'Proposer',
 },
 ],
};

const SEGMENT_LABELS: Record<Segment, { label: string; desc: string; emoji: string }> = {
 solo: { label: 'SOLO', desc: 'Commerce local · Artisan', emoji: '' },
 boost: { label: 'BOOST', desc: 'E-commerce · Boutique en ligne', emoji: '' },
 pro: { label: 'PRO', desc: 'Services premium · Institutions', emoji: '' },
 agence: { label: 'AGENCE', desc: 'Pour vos clients', emoji: '' },
};

const PREMIUM_FORMATS = [
 {
 name: 'Gouttières (Skyscraper)',
 dims: '160×600px × 2',
 placement: 'Colonnes gauche + droite',
 format: 'PNG/WebP, fond transparent OK',
 maxSize: '200ko/pièce',
 note: 'Nécessite écran ≥ 1420px de large pour être visible',
 },
 {
 name: 'Header Leaderboard',
 dims: '970×90px · fallback 728×90px',
 placement: 'En-tête toutes pages',
 format: 'JPEG/PNG/WebP, fond plein',
 maxSize: '200ko',
 note: 'Version mobile automatiquement masquée si < 728px',
 },
 {
 name: 'Foutter (bas de page)',
 dims: '970×250px · fallback 728×90px',
 placement: 'Footer sticky ou statique',
 format: 'JPEG/PNG/WebP, fond plein',
 maxSize: '300ko',
 note: 'Haute visibilité en fin de scroll — bon pour CTA',
 },
 {
 name: 'Medium Rectangle (Sidebar)',
 dims: '300×250px',
 placement: 'Colonne latérale des pages',
 format: 'JPEG/PNG/WebP, fond plein obligatoire',
 maxSize: '150ko',
 note: 'Format le plus performant en CTR (IAB standard)',
 },
 {
 name: 'Natif In-Article',
 dims: '1200×628px (ratio 1.91:1)',
 placement: 'Intégré dans le corps des articles',
 format: 'JPEG/WebP, même style que le contenu',
 maxSize: '500ko',
 note: 'CTR × 3 vs bannière classique — paraît éditorial',
 },
 {
 name: 'Newsletter Bandeau',
 dims: '600×200px (ratio 3:1)',
 placement: 'En-tête de la newsletter mensuelle',
 format: 'JPEG/PNG, fond plein, texte lisible seul',
 maxSize: '100ko',
 note: 'Certains clients email bloquent les images — prévois du texte alt',
 },
];

const ANNONCEURS_CIBLES = [
 { emoji: '', type: 'Agences Hajj & Omra', desc: 'Visibilité maximale avant la saison et pendant Ramadan' },
 { emoji: '', type: 'Marques modest fashion', desc: 'Abaya, hijab, vêtements islamiques — audience cible directe' },
 { emoji: '', type: 'Librairies & Instituts', desc: 'Cours d\'arabe, Coran, rentrée islamique, inscriptions' },
 { emoji: '', type: 'Parfums & bien-être sunnah', desc: 'Oud, huile de nigelle, musc — audience 100% qualifiée' },
 { emoji: '', type: 'Praticiens & cliniques', desc: 'Hijama, sage-femmes, médecins Muslim-friendly' },
 { emoji: '', type: 'Recruteurs Muslim-friendly', desc: 'Toucher des candidats recherchant des employeurs respectueux' },
 { emoji: '', type: 'Associations & ONG', desc: 'Collectes Ramadan, aide d\'urgence, maraudes' },
 { emoji: '', type: 'Restaurants & épiceries halal', desc: 'Drive local qualifié, événements communautaires' },
];

export default function AnnonceursPage() {
 const [activeSegment, setActiveSegment] = useState<Segment>('solo');
 const [formData, setFormData] = useState({ nom: '', email: '', organisation: '', format: '', message: '' });
 const [sent, setSent] = useState(false);
 const [loading, setLoading] = useState(false);

 async function handleSubmit(e: React.FormEvent) {
 e.preventDefault();
 setLoading(true);
 try {
 await fetch('/api/contact', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 type: 'annonceur',
 fields: {
 Nom: formData.nom,
 Email: formData.email,
 Organisation: formData.organisation || '—',
 Format: formData.format || '—',
 Message: formData.message,
 },
 }),
 });
 } finally {
 setLoading(false);
 setSent(true);
 }
 }

 const formats = FORMATS_BY_SEGMENT[activeSegment];

 return (
 <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>

 {/* Hero */}
 <div style={{ textAlign: 'center', padding: '3rem 1rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: `${ACCENT}12`, color: ACCENT, padding: '0.35rem 1rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.25rem' }}>
 <TrendingUp size={14} /> Annoncez sur Al-Wasil
 </div>
 <h1 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
 Touchez la communauté musulmane française là où elle s&apos;informe
 </h1>
 <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
 Al-Wasil est la plateforme de référence pour les musulmans de France. Emploi, santé, éducation, Hajj, librairies…
 Vos annonces atteignent une audience <strong>100% qualifiée et engagée</strong>.
 </p>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
 {[
 { icon: <Users size={22} color={ACCENT} />, value: '12 000+', label: 'Visiteurs/mois', sub: 'en croissance' },
 { icon: <Eye size={22} color='#c9973a' />, value: '45 000+', label: 'Pages vues/mois', sub: 'audience engagée' },
 { icon: <MousePointer size={22} color='#f59e0b' />, value: '4,2%', label: 'Taux de clic moyen', sub: '(2× la moyenne web)' },
 { icon: <BarChart2 size={22} color='#ef4444' />, value: '8 sections', label: 'Thématiques ciblées', sub: 'Hajj, Emploi, Santé…' },
 ].map(s => (
 <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
 <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>{s.icon}</div>
 <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.value}</p>
 <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0.25rem 0 0.1rem' }}>{s.label}</p>
 <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>{s.sub}</p>
 </div>
 ))}
 </div>

 {/* Audience cible */}
 <div style={{ marginBottom: '3rem' }}>
 <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Qui sont nos visiteurs ?</h2>
 <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Une audience musulmane active, en France, cherchant des ressources concrètes pour leur quotidien.</p>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.875rem' }}>
 {[
 { label: 'Femmes', value: '62%', color: '#c9973a' },
 { label: 'Paris & IdF', value: '68%', color: ACCENT },
 { label: '18–35 ans', value: '71%', color: '#c9973a' },
 { label: 'Visite hebdo', value: '54%', color: '#f59e0b' },
 ].map(s => (
 <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
 <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <span style={{ fontSize: '1.35rem', fontWeight: 800, color: s.color }}>{s.value}</span>
 </div>
 <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.label}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Pour qui */}
 <div style={{ marginBottom: '3rem' }}>
 <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>Idéal pour</h2>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
 {ANNONCEURS_CIBLES.map(a => (
 <div key={a.type} style={{ display: 'flex', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', backgroundColor: 'white', alignItems: 'flex-start' }}>
 <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{a.emoji}</span>
 <div>
 <p style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.15rem' }}>{a.type}</p>
 <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{a.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* ── RAMADAN SPECIAL ── */}
 <div style={{ marginBottom: '3rem', borderRadius: '1rem', overflow: 'hidden', background: 'linear-gradient(135deg, #7c2d12 0%, #dc2626 50%, #f59e0b 100%)', padding: '2rem', color: 'white', position: 'relative' }}>
 <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>
 OFFRE SAISONNIÈRE
 </div>
 <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
 Pack Ramadan 2027
 </h2>
 <p style={{ opacity: 0.9, fontSize: '0.92rem', lineHeight: 1.5, maxWidth: '560px', marginBottom: '1.5rem' }}>
 Pendant Ramadan, le trafic Al-Wasil × 3. Visibilité maximale pendant 30 jours sur toute la communauté en période de forte intention.
 </p>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
 {[
 { name: 'Pack Ramadan Essentiel', price: '499€', desc: 'Header + Sidebar + Mention newsletter Ramadan · 30 jours' },
 { name: 'Pack Ramadan Complet', price: '799€', desc: 'Tout inclus + article "Spécial Ramadan" rédigé par Al-Wasil · 30 jours' },
 ].map(p => (
 <div key={p.name} style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: '1rem' }}>
 <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{p.name}</p>
 <p style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{p.price}</p>
 <p style={{ fontSize: '0.75rem', opacity: 0.85, lineHeight: 1.4 }}>{p.desc}</p>
 </div>
 ))}
 </div>
 <p style={{ fontSize: '0.8rem', opacity: 0.8 }}> Réservations ouvertes dès décembre 2026. Places limitées.</p>
 </div>

 {/* ── FORMATS & TARIFS segmentés ── */}
 <div style={{ marginBottom: '3rem' }}>
 <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>Formats & Tarifs</h2>
 <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
 Tous les emplacements sont réservés <strong>exclusivement à des annonceurs Muslim-friendly</strong>. Nous sélectionnons chaque annonceur. Tarifs <strong>one-shot par trimestre</strong> — pas d&apos;abonnement.
 </p>

 {/* Tabs segments */}
 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
 {(Object.keys(SEGMENT_LABELS) as Segment[]).map(seg => {
 const s = SEGMENT_LABELS[seg];
 const isActive = activeSegment === seg;
 return (
 <button key={seg} onClick={() => setActiveSegment(seg)} style={{
 padding: '0.6rem 1.1rem', borderRadius: '10px',
 border: isActive ? `2px solid ${ACCENT}` : '1.5px solid var(--border-color)',
 backgroundColor: isActive ? ACCENT : 'white',
 color: isActive ? 'white' : 'var(--text-secondary)',
 fontSize: '0.85rem', fontWeight: isActive ? 700 : 400,
 cursor: 'pointer', transition: 'all 0.15s',
 display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.1rem',
 }}>
 <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{s.emoji} {s.label}</span>
 <span style={{ fontSize: '0.7rem', opacity: isActive ? 0.85 : 0.65 }}>{s.desc}</span>
 </button>
 );
 })}
 </div>

 {/* Format cards */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
 {formats.map(f => (
 <div key={f.id} className="card" style={{
 padding: '1.25rem',
 borderTop: f.featured ? `3px solid ${ACCENT}` : undefined,
 position: 'relative',
 display: 'flex', flexDirection: 'column',
 }}>
 {f.badge && (
 <span style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: f.featured ? ACCENT : '#f5f5f4', color: f.featured ? 'white' : '#78716c', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
 {f.badge}
 </span>
 )}
 <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{f.emoji}</div>
 <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{f.name}</h3>
 <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.875rem', flex: 1 }}>{f.description}</p>

 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.875rem' }}>
 <span> {f.placement}</span>
 {f.imageDims && <span> {f.imageDims}</span>}
 {f.imageFormat && <span> {f.imageFormat}</span>}
 <span> {f.audience}</span>
 </div>

 <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem', marginTop: 'auto' }}>
 <div>
 <span style={{ fontSize: f.price.startsWith('−') ? '1.25rem' : '1.5rem', fontWeight: 800, color: ACCENT }}>{f.price}</span>
 <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '0.3rem' }}>
 {f.permanent ? '· permanent' : `/ ${f.duration}`}
 </span>
 {f.renewalNote && (
 <div style={{ fontSize: '0.7rem', color: GREEN, fontWeight: 600, marginTop: '0.1rem' }}>↩ {f.renewalNote}</div>
 )}
 </div>
 <button
 onClick={() => {
 setFormData(prev => ({ ...prev, format: f.name }));
 document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
 }}
 style={{ backgroundColor: ACCENT, color: 'white', border: 'none', padding: '0.45rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
 {f.cta}
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* ── SPECS TECHNIQUES FORMATS VISUELS ── */}
 <div style={{ marginBottom: '3rem' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
 <Image size={22} color={ACCENT} />
 <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Specs techniques — Formats d&apos;image</h2>
 </div>
 <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
 Respectez ces dimensions pour éviter tout recadrage et maximiser la netteté de votre visuel.
 </p>
 <div style={{ overflowX: 'auto' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
 <thead>
 <tr style={{ backgroundColor: '#f5f5f4' }}>
 {['Format', 'Dimensions', 'Placement', 'Fichier accepté', 'Poids max', 'Note'].map(h => (
 <th key={h} style={{ padding: '0.65rem 0.875rem', textAlign: 'left', fontWeight: 700, color: '#1c1917', borderBottom: '2px solid var(--border-color)', whiteSpace: 'nowrap' }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {PREMIUM_FORMATS.map((f, i) => (
 <tr key={f.name} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#fafaf9' }}>
 <td style={{ padding: '0.65rem 0.875rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{f.name}</td>
 <td style={{ padding: '0.65rem 0.875rem', fontFamily: 'monospace', color: ACCENT, fontWeight: 700, borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>{f.dims}</td>
 <td style={{ padding: '0.65rem 0.875rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>{f.placement}</td>
 <td style={{ padding: '0.65rem 0.875rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>{f.format}</td>
 <td style={{ padding: '0.65rem 0.875rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>{f.maxSize}</td>
 <td style={{ padding: '0.65rem 0.875rem', color: 'var(--text-secondary)', fontSize: '0.75rem', borderBottom: '1px solid var(--border-color)', lineHeight: 1.4 }}>{f.note}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* ── TRACKING & ROI ── */}
 <div style={{ marginBottom: '3rem', padding: '1.75rem', borderRadius: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
 <Tag size={20} color={ACCENT} />
 <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Tracking & ROI — Vous voyez tout</h2>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
 {[
 {
 icon: '',
 title: 'Lien UTM tracké',
 body: 'Chaque annonce utilise un lien UTM unique :\nutm_source=alwasil\nutm_medium=banniere|article|newsletter\nutm_campaign=nom-campagne\nutm_content=format-emplacement',
 code: true,
 },
 {
 icon: '',
 title: 'Rapport mensuel PDF',
 body: 'Impressions, clics, CTR, pages sources, pics de trafic. Envoyé chaque 1er du mois par email. Co-brandé pour les agences.',
 code: false,
 },
 {
 icon: '',
 title: 'Viewability (standard IAB)',
 body: 'Une impression est comptée quand ≥ 50% du visuel est visible pendant ≥ 1 seconde. Mesure via IntersectionObserver. Pas de gonflage artificiel.',
 code: false,
 },
 {
 icon: '',
 title: 'Pixel Meta / GA4',
 body: 'Si vous avez un Pixel Meta, on ajoute un event fbq("track","ViewContent") sur impression + fbq("track","Lead") sur clic. Idem GA4 event ad_impression.',
 code: false,
 },
 {
 icon: '',
 title: 'A/B Test créatif',
 body: 'Testez 2 visuels en rotation 50/50 sur 2 semaines. On vous livre les résultats CTR comparés et on garde le gagnant.',
 code: false,
 },
 {
 icon: '',
 title: 'Ciblage sectionnel',
 body: 'Votre annonce peut être restreinte à une section spécifique (ex: Hajj seulement, ou Santé + Solidarité). Même prix, plus de pertinence.',
 code: false,
 },
 ].map(item => (
 <div key={item.title} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
 <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
 <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
 <div>
 <p style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.35rem' }}>{item.title}</p>
 {item.code ? (
 <pre style={{ fontSize: '0.7rem', backgroundColor: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '6px', margin: 0, lineHeight: 1.6, overflowX: 'auto', color: '#334155' }}>
 {item.body}
 </pre>
 ) : (
 <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{item.body}</p>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>

 <div style={{ backgroundColor: `${GREEN}10`, border: `1px solid ${GREEN}30`, borderRadius: '10px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
 <Zap size={18} color={GREEN} style={{ flexShrink: 0, marginTop: '1px' }} />
 <div>
 <p style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.2rem', color: GREEN }}>ROI type constaté</p>
 <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
 Une agence Hajj avec fiche mise en avant (199€/3 mois) génère en moyenne 12–18 demandes de devis qualifiées par mois.
 À 1 500€ de marge par voyage, <strong>1 seule conversion = ×10 le budget pub</strong>.
 Un article SEO sur "omra pas cher" peut générer 300–800 visites/mois pendant 2 ans.
 </p>
 </div>
 </div>
 </div>

 {/* Formulaire de contact */}
 <div id="contact-form" style={{ maxWidth: '620px' }}>
 <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
 <Mail size={22} color={ACCENT} /> Contactez-nous
 </h2>
 <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
 Réponse sous 24h ouvrées. Nous étudions toutes les demandes d&apos;annonceurs.
 </p>

 {sent ? (
 <div style={{ padding: '2rem', borderRadius: '1rem', backgroundColor: '#f0fff8', border: '1px solid #a0f0c8', textAlign: 'center' }}>
 <CheckCircle size={36} color="#d4a853" style={{ marginBottom: '0.75rem' }} />
 <h3 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>Message reçu </h3>
 <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nous revenons vers vous sous 24h. Barak Allahou fikoum !</p>
 </div>
 ) : (
 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
 <div>
 <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Nom / Prénom *</label>
 <input required type="text" value={formData.nom} onChange={e => setFormData(p => ({ ...p, nom: e.target.value }))}
 style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
 </div>
 <div>
 <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Email *</label>
 <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
 style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
 </div>
 </div>
 <div>
 <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Marque / Organisation</label>
 <input type="text" value={formData.organisation} onChange={e => setFormData(p => ({ ...p, organisation: e.target.value }))}
 placeholder="Ex: Hermood, Al-Aman Voyages…"
 style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
 </div>
 <div>
 <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Format / Offre souhaité</label>
 <select value={formData.format} onChange={e => setFormData(p => ({ ...p, format: e.target.value }))}
 style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
 <option value="">-- Choisir une offre --</option>
 <optgroup label="SOLO — Commerce local">
 <option>Fiche Mise en Avant — 199€ / 3 mois</option>
 <option>Article Sponsorisé SEO — 299€ permanent</option>
 <option>Pack Lancement — 299€ / 3 mois</option>
 </optgroup>
 <optgroup label="BOOST — E-commerce">
 <option>Bannière Sidebar — 399€ / 3 mois</option>
 <option>Sponsoring Newsletter — 199€ / envoi</option>
 <option>Habillage / Skin Premium — 599€ / 3 mois</option>
 </optgroup>
 <optgroup label="PRO — Services premium">
 <option>Bannière Header — 990€ / 3 mois</option>
 <option>Article Long Format SEO — 490€ permanent</option>
 <option>Pack Pro — 1 490€ / 3 mois</option>
 </optgroup>
 <optgroup label="Saisonniers">
 <option>Pack Ramadan Essentiel — 499€ / 30 jours</option>
 <option>Pack Ramadan Complet — 799€ / 30 jours</option>
 </optgroup>
 <option value="agence">Offre Agence / Multi-clients</option>
 <option value="partenariat">Partenariat / Échange de visibilité</option>
 <option value="autre">Autre (précisez dans le message)</option>
 </select>
 </div>
 <div>
 <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Message *</label>
 <textarea required rows={4} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
 placeholder="Décrivez votre produit/service, vos objectifs, votre budget indicatif…"
 style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
 </div>
 <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '0.95rem', fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
 {loading ? 'Envoi en cours…' : 'Envoyer ma demande →'}
 </button>
 <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
 Tous les annonceurs sont soumis à validation. Nous refusons tout contenu contraire aux valeurs islamiques.
 </p>
 </form>
 )}
 </div>
 </div>
 );
}
