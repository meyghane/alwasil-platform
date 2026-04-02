'use client';

import Link from 'next/link';
import { BookOpen, Clock, Tag } from 'lucide-react';

// Articles SEO — à enrichir progressivement
const articles = [
  {
    slug: 'cours-arabe-en-ligne-france',
    title: 'Cours d\'arabe en ligne : les meilleures options pour les musulmans en France (2026)',
    category: 'Apprentissage',
    categoryColor: '#0d9488',
    date: '2026-03-20',
    readTime: '6 min',
    excerpt: 'Apprendre l\'arabe depuis chez soi est aujourd\'hui possible grâce à de nombreuses plateformes. On fait le tour des meilleures options francophones, arabophones et hybrides.',
    tags: ['arabe', 'en ligne', 'cours', 'apprentissage'],
    featured: true,
  },
  {
    slug: 'porter-voile-travail-droits-france',
    title: 'Porter le voile au travail en France : vos droits expliqués clairement',
    category: 'Justice & Droits',
    categoryColor: '#6366f1',
    date: '2026-03-15',
    readTime: '8 min',
    excerpt: 'Secteur privé, public, client final — les règles ne sont pas les mêmes partout. Ce guide résume vos droits, les cas de discrimination et les recours possibles.',
    tags: ['voile', 'travail', 'droits', 'laïcité', 'discrimination'],
    featured: true,
  },
  {
    slug: 'piscines-burkini-ile-de-france-2026',
    title: 'Piscines burkini en Île-de-France : créneaux, horaires et bons plans (2026)',
    category: 'Bien-être',
    categoryColor: '#3b82f6',
    date: '2026-03-10',
    readTime: '5 min',
    excerpt: 'Trouver un créneau burkini en IDF n\'est pas toujours simple. On recense toutes les piscines qui proposent des créneaux réservés, avec horaires et tarifs à jour.',
    tags: ['piscine', 'burkini', 'IDF', 'sport', 'femmes'],
    featured: false,
  },
  {
    slug: 'prayer-space-travail-france',
    title: 'Espace de prière au travail : comment le demander et quels sont vos droits ?',
    category: 'Justice & Droits',
    categoryColor: '#6366f1',
    date: '2026-03-05',
    readTime: '7 min',
    excerpt: 'La loi française ne prévoit pas d\'obligation pour l\'employeur, mais rien n\'interdit non plus. Voici comment négocier un espace de prière et ce que dit la jurisprudence.',
    tags: ['prière', 'travail', 'droits', 'espace prière'],
    featured: false,
  },
  {
    slug: 'instituts-islamiques-france-comparatif',
    title: 'Comparatif des instituts islamiques en France : IESH, Oussoul Eddine, Al-Kalam…',
    category: 'Apprentissage',
    categoryColor: '#0d9488',
    date: '2026-02-28',
    readTime: '10 min',
    excerpt: 'Quel institut choisir pour apprendre les sciences islamiques ? Comparaison des programmes, formats (présentiel/distanciel), niveaux et tarifs des principaux instituts français.',
    tags: ['instituts', 'sciences islamiques', 'comparatif', 'IESH', 'Oussoul Eddine'],
    featured: true,
  },
  {
    slug: 'hijama-paris-idf-guide',
    title: 'Hijama à Paris et en IDF : trouver un praticien sérieux — guide complet',
    category: 'Santé',
    categoryColor: '#ef4444',
    date: '2026-02-20',
    readTime: '6 min',
    excerpt: 'La hijama (cupping thérapeutique) connaît un vrai renouveau. Mais comment trouver un praticien formé et sérieux ? Ce guide répond à toutes vos questions.',
    tags: ['hijama', 'santé', 'Paris', 'IDF', 'médecine'],
    featured: false,
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const featured = articles.filter(a => a.featured);
const rest = articles.filter(a => !a.featured);

export default function BlogPage() {
  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <BookOpen size={28} color="var(--primary-color)" />
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Blog Al-Wasil</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', lineHeight: 1.6 }}>
          Guides pratiques, droits des musulmans en France, conseils apprentissage, bons plans IDF.
          Des réponses claires aux questions qui reviennent.
        </p>
      </div>

      {/* Articles mis en avant */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          À la une
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {featured.map(article => (
            <article key={article.slug} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ backgroundColor: article.categoryColor, color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                  {article.category}
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.4, margin: 0 }}>
                {article.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {article.excerpt}
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={12} /> {article.readTime}
                </span>
                <span>{formatDate(article.date)}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {article.tags.map(t => (
                  <span key={t} style={{ backgroundColor: '#f5f5f4', color: 'var(--text-secondary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.68rem' }}>
                    #{t}
                  </span>
                ))}
              </div>
              <Link href={`/blog/${article.slug}`} style={{ marginTop: 'auto', padding: '0.5rem 1rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center' }}>
                Lire l&apos;article →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Autres articles */}
      <section>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Tous les articles
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
          {rest.map(article => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem', backgroundColor: 'white', textDecoration: 'none', transition: 'background 0.1s' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fafaf9')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = 'white')}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ backgroundColor: article.categoryColor, color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                    {article.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatDate(article.date)}</span>
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '0.3rem' }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {article.excerpt}
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                <Clock size={12} /> {article.readTime}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA proposer article */}
      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fafaf9', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Tu veux contribuer au blog ?</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Partage ton expertise : droits, santé, apprentissage, bons plans… On publie les contenus utiles à la communauté.
          </p>
        </div>
        <Link href="/contact?type=blog" style={{ padding: '0.6rem 1.25rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          Proposer un article
        </Link>
      </div>
    </div>
  );
}
