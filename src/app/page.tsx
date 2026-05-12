'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, ChevronRight, Users, BookOpen, Calendar, Briefcase } from 'lucide-react';

// ── Tokens ────────────────────────────────────────────────────────
const FONT = "'Inter', system-ui, -apple-system, sans-serif";

const V = {
  50:  '#f5f3ff',
  100: '#ede9fe',
  200: '#ddd6fe',
  300: '#c4b5fd',
  400: '#a78bfa',
  500: '#8b5cf6',
  600: '#7c3aed',
  700: '#6d28d9',
  800: '#5b21b6',
  900: '#4c1d95',
  primary:  '#5e6ad2',   // Linear lavender — CTA principal
  hover:    '#4f5bbf',
  dark:     '#1e1b4b',   // Titres
  text:     '#3f3f46',   // Corps
  muted:    '#71717a',   // Secondaire
  border:   '#e4e4e7',   // Hairline neutre
  borderV:  '#ddd6fe',   // Hairline violette
  surface:  '#f5f3ff',   // Fond léger violet
  card:     '#fafafa',   // Fond carte léger
};

// ── Data ──────────────────────────────────────────────────────────
const SECTIONS = [
  {
    href: '/education', emoji: '📚',
    color: '#5e6ad2', bg: '#ede9fe',
    title: 'Éducation', arabic: 'العلم',
    description: 'Instituts, cours d\'arabe, cercles d\'étude et professeurs de Coran.',
    tags: ['Instituts', 'Arabe', 'Halaqa', 'Tajwid'],
  },
  {
    href: '/events', emoji: '📅',
    color: '#7c3aed', bg: '#f3e8ff',
    title: 'Événements', arabic: 'اللقاء',
    description: 'Conférences, séminaires et portes ouvertes en France.',
    tags: ['Conférences', 'Séminaires', 'En ligne'],
  },
  {
    href: '/solidarity', emoji: '🤲',
    color: '#6366f1', bg: '#eef2ff',
    title: 'Solidarité', arabic: 'التكافل',
    description: 'Cagnottes, maraudes, visites aux malades et voyages humanitaires.',
    tags: ['Cagnottes', 'Maraudes', 'Gaza'],
  },
  {
    href: '/jobs', emoji: '💼',
    color: '#4f46e5', bg: '#eef2ff',
    title: 'Emploi', arabic: 'الأمل',
    description: 'Offres voile accepté, prière OK. Réseau CMN et vivier de talents.',
    tags: ['Voile OK', 'Prière OK', 'CDI / Freelance'],
  },
  {
    href: '/sante', emoji: '🧠',
    color: '#8b5cf6', bg: '#f5f3ff',
    title: 'Santé', arabic: 'الشفاء',
    description: 'Psychologues orientés communauté, hijama certifiés et roqya.',
    tags: ['Psychologues', 'Hijama', 'Roqya'],
  },
  {
    href: '/librairies', emoji: '📖',
    color: '#6d28d9', bg: '#ede9fe',
    title: 'Librairies', arabic: 'المكتبة',
    description: 'Librairies islamiques d\'Île-de-France : livres, Corans, arabe.',
    tags: ['Corans', 'Livres', 'Enfants'],
  },
  {
    href: '/piscines', emoji: '🏊',
    color: '#818cf8', bg: '#eef2ff',
    title: 'Piscines Burkini', arabic: 'السباحة',
    description: 'Créneaux burkini et maillots couvrants en Île-de-France.',
    tags: ['Créneaux femmes', 'Burkini', 'IdF'],
  },
  {
    href: '/hajj', emoji: '🕋',
    color: '#5b21b6', bg: '#f5f3ff',
    title: 'Hajj & Omra', arabic: 'الحج',
    description: 'Comparez les agences, offres 2026 et guide du pèlerin.',
    tags: ['Hajj 2026', 'Omra', 'Comparateur'],
  },
  {
    href: '/justice', emoji: '⚖️',
    color: '#7c3aed', bg: '#f3e8ff',
    title: 'Justice & Droits', arabic: 'العدل',
    description: 'Vos droits en France, FAQ voile/prière et signalements ARCOM.',
    tags: ['Voile au travail', 'ARCOM', 'Discrimination'],
  },
  {
    href: '#', emoji: '💬',
    color: '#a78bfa', bg: '#f5f3ff',
    title: 'Communauté', arabic: 'الأمة',
    description: 'Annuaire de compétences, marrainage et espace de brainstorming.',
    tags: ['Marrainage', 'Compétences', 'Bientôt'],
    soon: true,
  },
];

