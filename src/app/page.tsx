import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import SectionCard from '@/components/SectionCard';

// ─── SECTIONS DATA ───────────────────────────────────────────
const SECTIONS = [
  {
    href: '/education',
    emoji: '📚',
    color: '#0d9488',
    bg: '#f0fdfa',
    title: 'Éducation',
    arabic: 'العلم',
    description: 'Instituts, cours d\'arabe, cercles d\'étude et professeurs de Coran.',
    tags: ['Instituts islamiques', 'Cours arabe', 'Halaqa', 'Tajwid'],
  },
  {
    href: '/events',
    emoji: '📅',
    color: '#d97706',
    bg: '#fffbeb',
    title: 'Événements',
    arabic: 'اللقاء',
    description: 'Conférences, séminaires et portes ouvertes en France.',
    tags: ['Conférences', 'Séminaires', 'Marawda', 'En ligne'],
  },
  {
    href: '/solidarity',
    emoji: '🤲',
    color: '#ef4444',
    bg: '#fff1f2',
    title: 'Solidarité',
    arabic: 'التكافل',
    description: 'Cagnottes, maraudes, visites aux malades et voyages humanitaires.',
    tags: ['Cagnottes', 'Maraudes', 'Visites malades', 'Gaza'],
  },
  {
    href: '/jobs',
    emoji: '💼',
    color: '#2563eb',
    bg: '#eff6ff',
    title: 'Emploi',
    arabic: 'الأمل',
    description: 'Offres voile accepté, prière OK. Réseau CMN et vivier de talents.',
    tags: ['Voile accepté', 'Prière OK', 'CDI / Freelance', 'Réseau CMN'],
  },
  {
    href: '/sante',
    emoji: '🧠',
    color: '#db2777',
    bg: '#fdf2f8',
    title: 'Santé',
    arabic: 'الشفاء',
    description: 'Psychologues orientés communauté, hijama certifiés et roqya.',
    tags: ['Psychologues', 'Hijama', 'Roqya', 'Visio OK'],
  },
  {
    href: '/librairies',
    emoji: '📖',
    color: '#7c3aed',
    bg: '#faf5ff',
    title: 'Librairies',
    arabic: 'المكتبة',
    description: 'Librairies islamiques d\'Île-de-France : livres, Corans, arabe.',
    tags: ['Corans', 'Livres arabe', 'Enfants', 'En ligne'],
  },
  {
    href: '/piscines',
    emoji: '🏊',
    color: '#0284c7',
    bg: '#f0f9ff',
    title: 'Piscines Burkini',
    arabic: 'السباحة',
    description: 'Créneaux burkini et maillots couvrants en Île-de-France.',
    tags: ['Créneaux femmes', 'Burkini', 'Horaires vérifiés', 'IdF'],
  },
  {
    href: '/hajj',
    emoji: '🕋',
    color: '#059669',
    bg: '#f0fdf4',
    title: 'Hajj & Omra',
    arabic: 'الحج',
    description: 'Comparez les agences, offres 2026 et guide du pèlerin.',
    tags: ['Hajj 2026', 'Omra Ramadan', 'Comparateur prix', 'Guide'],
  },
  {
    href: '/justice',
    emoji: '⚖️',
    color: '#7c3aed',
    bg: '#f5f3ff',
    title: 'Justice & Droits',
    arabic: 'العدل',
    description: 'Vos droits en France, FAQ voile/prière et signalements ARCOM.',
    tags: ['Voile au travail', 'ARCOM', 'FAQ juridique', 'Discrimination'],
  },
  {
    href: '#',
    emoji: '💬',
    color: '#10b981',
    bg: '#f0fdf4',
    title: 'Communauté',
    arabic: 'الأمة',
    description: 'Annuaire de compétences, marrainage et espace de brainstorming.',
    tags: ['Marrainage', 'Compétences', 'Entraide', 'Bientôt'],
    soon: true,
  },
];

