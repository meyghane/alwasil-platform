import Link from 'next/link';

export default function NotFound() {
 return <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '4rem 1rem', textAlign: 'center' }}><div><p style={{ color: '#c9973a', fontWeight: 800, fontSize: '1.2rem' }}>404</p><h1>Cette page n’existe pas</h1><p style={{ color: '#78716c' }}>Le lien a peut-être changé. Retournons à l’accueil.</p><Link href="/" className="btn btn-primary">Retour à l’accueil</Link></div></main>;
}