const STATS = [
  { value: '10+', label: 'Rubriques', sub: 'et ça grandit', icon: <BookOpen size={18} color={V.primary} /> },
  { value: '8',   label: 'Piscines burkini', sub: 'Île-de-France', icon: <span style={{ fontSize: '1.1rem' }}>🏊</span> },
  { value: '10',  label: 'Librairies', sub: 'référencées', icon: <span style={{ fontSize: '1.1rem' }}>📚</span> },
  { value: '8',   label: 'Packages Hajj', sub: 'à comparer', icon: <span style={{ fontSize: '1.1rem' }}>🕋</span> },
];

const EVENTS = [
  { title: "Conférence : L'Éthique au Travail", date: 'Sam 28 Mars · 14h00', location: 'Grande Mosquée de Paris', organizer: 'Institut Al-Ghazali', tag: 'Conférence', color: '#7c3aed' },
  { title: 'Maraude Solidaire — Gare du Nord', date: 'Dim 29 Mars · 19h30', location: 'Gare du Nord, Paris', organizer: 'Au Cœur de la Fraternité', tag: 'Solidarité', color: '#6366f1' },
  { title: "Webinaire : Comprendre les enjeux de l'IA", date: 'Jeu 2 Avril · 20h00', location: 'En ligne (Zoom)', organizer: 'Muslim Tech Network', tag: 'Webinaire', color: '#5e6ad2' },
];

