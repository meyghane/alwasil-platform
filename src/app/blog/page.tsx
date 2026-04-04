'use client';

import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

const articles = [
  { slug: 'cours-arabe-en-ligne-france', title: 'Cours d\'arabe en ligne : les meilleures options pour les musulmans en France (2026)', category: 'Apprentissage', categoryColor: '#5e17eb', date: '2026-03-20', readTime: '6 min', excerpt: 'Apprendre l\'arabe depuis chez soi est aujourd\'hui possible grâce à de nombreuses plateformes. On fait le tour des meilleures options francophones, arabophones et hybrides.', tags: ['arabe', 'en ligne', 'cours', 'apprentissage'], featured: true },
  { slug: 'porter-voile-travail-droits-france', title: 'Porter le voile au travail en France : vos droits expliqués clairement', category: 'Justice & Droits', categoryColor: '#1540ff', date: '2026-03-15', readTime: '8 min', excerpt: 'Secteur privé, public, client final — les règles ne sont pas les mêmes partout. Ce guide résume vos droits, les cas de discrimination et les recours possibles.', tags: ['voile', 'travail', 'droits', 'laïcité', 'discrimination'], featured: true },
  { slug: 'piscines-burkini-ile-de-france-2026', title: 'Piscines burkini en Île-de-France : créneaux, horaires et bons plans (2026)', category: 'Bien-être', categoryColor: '#0284c7', date: '2026-03-10', readTime: '5 min', excerpt: 'Trouver un créneau burkini en IDF n\'est pas toujours simple. On recense toutes les piscines qui proposent des créneaux réservés, avec horaires et tarifs à jour.', tags: ['piscine', 'burkini', 'IDF', 'sport', 'femmes'], featured: false },
  { slug: 'prayer-space-travail-france', title: 'Espace de prière au travail : comment le demander et quels sont vos droits ?', category: 'Justice & Droits', categoryColor: '#1540ff', date: '2026-03-05', readTime: '7 min', excerpt: 'La loi française ne prévoit pas d\'obligation pour l\'employeur, mais rien n\'interdit non plus. Voici comment négocier un espace de prière et ce que dit la jurisprudence.', tags: ['prière', 'travail', 'droits', 'espace prière'], featured: false },
  { slug: 'instituts-islamiques-france-comparatif', title: 'Comparatif des instituts islamiques en France : IESH, Oussoul Eddine, Al-Kalam…', category: 'Apprentissage', categoryColor: '#5e17eb', date: '2026-02-28', readTime: '10 min', excerpt: 'Quel institut choisir pour apprendre les sciences islamiques ? Comparaison des programmes, formats (présentiel/distanciel), niveaux et tarifs des principaux instituts français.', tags: ['instituts', 'sciences islamiques', 'comparatif', 'IESH', 'Oussoul Eddine'], featured: true },
  { slug: 'hijama-paris-idf-guide', title: 'Hijama à Paris et en IDF : trouver un praticien sérieux — guide complet', category: 'Santé', categoryColor: '#ef4444', date: '2026-02-20', readTime: '6 min', excerpt: 'La hijama (cupping thérapeutique) connaît un vrai renouveau. Mais comment trouver un praticien formé et sérieux ? Ce guide répond à toutes vos questions.', tags: ['hijama', 'santé', 'Paris', 'IDF', 'médecine'], featured: false },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const featured = articles.filter(a => a.featured);
const rest = articles.filter(a => !a.featured);

export default function BlogPage() {
  return (
    <div>
      {/* ── Header Konbini full-bleed ─────────────────────── */}
      <div style={{ backgroundColor: '#0a0a0a', borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ padding: '2.5rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#5e17eb', color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.7rem', borderRadius: '4px', marginBottom: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                ✍️ Magazine
              </div>
              <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'white', letterSpacing: '-0.035em', lineHeight: 0.95, margin: 0 }}>
                BLOG
              </h1>
              <p style={{ color: '#9a9a9a', fontSize: '0.9rem', marginTop: '0.75rem', maxWidth: '480px', lineHeight: 1.6 }}>
                Guides pratiques, droits des musulmans en France, conseils apprentissage, bons plans IDF.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '3rem', color: 'white', lineHeight: 1, margin: 0 }}>{articles.length}</p>
              <p style={{ color: '#6a6a6a', fontSize: '0.78rem', margin: 0 }}>articles publiés</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Label À LA UNE ────────────────────────────────── */}
      <div style={{ backgroundColor: '#5e17eb', borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ padding: '0.75rem 1rem' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.18em', color: 'white', textTransform: 'uppercase' }}>À La Une</span>
        </div>
      </div>

      {/* ── Featured — Editorial grid ─────────────────────── */}
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {featured.map((article, i) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none', display: 'block', gridColumn: i === 0 ? 'span 2' : 'span 1' }}>
              <article style={{ backgroundColor: 'white', border: '2px solid #0a0a0a', borderRadius: '12px', overflow: 'hidden', boxShadow: '4px 4px 0 #0a0a0a', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.12s, box-shadow 0.12s' }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #0a0a0a'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #0a0a0a'; }}>
                {/* Header coloré */}
                <div style={{ backgroundColor: article.categoryColor, padding: '1rem 1.25rem', borderBottom: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '0.7rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{article.category}</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={11} /> {article.readTime}</span>
                </div>
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: i === 0 ? '1.25rem' : '1rem', fontWeight: 800, lineHeight: 1.3, color: '#0a0a0a', margin: 0 }}>
                    {article.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.65, margin: 0, flex: 1 }}>
                    {article.excerpt}
                  </p>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {article.tags.map(t => (
                      <span key={t} style={{ backgroundColor: '#f3f4f6', color: '#4a4a4a', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.67rem', fontWeight: 600, border: '1px solid #e2e2e2' }}>#{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: article.categoryColor, color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.8rem', padding: '0.45rem 1rem', borderRadius: '6px', border: '1.5px solid #0a0a0a', boxShadow: '2px 2px 0 #0a0a0a', width: 'fit-content' }}>
                    Lire l&apos;article <ArrowRight size={12} />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Label TOUS LES ARTICLES ───────────────────────── */}
      <div style={{ backgroundColor: '#0a0a0a', borderTop: '2px solid #0a0a0a', borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ padding: '0.75rem 1rem' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.18em', color: 'white', textTransform: 'uppercase' }}>Tous les Articles</span>
        </div>
      </div>

      {/* ── Article list ──────────────────────────────────── */}
      <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rest.map(article => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <article style={{ backgroundColor: 'white', border: '2px solid #0a0a0a', borderRadius: '10px', overflow: 'hidden', boxShadow: '3px 3px 0 #0a0a0a', display: 'flex', transition: 'transform 0.12s, box-shadow 0.12s' }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-1px,-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #0a0a0a'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 #0a0a0a'; }}>
                {/* Barre colorée gauche */}
                <div style={{ width: '6px', backgroundColor: article.categoryColor, flexShrink: 0 }} />
                <div style={{ padding: '1.1rem 1.25rem', flex: 1, display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span style={{ backgroundColor: article.categoryColor, color: 'white', fontFamily: 'Poppins, sans-serif', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.67rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{article.category}</span>
                      <span style={{ fontSize: '0.73rem', color: '#9a9a9a' }}>{formatDate(article.date)}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: '#0a0a0a', lineHeight: 1.35, marginBottom: '0.3rem' }}>{article.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#6b6b6b', lineHeight: 1.5, margin: 0 }}>{article.excerpt}</p>
                  </div>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.72rem', color: '#9a9a9a', fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, paddingTop: '2px' }}>
                    <Clock size={11} /> {article.readTime}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA contribuer */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f3eeff', border: '2px solid #0a0a0a', borderRadius: '12px', boxShadow: '4px 4px 0 #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, marginBottom: '0.25rem', color: '#0a0a0a' }}>Tu veux contribuer au blog ?</p>
            <p style={{ color: '#4a4a4a', fontSize: '0.85rem', margin: 0 }}>
              Partage ton expertise : droits, santé, apprentissage, bons plans…
            </p>
          </div>
          <Link href="/contact?type=blog" style={{ padding: '0.65rem 1.25rem', backgroundColor: '#5e17eb', color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', border: '2px solid #0a0a0a', borderRadius: '8px', boxShadow: '3px 3px 0 #0a0a0a', whiteSpace: 'nowrap' }}>
            Proposer un article
          </Link>
        </div>
      </div>
    </div>
  );
}
