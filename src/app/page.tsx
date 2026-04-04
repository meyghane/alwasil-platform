import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import SectionCard from '@/components/SectionCard';

// ─── SECTIONS DATA ───────────────────────────────────────────
const SECTIONS = [
  { href: '/education', emoji: '📚', color: '#5e17eb', bg: '#f3eeff', title: 'Éducation', arabic: 'العلم', description: 'Instituts, cours d\'arabe, cercles d\'étude et professeurs de Coran.', tags: ['Instituts islamiques', 'Cours arabe', 'Halaqa', 'Tajwid'] },
  { href: '/events', emoji: '📅', color: '#d97706', bg: '#fffbeb', title: 'Événements', arabic: 'اللقاء', description: 'Conférences, séminaires et portes ouvertes en France.', tags: ['Conférences', 'Séminaires', 'Marawda', 'En ligne'] },
  { href: '/solidarity', emoji: '🤲', color: '#ef4444', bg: '#fff1f2', title: 'Solidarité', arabic: 'التكافل', description: 'Cagnottes, maraudes, visites aux malades et voyages humanitaires.', tags: ['Cagnottes', 'Maraudes', 'Visites malades', 'Gaza'] },
  { href: '/jobs', emoji: '💼', color: '#1540ff', bg: '#eff6ff', title: 'Emploi', arabic: 'الأمل', description: 'Offres voile accepté, prière OK. Réseau CMN et vivier de talents.', tags: ['Voile accepté', 'Prière OK', 'CDI / Freelance', 'Réseau CMN'] },
  { href: '/sante', emoji: '🧠', color: '#db2777', bg: '#fdf2f8', title: 'Santé', arabic: 'الشفاء', description: 'Psychologues orientés communauté, hijama certifiés et roqya.', tags: ['Psychologues', 'Hijama', 'Roqya', 'Visio OK'] },
  { href: '/librairies', emoji: '📖', color: '#7c3aed', bg: '#faf5ff', title: 'Librairies', arabic: 'المكتبة', description: 'Librairies islamiques d\'Île-de-France : livres, Corans, arabe.', tags: ['Corans', 'Livres arabe', 'Enfants', 'En ligne'] },
  { href: '/piscines', emoji: '🏊', color: '#0284c7', bg: '#f0f9ff', title: 'Piscines Burkini', arabic: 'السباحة', description: 'Créneaux burkini et maillots couvrants en Île-de-France.', tags: ['Créneaux femmes', 'Burkini', 'Horaires vérifiés', 'IdF'] },
  { href: '/hajj', emoji: '🕋', color: '#00bf63', bg: '#f0fff8', title: 'Hajj & Omra', arabic: 'الحج', description: 'Comparez les agences, offres 2026 et guide du pèlerin.', tags: ['Hajj 2026', 'Omra Ramadan', 'Comparateur prix', 'Guide'] },
  { href: '/justice', emoji: '⚖️', color: '#5e17eb', bg: '#f5f3ff', title: 'Justice & Droits', arabic: 'العدل', description: 'Vos droits en France, FAQ voile/prière et signalements ARCOM.', tags: ['Voile au travail', 'ARCOM', 'FAQ juridique', 'Discrimination'] },
  { href: '#', emoji: '💬', color: '#fb4102', bg: '#fff4f0', title: 'Communauté', arabic: 'الأمة', description: 'Annuaire de compétences, marrainage et espace de brainstorming.', tags: ['Marrainage', 'Compétences', 'Entraide', 'Bientôt'], soon: true },
];

const STATS = [
  { value: '10', label: 'Rubriques', sub: 'et ça grandit', color: '#5e17eb' },
  { value: '8', label: 'Piscines burkini', sub: 'Île-de-France', color: '#fb4102' },
  { value: '10', label: 'Librairies', sub: 'référencées', color: '#1540ff' },
  { value: '8', label: 'Packages Hajj', sub: 'à comparer', color: '#00bf63' },
];