// ── Page ──────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ fontFamily: FONT, backgroundColor: '#fff', color: V.dark }}>

      {/* ─── HERO — fond vert profond + border beam LED ─────── */}
      <section style={{
        padding: '4.5rem 0 4rem',
        background: 'linear-gradient(150deg, #0a3d20 0%, #052810 45%, #020f07 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Halo lumineux vert top-left */}
        <div style={{
          position: 'absolute', top: '-15%', left: '-8%',
          width: '50%', height: '75%',
          background: 'radial-gradient(ellipse at center, rgba(40,200,100,0.28) 0%, rgba(20,140,60,0.12) 45%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Halo secondaire subtil bottom-right */}
        <div style={{
          position: 'absolute', bottom: '0', right: '0',
          width: '35%', height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(10,80,30,0.25) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center',
          position: 'relative', zIndex: 1,
        }}>

          {/* Texte — tout en blanc */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.3rem 0.85rem',
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.9)',
              borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.03em', marginBottom: '2rem',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(6px)',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#fff', display: 'inline-block' }} />
              Bêta ouverte · Communauté musulmane de France
            </div>

            <h1 style={{
              fontSize: 'clamp(2.75rem, 5vw, 3.75rem)',
              fontWeight: 700, lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#fff', marginBottom: '1.25rem',
            }}>
              L&apos;essentiel de la{' '}
              <span style={{
                background: 'linear-gradient(135deg, #e0c8ff 0%, #fff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>communauté</span>
              {' '}réuni.
            </h1>

            <p style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '420px',
            }}>
              Emploi voile accepté, piscines burkini, librairies, Hajj & Omra,
              psychologues, événements… Tout centralisé pour les musulmans de France.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="#rubriques" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#fff', color: V[700],
                fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none', borderRadius: '8px',
                boxShadow: '0 0 20px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.2)',
                letterSpacing: '-0.01em',
              }}>
                Explorer <ArrowRight size={14} />
              </a>
              <Link href="/connexion" style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: 600, fontSize: '0.9rem',
                textDecoration: 'none', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.35)',
                backdropFilter: 'blur(6px)',
                letterSpacing: '-0.01em',
              }}>
                Rejoindre la bêta
              </Link>
            </div>
          </div>

          {/* Mosaïque 3×3 — border beam LED */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            {SECTIONS.slice(0, 9).map(s => (
              <Link
                key={s.href}
                href={s.href}
                className="led-card-outer"
                style={{ aspectRatio: '1', textDecoration: 'none' }}
              >
                {/* Faisceau rotatif — le "LED qui fait le tour" */}
                <div className="led-spin" />
                {/* Face intérieure — fond vert sombre */}
                <div
                  className="led-face"
                  style={{ background: 'rgba(5, 28, 14, 0.88)' }}
                >
                  <span style={{
                    fontSize: '1.6rem',
                    filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.25))',
                  }}>
                    {s.emoji}
                  </span>
                  <span style={{
                    fontSize: '0.56rem', fontWeight: 800,
                    color: 'rgba(255,255,255,0.9)',
                    textAlign: 'center',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    lineHeight: 1.2,
                    padding: '0 0.35rem',
                  }}>
                    {s.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────── */}
      <section style={{ backgroundColor: V[50], borderBottom: `1px solid ${V.borderV}`, padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '0.25rem' }}>{s.icon}</div>
                <p style={{ fontSize: '2.75rem', fontWeight: 700, color: V.primary, lineHeight: 1, letterSpacing: '-0.04em', margin: 0 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: V.dark, margin: 0 }}>{s.label}</p>
                <p style={{ fontSize: '0.72rem', color: V.muted, margin: 0 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LABEL RUBRIQUES ──────────────────────────────────── */}
      <div id="rubriques" style={{ borderBottom: `1px solid ${V.border}`, backgroundColor: V.card }}>
        <div className="container" style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '3px', height: '16px', backgroundColor: V.primary, borderRadius: '9999px', display: 'block', flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: V.dark, textTransform: 'uppercase' }}>
              Les Rubriques
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: V.muted }}>{SECTIONS.length} sections disponibles</span>
        </div>
      </div>

      {/* ─── GRID SECTIONS ────────────────────────────────────── */}
      <section style={{ padding: '2rem 0 4rem', backgroundColor: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(288px, 1fr))', gap: '1rem' }}>
            {SECTIONS.map(s => <RubriqueCard key={s.href} {...s} />)}
          </div>
        </div>
      </section>

      {/* ─── WHERE SALAT ──────────────────────────────────────── */}
      <section style={{ backgroundColor: V[100], borderTop: `1px solid ${V.borderV}`, borderBottom: `1px solid ${V.borderV}`, padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.2rem 0.65rem',
                backgroundColor: V[300], color: V[800],
                borderRadius: '9999px', fontSize: '0.65rem',
                fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', marginBottom: '1rem',
              }}>
                Where Salat · Nouveau
              </div>

              <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: V.dark, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '0.875rem' }}>
                Prie à l&apos;heure,<br />partout en IDF.
              </h2>

              <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: V.text, marginBottom: '1.25rem' }}>
                Des particuliers et commerçants ouvrent leur espace pour que tu puisses prier.
                Gratuit. <strong style={{ color: V.primary }}>FissabiliLlah.</strong>
              </p>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {['🏠 Chez des particuliers', '🛍️ Dans des commerces', '🚿 Ablutions indiquées', '🙋 Réservation 1 clic'].map(f => (
                  <span key={f} style={{
                    fontSize: '0.75rem', backgroundColor: '#fff',
                    border: `1px solid ${V.borderV}`, borderRadius: '6px',
                    padding: '0.25rem 0.6rem', fontWeight: 500, color: V.dark,
                  }}>
                    {f}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <Link href="/salle-de-priere" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.7rem 1.25rem',
                  backgroundColor: V.primary, color: '#fff',
                  fontWeight: 600, fontSize: '0.875rem',
                  textDecoration: 'none', borderRadius: '8px',
                  boxShadow: `0 4px 12px rgba(94,106,210,.25)`,
                }}>
                  Trouver un espace <ArrowRight size={13} />
                </Link>
                <Link href="/salle-de-priere?mode=propose" style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '0.7rem 1.25rem',
                  backgroundColor: '#fff', color: V.primary,
                  fontWeight: 600, fontSize: '0.875rem',
                  textDecoration: 'none', borderRadius: '8px',
                  border: `1px solid ${V[300]}`,
                }}>
                  Proposer mon espace
                </Link>
              </div>
            </div>

            {/* Mini-cartes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              {[
                { prenom: 'Yassine', quartier: 'Belleville · Paris 20e', priere: 'Dhohr · 13h52', places: '2 places libres', dispo: true },
                { prenom: 'Karima', quartier: 'Gennevilliers · 92', priere: 'Asr · 17h18', places: '4 places libres', dispo: true },
                { prenom: 'Nadia', quartier: 'Sarcelles · 95', priere: 'Maghrib · 20h41', places: '1 place libre', dispo: true },
                { prenom: 'Rachid', quartier: 'La Défense · 92', priere: 'Dhohr · 13h52', places: 'Complet', dispo: false },
              ].map(e => (
                <div key={e.prenom} style={{
                  backgroundColor: '#fff',
                  border: `1px solid ${V.borderV}`,
                  borderRadius: '10px', padding: '0.875rem',
                  boxShadow: `0 2px 8px rgba(94,106,210,.06)`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: V.dark }}>{e.prenom}</span>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: e.dispo ? '#22c55e' : '#ef4444', flexShrink: 0 }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: V.muted, marginBottom: '0.2rem' }}>{e.quartier}</div>
                  <div style={{ fontSize: '0.7rem', color: V.muted, marginBottom: '0.4rem' }}>🕐 {e.priere}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: e.dispo ? V.primary : '#ef4444' }}>
                    {e.dispo ? `✓ ${e.places}` : `✗ ${e.places}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ÉVÉNEMENTS ───────────────────────────────────────── */}
      <section style={{ padding: '3rem 0 5rem', backgroundColor: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '3px', height: '16px', backgroundColor: V[600], borderRadius: '9999px', display: 'block', flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: V.dark, textTransform: 'uppercase' }}>
                Événements à venir
              </span>
            </div>
            <Link href="/events" style={{ fontSize: '0.8rem', fontWeight: 600, color: V.primary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              Tout voir <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {EVENTS.map(ev => <EventCard key={ev.title} {...ev} />)}
          </div>
        </div>
      </section>

      {/* ─── CTA COMMUNAUTÉ ───────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(135deg, ${V[900]} 0%, ${V[700]} 50%, ${V.primary} 100%)`,
        padding: '4rem 0',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div style={{
              width: '48px', height: '48px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: '12px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={22} color="#fff" />
            </div>
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
            Rejoins la communauté
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.75)', maxWidth: '440px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Al-Wasil est en bêta ouverte. Chaque retour compte pour bâtir la meilleure
            plateforme pour les musulmans de France.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/connexion" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.8rem 1.75rem',
              backgroundColor: '#fff', color: V[700],
              fontWeight: 700, fontSize: '0.9rem',
              textDecoration: 'none', borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,.15)',
            }}>
              S&apos;inscrire <ArrowRight size={14} />
            </Link>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '0.8rem 1.5rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff', fontWeight: 600, fontSize: '0.9rem',
              textDecoration: 'none', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.25)',
            }}>
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── RubriqueCard ──────────────────────────────────────────────────
function RubriqueCard({ href, emoji, color, bg, title, arabic, description, tags, soon }: {
  href: string; emoji: string; color: string; bg: string;
  title: string; arabic: string; description: string;
  tags: string[]; soon?: boolean;
}) {
  const card = (
    <div
      style={{
        backgroundColor: '#fff',
        border: `1px solid ${V.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        height: '100%',
        opacity: soon ? 0.65 : 1,
        cursor: soon ? 'default' : 'pointer',
        transition: 'box-shadow 0.2s, transform 0.15s',
      }}
      onMouseOver={e => {
        if (!soon) {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px rgba(94,106,210,.12)`;
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        }
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '';
        (e.currentTarget as HTMLElement).style.transform = '';
      }}
    >
      {/* Barre accent top */}
      <div style={{ height: '3px', backgroundColor: color }} />

      <div style={{ padding: '1.125rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px', height: '36px',
              backgroundColor: bg, borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', flexShrink: 0,
            }}>
              {emoji}
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: V.dark, lineHeight: 1.2 }}>
                {title}
              </div>
              <div style={{ fontSize: '0.68rem', color: V.muted, fontFamily: 'serif', marginTop: '1px' }}>
                {arabic}
              </div>
            </div>
          </div>
          {soon && (
            <span style={{
              fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              backgroundColor: V[50], color: V.muted,
              padding: '0.2rem 0.45rem', borderRadius: '4px',
              flexShrink: 0,
            }}>
              Bientôt
            </span>
          )}
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.8125rem', color: V.text, lineHeight: 1.65, flex: 1, margin: '0 0 0.875rem' }}>
          {description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontSize: '0.65rem', fontWeight: 500,
              backgroundColor: bg, color: color,
              padding: '0.15rem 0.5rem', borderRadius: '9999px',
              border: `1px solid ${color}30`,
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (soon) return <div style={{ height: '100%' }}>{card}</div>;
  return <Link href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{card}</Link>;
}

// ── EventCard ─────────────────────────────────────────────────────
function EventCard({ title, date, location, organizer, tag, color }: {
  title: string; date: string; location: string;
  organizer: string; tag: string; color: string;
}) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: `1px solid ${V.border}`,
      borderRadius: '12px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ height: '3px', backgroundColor: color }} />
      <div style={{ padding: '1.125rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{
            fontSize: '0.63rem', fontWeight: 700,
            letterSpacing: '0.05em', textTransform: 'uppercase',
            color: color, backgroundColor: `${color}12`,
            padding: '0.2rem 0.55rem', borderRadius: '4px',
          }}>
            {tag}
          </span>
          <span style={{ fontSize: '0.72rem', color: V.muted, fontWeight: 500 }}>{date}</span>
        </div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.35, color: V.dark, margin: '0 0 0.55rem' }}>
          {title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: V.muted, marginBottom: '0.3rem' }}>
          <MapPin size={11} /> {location}
        </div>
        <p style={{ fontSize: '0.75rem', color: V.muted, margin: 0 }}>
          Par <strong style={{ color: V.text, fontWeight: 600 }}>{organizer}</strong>
        </p>
      </div>
    </div>
  );
}
