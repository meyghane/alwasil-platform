'use client';

import Link from 'next/link';
import { Clock, ArrowRight, PenLine } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const CAT_COLORS: Record<string, string> = {
 'Apprentissage': '#c9973a',
 'Justice & Droits': '#a87830',
 'Bien-être': '#c9973a',
 'Santé': '#8a6025',
 'Communauté': '#8a6025',
};

const articles = [
 { slug: 'cours-arabe-en-ligne-france', title: 'Cours d\'arabe en ligne : les meilleures options pour les musulmans en France (2026)', category: 'Apprentissage', date: '2026-03-20', readTime: '6 min', excerpt: 'Apprendre l\'arabe depuis chez soi est aujourd\'hui possible grâce à de nombreuses plateformes. On fait le tour des meilleures options francophones, arabophones et hybrides.', tags: ['arabe', 'en ligne', 'cours', 'apprentissage'], featured: true, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80' },
 { slug: 'porter-voile-travail-droits-france', title: 'Porter le voile au travail en France : vos droits expliqués clairement', category: 'Justice & Droits', date: '2026-03-15', readTime: '8 min', excerpt: 'Secteur privé, public, client final — les règles ne sont pas les mêmes partout. Ce guide résume vos droits, les cas de discrimination et les recours possibles.', tags: ['voile', 'travail', 'droits', 'laïcité'], featured: true, image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=700&q=80' },
 { slug: 'piscines-burkini-ile-de-france-2026', title: 'Piscines burkini en Île-de-France : créneaux, horaires et bons plans (2026)', category: 'Bien-être', date: '2026-03-10', readTime: '5 min', excerpt: 'Trouver un créneau burkini en IDF n\'est pas toujours simple. On recense toutes les piscines qui proposent des créneaux réservés, avec horaires et tarifs à jour.', tags: ['piscine', 'burkini', 'IDF', 'femmes'], featured: false, image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=700&q=80' },
 { slug: 'prayer-space-travail-france', title: 'Espace de prière au travail : comment le demander et quels sont vos droits ?', category: 'Justice & Droits', date: '2026-03-05', readTime: '7 min', excerpt: 'La loi française ne prévoit pas d\'obligation pour l\'employeur, mais rien n\'interdit non plus. Voici comment négocier un espace de prière et ce que dit la jurisprudence.', tags: ['prière', 'travail', 'droits'], featured: false, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80' },
 { slug: 'instituts-islamiques-france-comparatif', title: 'Comparatif des instituts islamiques en France : IESH, Oussoul Eddine, Al-Kalam…', category: 'Apprentissage', date: '2026-02-28', readTime: '10 min', excerpt: 'Quel institut choisir pour apprendre les sciences islamiques ? Comparaison des programmes, formats (présentiel/distanciel), niveaux et tarifs.', tags: ['instituts', 'sciences islamiques', 'comparatif'], featured: true, image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=700&q=80' },
 { slug: 'hijama-paris-idf-guide', title: 'Hijama à Paris et en IDF : trouver un praticien sérieux - guide complet', category: 'Santé', date: '2026-02-20', readTime: '6 min', excerpt: 'La hijama (cupping thérapeutique) connaît un vrai renouveau. Mais comment trouver un praticien formé et sérieux ? Ce guide répond à toutes vos questions.', tags: ['hijama', 'santé', 'Paris', 'IDF'], featured: false, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=80' },
];

function formatDate(iso: string) {
 return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const featured = articles.filter(a => a.featured);
const rest = articles.filter(a => !a.featured);

function ArticleCard({ article, large = false }: { article: typeof articles[0]; large?: boolean }) {
 const color = CAT_COLORS[article.category] ?? '#c9973a';
 return (
 <Link href={`/blog/${article.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
 <article style={{
 backgroundColor: 'white',
 borderRadius: '16px',
 border: '1px solid #e4e4e7',
 overflow: 'hidden',
 display: 'flex', flexDirection: 'column',
 height: '100%',
 boxShadow: '0 2px 8px rgba(201,151,58,0.06)',
 transition: 'transform 0.22s ease, box-shadow 0.22s ease',
 }}
 onMouseOver={e => {
 (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
 (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(201,151,58,0.18)';
 }}
 onMouseOut={e => {
 (e.currentTarget as HTMLElement).style.transform = '';
 (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(201,151,58,0.06)';
 }}
 >
 {/* Image cover */}
 {article.image && (
 <div style={{ position: 'relative', height: large ? '200px' : '160px', overflow: 'hidden' }}>
 <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
 onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'; }}
 onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
 />
 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)' }} />
 <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fff', backgroundColor: color, padding: '2px 8px', borderRadius: '4px' }}>{article.category}</span>
 </div>
 )}
 {/* Barre catégorie (si pas d'image) */}
 {!article.image && <div style={{ height: '3px', backgroundColor: color }} />}

 <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
 {/* Header */}
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
 <span style={{ backgroundColor: `${color}18`, color, padding: '2px 10px', borderRadius: '20px', fontSize: '0.67rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
 {article.category}
 </span>
 <span style={{ fontSize: '0.72rem', color: '#9a9a9a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
 <Clock size={11} /> {article.readTime}
 </span>
 </div>

 {/* Titre */}
 <h3 style={{ fontSize: large ? '1.2rem' : '0.95rem', fontWeight: 800, lineHeight: 1.3, color: '#1c1917', margin: 0, flex: large ? 0 : 1 }}>
 {article.title}
 </h3>

 {/* Excerpt */}
 <p style={{ fontSize: '0.83rem', color: '#57534e', lineHeight: 1.65, margin: 0, flex: 1,
 display: '-webkit-box', WebkitLineClamp: large ? 4 : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
 } as React.CSSProperties}>
 {article.excerpt}
 </p>

 {/* Tags */}
 <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
 {article.tags.slice(0, 4).map(t => (
 <span key={t} style={{ backgroundColor: '#fdfbf0', color: '#a87830', padding: '2px 8px', borderRadius: '4px', fontSize: '0.67rem', fontWeight: 600 }}>#{t}</span>
 ))}
 </div>

 {/* Footer */}
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
 <span style={{ fontSize: '0.73rem', color: '#a8a29e' }}>{formatDate(article.date)}</span>
 <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: color, color: 'white', fontWeight: 700, fontSize: '0.78rem', padding: '0.4rem 0.875rem', borderRadius: '8px' }}>
 Lire <ArrowRight size={12} />
 </span>
 </div>
 </div>
 </article>
 </Link>
 );
}

export default function BlogPage() {
 return (
 <div>
 <PageHeader
 title="Blog"
 titleAr="المجلة"
 description="Guides pratiques, droits des musulmans en France, conseils apprentissage, bons plans IDF."
 count={articles.length}
 countLabel="articles publiés"
 />

 <div className="container" style={{ padding: '2.5rem 1rem' }}>

 {/* ── À La Une ─── */}
 <div style={{ marginBottom: '3rem' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
 <span style={{ width: '3px', height: '18px', backgroundColor: '#c9973a', borderRadius: '9999px', display: 'block' }} />
 <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: '#1c1917', textTransform: 'uppercase' }}>
 À la une
 </span>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
 {featured.map((a, i) => <ArticleCard key={a.slug} article={a} large={i === 0} />)}
 </div>
 </div>

 {/* ── Tous les articles ─── */}
 <div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
 <span style={{ width: '3px', height: '18px', backgroundColor: '#c9973a', borderRadius: '9999px', display: 'block' }} />
 <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: '#1c1917', textTransform: 'uppercase' }}>
 Tous les articles
 </span>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
 {rest.map(a => <ArticleCard key={a.slug} article={a} />)}
 </div>
 </div>

 {/* ── CTA ─── */}
 <div style={{ padding: '2rem', backgroundColor: '#fdfbf0', borderRadius: '16px', border: '1px solid #f0dea0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
 <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: '#c9973a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <PenLine size={20} color="white" strokeWidth={1.8} />
 </div>
 <div>
 <p style={{ fontWeight: 700, marginBottom: '0.2rem', color: '#1c1917', fontSize: '1rem' }}>Tu veux contribuer au blog ?</p>
 <p style={{ color: '#57534e', fontSize: '0.85rem', margin: 0 }}>Partage ton expertise : droits, santé, apprentissage, bons plans…</p>
 </div>
 </div>
 <Link href="/contact?type=blog" style={{ padding: '0.7rem 1.5rem', backgroundColor: '#c9973a', color: 'white', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', borderRadius: '10px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
 Proposer un article <ArrowRight size={14} />
 </Link>
 </div>
 </div>
 </div>
 );
}