export default function Home() {
  return (
    <div>
      {/* ── Barre arc-en-ciel palette ───────────────────────── */}
      <div style={{ height: '6px', background: 'linear-gradient(90deg, #5e17eb 25%, #fb4102 25%, #fb4102 50%, #1540ff 50%, #1540ff 75%, #00bf63 75%)' }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>

          {/* Texte hero */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.8rem', backgroundColor: '#F6C840', color: '#0a0a0a', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, fontFamily: 'Poppins, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.75rem', border: '2px solid #0a0a0a', boxShadow: '2px 2px 0 #0a0a0a' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0a0a0a', display: 'inline-block' }} />
              Bêta ouverte
            </div>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.0, letterSpacing: '-0.035em', color: '#0a0a0a', marginBottom: '1.5rem' }}>
              L&apos;essentiel<br />de la<br /><span style={{ color: '#5e17eb' }}>communauté</span><br />réuni.
            </h1>
            <p style={{ fontSize: '1rem', color: '#4a4a4a', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '420px' }}>
              Emploi voile accepté, piscines burkini, librairies islamiques, Hajj & Omra, psychologues, hijama, événements… Tout centralisé.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="#rubriques" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.8rem 1.75rem', backgroundColor: '#5e17eb', color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '2px solid #0a0a0a', borderRadius: '8px', boxShadow: '4px 4px 0 #0a0a0a' }}>
                Explorer <ArrowRight size={15} />
              </a>
              <Link href="/connexion" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.8rem 1.5rem', backgroundColor: 'white', color: '#0a0a0a', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', border: '2px solid #0a0a0a', borderRadius: '8px', boxShadow: '4px 4px 0 #0a0a0a' }}>
                Rejoindre la bêta
              </Link>
            </div>
          </div>

          {/* Mosaïque catégories */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
            {SECTIONS.slice(0, 9).map(s => (
              <Link key={s.href} href={s.href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', aspectRatio: '1', backgroundColor: s.color, border: '2px solid #0a0a0a', borderRadius: '10px', boxShadow: '2px 2px 0 #0a0a0a', transition: 'transform 0.1s, box-shadow 0.1s', cursor: s.soon ? 'default' : 'pointer' }}
                onMouseOver={e => { if (!s.soon) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '4px 4px 0 #0a0a0a'; }}}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '2px 2px 0 #0a0a0a'; }}>
                <span style={{ fontSize: '1.5rem' }}>{s.emoji}</span>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '0.62rem', color: 'white', textAlign: 'center', letterSpacing: '0.02em', lineHeight: 1.2, padding: '0 0.2rem' }}>{s.title.toUpperCase()}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Label section RUBRIQUES ──────────────────────────── */}
      <div id="rubriques" style={{ backgroundColor: '#0a0a0a', borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.18em', color: 'white', textTransform: 'uppercase' }}>Les Rubriques</span>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.72rem', color: '#9a9a9a', letterSpacing: '0.06em' }}>{SECTIONS.length} sections disponibles</span>
        </div>
      </div>

      {/* ── Grid sections ────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {SECTIONS.map(s => (
            <SectionCard key={s.href} {...s} />
          ))}
        </div>
      </div>

      {/* ── Label section CHIFFRES ───────────────────────────── */}
      <div style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.18em', color: 'white', textTransform: 'uppercase' }}>En Chiffres</span>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div style={{ borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {STATS.map(stat => (
              <div key={stat.label} style={{ backgroundColor: stat.color, border: '2px solid #0a0a0a', borderRadius: '12px', padding: '1.5rem', boxShadow: '4px 4px 0 #0a0a0a', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1, margin: 0 }}>{stat.value}</p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: 'white', margin: 0 }}>{stat.label}</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Label section WHERE SALAT ────────────────────────── */}
      <div style={{ backgroundColor: '#00bf63', borderTop: '2px solid #0a0a0a', borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.18em', color: 'white', textTransform: 'uppercase' }}>Where Salat</span>
          <span style={{ backgroundColor: 'white', color: '#00bf63', fontFamily: 'Poppins, sans-serif', fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', letterSpacing: '0.06em', textTransform: 'uppercase', border: '1.5px solid #0a0a0a' }}>Nouveau</span>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', marginLeft: 'auto' }}>by Al-Wasil</span>
        </div>
      </div>

      {/* ── Where Salat ─────────────────────────────────────── */}
      <div style={{ borderBottom: '2px solid #0a0a0a', backgroundColor: '#EDD0FF' }}>
        <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>

            {/* Texte */}
            <div>
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '2rem', color: '#0a0a0a', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Prie à l&apos;heure,<br />partout en IDF.
              </h2>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#4a4a4a', marginBottom: '1.25rem' }}>
                Des particuliers et commerçants ouvrent leur espace pour que tu puisses prier. Gratuit. <strong style={{ color: '#00bf63' }}>FissabiliLlah.</strong>
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {['🏠 Chez des particuliers', '🛍️ Dans des commerces', '🚿 Ablutions indiquées', '🙋 Réservation 1 clic'].map(f => (
                  <span key={f} style={{ fontSize: '0.78rem', backgroundColor: 'white', border: '2px solid #0a0a0a', borderRadius: '6px', padding: '0.3rem 0.7rem', fontWeight: 600, boxShadow: '2px 2px 0 #0a0a0a' }}>{f}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/salle-de-priere" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.5rem', backgroundColor: '#00bf63', color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '2px solid #0a0a0a', borderRadius: '8px', boxShadow: '3px 3px 0 #0a0a0a' }}>
                  Trouver un espace <ArrowRight size={14} />
                </Link>
                <Link href="/salle-de-priere?mode=propose" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.25rem', backgroundColor: 'white', color: '#0a0a0a', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', border: '2px solid #0a0a0a', borderRadius: '8px', boxShadow: '3px 3px 0 #0a0a0a' }}>
                  Proposer mon espace
                </Link>
              </div>
            </div>

            {/* Mini-cartes aperçu */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { prenom: 'Yassine', quartier: 'Belleville · Paris 20e', places: '2 places libres', priere: 'Dhohr · 13h52', dispo: true },
                { prenom: 'Karima', quartier: 'Gennevilliers · 92', places: '4 places libres', priere: 'Asr · 17h18', dispo: true },
                { prenom: 'Nadia', quartier: 'Sarcelles · 95', places: '1 place libre', priere: 'Maghrib · 20h41', dispo: true },
                { prenom: 'Rachid', quartier: 'La Défense · 92', places: 'Complet', priere: 'Dhohr · 13h52', dispo: false },
              ].map(e => (
                <div key={e.prenom} style={{ backgroundColor: '#D0DDEF', border: '2px solid #0a0a0a', borderRadius: '10px', padding: '1rem', boxShadow: '3px 3px 0 #0a0a0a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', fontWeight: 800, color: '#0a0a0a' }}>{e.prenom}</span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: e.dispo ? '#00bf63' : '#ef4444', border: '1.5px solid #0a0a0a', flexShrink: 0 }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b6b6b', marginBottom: '0.3rem' }}>{e.quartier}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b6b6b', marginBottom: '0.5rem' }}>🕐 {e.priere}</div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: e.dispo ? '#00bf63' : '#ef4444' }}>
                    {e.dispo ? `✓ ${e.places}` : `✗ ${e.places}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Label section ÉVÉNEMENTS ─────────────────────────── */}
      <div style={{ backgroundColor: '#F6C840', borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.18em', color: '#0a0a0a', textTransform: 'uppercase' }}>Événements à venir</span>
          <Link href="/events" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#0a0a0a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Tout voir <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Events ───────────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <EventCard title="Conférence : L'Éthique au Travail" date="Sam 28 Mars • 14h00" location="Grande Mosquée de Paris" organizer="Institut Al-Ghazali" tag="Conférence" color="#d97706" />
          <EventCard title="Maraude Solidaire — Gare du Nord" date="Dim 29 Mars • 19h30" location="Gare du Nord, Paris" organizer="Au Cœur de la Fraternité" tag="Solidarité" color="#ef4444" />
          <EventCard title="Webinaire : Comprendre les enjeux de l'IA" date="Jeu 2 Avril • 20h00" location="En ligne (Zoom)" organizer="Muslim Tech Network" tag="Webinaire" color="#1540ff" />
        </div>
      </div>
    </div>
  );
}

// ─── EVENT CARD — style Konbini ──────────────────────────────
function EventCard({ title, date, location, organizer, tag, color }: {
  title: string; date: string; location: string; organizer: string; tag: string; color: string;
}) {
  return (
    <div style={{ backgroundColor: 'white', border: '2px solid #0a0a0a', borderRadius: '12px', overflow: 'hidden', boxShadow: '4px 4px 0 #0a0a0a', display: 'flex', flexDirection: 'column' }}>
      {/* Header coloré */}
      <div style={{ backgroundColor: color, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0a0a0a' }}>
        <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '0.72rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tag}</span>
        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{date}</span>
      </div>
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, color: '#0a0a0a', margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#6b6b6b' }}>
          <MapPin size={12} /> {location}
        </div>
        <p style={{ fontSize: '0.78rem', color: '#6b6b6b', margin: 0 }}>
          Par <strong style={{ color: '#0a0a0a' }}>{organizer}</strong>
        </p>
      </div>
    </div>
  );
}