export default function Home() {
  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0 3.5rem', textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 1rem', backgroundColor: 'rgba(13,148,136,0.1)', color: '#0d9488', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          <span>🌱</span> Bêta — Rejoignez le mouvement
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: '1.25rem', background: 'linear-gradient(135deg, #1c1917 0%, #57534e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          L&apos;essentiel de la communauté,<br />enfin réuni au même endroit.
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#57534e', marginBottom: '2.25rem', lineHeight: 1.65 }}>
          Emploi voile accepté, piscines burkini, librairies islamiques, Hajj & Omra, psychologues, hijama, événements… Tout ce dont tu as besoin, centralisé.
        </p>
        <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#sections" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none' }}>
            Explorer les ressources →
          </a>
          <Link href="/contact?type=initiative" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', textDecoration: 'none' }}>
            Proposer une initiative
          </Link>
        </div>
      </section>

      {/* ── Grid sections ────────────────────────────────────── */}
      <section id="sections" style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {SECTIONS.map(s => (
            <SectionCard key={s.href} {...s} />
          ))}
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <section style={{ marginBottom: '5rem', padding: '2rem', borderRadius: '1.25rem', background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', color: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          {[
            { value: '10', label: 'Sections', sub: 'et ça grandit' },
            { value: '8', label: 'Piscines burkini', sub: 'Île-de-France' },
            { value: '10', label: 'Librairies', sub: 'référencées' },
            { value: '8', label: 'Packages Hajj', sub: 'à comparer' },
          ].map(stat => (
            <div key={stat.label}>
              <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0.2rem 0 0.1rem', opacity: 0.95 }}>{stat.label}</p>
              <p style={{ fontSize: '0.72rem', opacity: 0.7, margin: 0 }}>{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Where Salat — Projet distinct mis en avant ────────── */}
      <section style={{ marginBottom: '4rem' }}>
        {/* Label projet distinct */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#e7e5e4' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>Projet complémentaire</span>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#e7e5e4' }} />
        </div>

        <div style={{ borderRadius: '1.75rem', overflow: 'hidden', background: 'linear-gradient(135deg, #052e16 0%, #14532d 55%, #065f46 100%)', color: 'white', padding: '3rem 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center', boxShadow: '0 20px 60px rgba(5,46,22,0.35)' }}>
          <div>
            {/* Marque Where Salat */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #16a34a 0%, #0d9488 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                🕌
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>Where Salat</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' }}>by Al-Wasil</div>
              </div>
            </div>

            <p style={{ fontSize: '1.05rem', lineHeight: 1.65, opacity: 0.92, marginBottom: '1.5rem', maxWidth: '400px' }}>
              Des particuliers et commerçants ouvrent leur espace pour que tu puisses prier à l&apos;heure, partout en IDF.<br />
              <strong style={{ color: '#86efac' }}>Gratuit. FissabiliLlah.</strong>
            </p>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {[
                { icon: '🏠', label: 'Chez des particuliers' },
                { icon: '🛍️', label: 'Dans des commerces' },
                { icon: '🚿', label: 'Ablutions indiquées' },
                { icon: '🙋', label: 'Réservation en 1 clic' },
              ].map(f => (
                <span key={f.label} style={{ fontSize: '0.78rem', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.3rem 0.8rem', fontWeight: 500 }}>
                  {f.icon} {f.label}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/salle-de-priere" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #16a34a 0%, #0d9488 100%)', color: 'white', padding: '0.8rem 1.75rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(22,163,74,0.4)' }}>
                Trouver un espace <ArrowRight size={16} />
              </Link>
              <Link href="/salle-de-priere?mode=propose" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                Proposer mon espace
              </Link>
            </div>
          </div>

          {/* Mini-cartes aperçu */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { prenom: 'Yassine', quartier: 'Belleville — Paris 20e', places: '2 places libres', priere: 'Dhohr · 13h52', dispo: true },
              { prenom: 'Karima', quartier: 'Gennevilliers — 92', places: '4 places libres', priere: 'Asr · 17h18', dispo: true },
              { prenom: 'Nadia', quartier: 'Sarcelles — 95', places: '1 place libre', priere: 'Maghrib · 20h41', dispo: true },
              { prenom: 'Rachid', quartier: 'La Défense — 92', places: 'Complet', priere: 'Dhohr · 13h52', dispo: false },
            ].map(e => (
              <div key={e.prenom} style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem', border: `1px solid ${e.dispo ? 'rgba(134,239,172,0.2)' : 'rgba(252,165,165,0.2)'}` }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>{e.prenom}</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.6, marginBottom: '0.35rem' }}>{e.quartier}</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.7, marginBottom: '0.4rem' }}>🕐 {e.priere}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: e.dispo ? '#86efac' : '#fca5a5' }}>
                  {e.dispo ? `✓ ${e.places}` : `✗ ${e.places}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Événements à venir ───────────────────────────────── */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Événements à venir</h2>
          <Link href="/events" style={{ color: '#0d9488', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', textDecoration: 'none' }}>
            Tout voir <ArrowRight size={15} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          <EventCard title="Conférence : L'Éthique au Travail" date="Sam 28 Mars • 14h00" location="Grande Mosquée de Paris" organizer="Institut Al-Ghazali" tag="Conférence" color="#d97706" />
          <EventCard title="Maraude Solidaire — Gare du Nord" date="Dim 29 Mars • 19h30" location="Gare du Nord, Paris" organizer="Au Cœur de la Fraternité" tag="Solidarité" color="#ef4444" />
          <EventCard title="Webinaire : Comprendre les enjeux de l'IA" date="Jeu 2 Avril • 20h00" location="En ligne (Zoom)" organizer="Muslim Tech Network" tag="Webinaire" color="#2563eb" />
        </div>
      </section>

    </div>
  );
}

// ─── EVENT CARD ──────────────────────────────────────────────
function EventCard({ title, date, location, organizer, tag, color }: {
  title: string; date: string; location: string; organizer: string; tag: string; color: string;
}) {
  return (
    <div style={{ backgroundColor: 'white', border: '1.5px solid #e7e5e4', borderRadius: '1rem', overflow: 'hidden' }}>
      <div style={{ height: '6px', backgroundColor: color }} />
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <span style={{ backgroundColor: `${color}15`, color, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>{tag}</span>
          <span style={{ fontSize: '0.75rem', color: '#78716c' }}>{date}</span>
        </div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3, color: '#1c1917' }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#78716c', marginBottom: '0.25rem' }}>
          <MapPin size={12} /> {location}
        </div>
        <p style={{ fontSize: '0.78rem', color: '#78716c' }}>
          Par <strong style={{ color: '#1c1917' }}>{organizer}</strong>
        </p>
      </div>
    </div>
  );
}
