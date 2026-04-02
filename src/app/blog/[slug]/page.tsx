import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar, ExternalLink } from 'lucide-react';
import { getArticleBySlug, articles, type ArticleBlock } from '@/data/blog-articles';
import ReadingProgress from '@/components/ReadingProgress';

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.lastUpdated,
      tags: article.tags,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderBlock(block: ArticleBlock, i: number) {
  switch (block.type) {
    case 'intro':
      return (
        <p key={i} style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#374151', borderLeft: '3px solid #0d9488', paddingLeft: '1.25rem', margin: '0 0 2rem' }}>
          {block.content}
        </p>
      );
    case 'h2':
      return <h2 key={i} style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827', margin: '2.5rem 0 1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{block.content}</h2>;
    case 'h3':
      return <h3 key={i} style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', margin: '1.75rem 0 0.75rem' }}>{block.content}</h3>;
    case 'p':
      return <p key={i} style={{ fontSize: '0.975rem', lineHeight: 1.8, color: '#374151', margin: '0 0 1.25rem' }}>{block.content}</p>;
    case 'ul':
      return (
        <ul key={i} style={{ margin: '0 0 1.5rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {block.items.map((item, j) => (
            <li key={j} style={{ fontSize: '0.975rem', lineHeight: 1.7, color: '#374151' }}>{item}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={i} style={{ margin: '0 0 1.5rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {block.items.map((item, j) => (
            <li key={j} style={{ fontSize: '0.975rem', lineHeight: 1.7, color: '#374151' }}>{item}</li>
          ))}
        </ol>
      );
    case 'callout':
      return (
        <div key={i} style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '12px', padding: '1.25rem 1.5rem', margin: '1.5rem 0', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{block.icon}</span>
          <div>
            <p style={{ fontWeight: 700, color: '#0d9488', marginBottom: '0.4rem', fontSize: '0.9rem' }}>{block.title}</p>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#374151', margin: 0 }}>{block.content}</p>
          </div>
        </div>
      );
    case 'table':
      return (
        <div key={i} style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                {block.headers.map((h, j) => (
                  <th key={j} style={{ backgroundColor: '#f9fafb', padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 700, color: '#374151', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {row.map((cell, k) => (
                    <td key={k} style={{ padding: '0.65rem 1rem', color: '#374151', verticalAlign: 'top' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'faq':
      return (
        <div key={i} style={{ margin: '2.5rem 0 1rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>Questions fréquentes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
            {block.items.map((item, j) => (
              <div key={j} style={{ backgroundColor: 'white', padding: '1.25rem 1.5rem' }}>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: '0.5rem', fontSize: '0.975rem' }}>❓ {item.q}</p>
                <p style={{ color: '#374151', lineHeight: 1.7, margin: 0, fontSize: '0.925rem' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case 'cta':
      return (
        <div key={i} style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '12px', padding: '1.25rem 1.5rem', margin: '2rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontWeight: 700, color: '#0d9488', marginBottom: '0.2rem', fontSize: '0.95rem' }}>{block.label}</p>
            {block.desc && <p style={{ color: '#64748b', fontSize: '0.825rem', margin: 0 }}>{block.desc}</p>}
          </div>
          <Link href={block.href} style={{ padding: '0.55rem 1.25rem', backgroundColor: '#0d9488', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            Voir <ExternalLink size={13} />
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = articles.filter(a => a.slug !== slug && (a.category === article.category || a.tags.some(t => article.tags.includes(t)))).slice(0, 3);

  return (
    <>
    <ReadingProgress />
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '780px' }}>

      {/* Breadcrumb */}
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
        <ArrowLeft size={14} /> Blog
      </Link>

      {/* Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <span style={{ backgroundColor: article.categoryColor, color: 'white', padding: '0.25rem 0.7rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-block', marginBottom: '1rem' }}>
          {article.category}
        </span>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, lineHeight: 1.25, color: '#111827', marginBottom: '1rem' }}>
          {article.title}
        </h1>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.82rem', color: '#6b7280', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={13} /> {formatDate(article.date)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={13} /> {article.readTime} de lecture
          </span>
          <span style={{ color: '#0d9488', fontWeight: 500 }}>Al-Wasil</span>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          {article.tags.map(t => (
            <span key={t} style={{ backgroundColor: '#f3f4f6', color: '#6b7280', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.68rem' }}>#{t}</span>
          ))}
        </div>
      </header>

      {/* Article body */}
      <article>
        {article.blocks.map((block, i) => renderBlock(block, i))}
      </article>

      {/* Dernière mise à jour */}
      <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
        Dernière mise à jour : {formatDate(article.lastUpdated)} — Al-Wasil centralise les ressources utiles aux musulmans de France.
      </p>

      {/* Articles liés */}
      {related.length > 0 && (
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Articles liés</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
            {related.map(a => (
              <Link key={a.slug} href={`/blog/${a.slug}`} className="blog-related-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem 1.25rem', backgroundColor: 'white', textDecoration: 'none', transition: 'background 0.1s' }}>
                <div>
                  <span style={{ backgroundColor: a.categoryColor, color: 'white', padding: '0.1rem 0.5rem', borderRadius: '3px', fontSize: '0.65rem', fontWeight: 700, marginRight: '0.5rem' }}>{a.category}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{a.title}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{a.readTime}</span>
              </Link>
            ))}
          </div>
          <style>{`.blog-related-link:hover { background-color: #f9fafb !important; }`}</style>
        </section>
      )}
    </div>
    </>
  );
}
