'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, MapPin, ChevronRight, Users, BookOpen, Calendar, Briefcase,
  Waves, Library, Stethoscope, HandCoins, Scale, Plane, Building2,
  HeartHandshake, UserCheck, Landmark, ShieldCheck, MessageCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { allInstituts } from '@/data/institutes';
import { allEvents } from '@/data/events';
import { jobOffers } from '@/data/jobs';

// ── Tokens ────────────────────────────────────────────────────────
const FONT = "'Inter', system-ui, -apple-system, sans-serif";

const V = {
  50:  '#ecfdf5',
  100: '#d1fae5',
  200: '#a7f3d0',
  300: '#6ee7b7',
  400: '#34d399',
  500: '#10b981',
  600: '#059669',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b',
  primary:  '#059669',   // Emerald — CTA principal
  hover:    '#047857',
  dark:     '#0f1c14',   // Titres (vert très sombre)
  text:     '#3f3f46',   // Corps
  muted:    '#71717a',   // Secondaire
  border:   '#e4e4e7',   // Hairline neutre
  borderV:  '#a7f3d0',   // Hairline verte
  surface:  '#ecfdf5',   // Fond léger vert
  card:     '#fafafa',   // Fond carte léger
};

// ── Data ──────────────────────────────────────────────────────────
const SECTIONS: {
  href: string; icon: LucideIcon; color: string; bg: string;
  title: string; arabic: string; description: string; tags: string[];
  image: string; soon?: boolean;
}[] = [
  {
    href: '/education', icon: BookOpen,
    color: '#059669', bg: '#d1fae5',
    title: 'Éducation', arabic: 'العلم',
    description: 'Instituts, cours d\'arabe, cercles d\'étude et professeurs de Coran.',
    tags: ['Instituts', 'Arabe', 'Halaqa', 'Tajwid'],
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  },
  {
    href: '/events', icon: Calendar,
    color: '#047857', bg: '#ecfdf5',
    title: 'Événements', arabic: 'اللقاء',
    description: 'Conférences, séminaires et portes ouvertes en France.',
    tags: ['Conférences', 'Séminaires', 'En ligne'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    href: '/solidarity', icon: HeartHandshake,
    color: '#065f46', bg: '#d1fae5',
    title: 'Solidarité', arabic: 'التكافل',
    description: 'Cagnottes, maraudes, visites aux malades et voyages humanitaires.',
    tags: ['Cagnottes', 'Maraudes', 'Gaza'],
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
  },
  {
    href: '/jobs', icon: Briefcase,
    color: '#059669', bg: '#ecfdf5',
    title: 'Emploi', arabic: 'الأمل',
    description: 'Offres voile accepté, prière OK. Réseau CMN et vivier de talents.',
    tags: ['Voile OK', 'Prière OK', 'CDI / Freelance'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
  {
    href: '/sante', icon: Stethoscope,
    color: '#047857', bg: '#d1fae5',
    title: 'Santé', arabic: 'الشفاء',
    description: 'Psychologues orientés communauté, hijama certifiés et roqya.',
    tags: ['Psychologues', 'Hijama', 'Roqya'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
  },
  {
    href: '/librairies', icon: Library,
    color: '#065f46', bg: '#ecfdf5',
    title: 'Librairies', arabic: 'المكتبة',
    description: 'Librairies islamiques d\'Île-de-France : livres, Corans, arabe.',
    tags: ['Corans', 'Livres', 'Enfants'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
  {
    href: '/piscines', icon: Waves,
    color: '#10b981', bg: '#d1fae5',
    title: 'Piscines Burkini', arabic: 'السباحة',
    description: 'Créneaux burkini et maillots couvrants en Île-de-France.',
    tags: ['Créneaux femmes', 'Burkini', 'IdF'],
    image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80',
  },
  {
    href: '/hajj', icon: Plane,
    color: '#059669', bg: '#ecfdf5',
    title: 'Hajj & Omra', arabic: 'الحج',
    description: 'Comparez les agences, offres 2026 et guide du pèlerin.',
    tags: ['Hajj 2026', 'Omra', 'Comparateur'],
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=80',
  },
  {
    href: '/justice', icon: ShieldCheck,
    color: '#047857', bg: '#d1fae5',
    title: 'Justice & Droits', arabic: 'العدل',
    description: 'Vos droits en France, FAQ voile/prière et signalements ARCOM.',
    tags: ['Voile au travail', 'ARCOM', 'Discrimination'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
  },
  {
    href: '#', icon: MessageCircle,
    color: '#6ee7b7', bg: '#ecfdf5',
    title: 'Communauté', arabic: 'الأمة',
    description: 'Annuaire de compétences, marrainage et espace de brainstorming.',
    tags: ['Marrainage', 'Compétences', 'Bientôt'],
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    soon: true,
  },
];

// Compteurs dynamiques — les nombres issus des fichiers data s'auto-incrémentent
// Les autres (mosquées, piscines…) sont mis à jour manuellement à chaque batch ajouté au Sheet
type StatItem = { count: number; label: string; icon: LucideIcon };

function buildStats(): StatItem[] {
  const upcomingEvents = allEvents.filter(e => new Date(e.date) >= new Date()).length;
  return [
    { count: 1040,                label: 'mosquées référencées en France',           icon: Building2 },
    { count: upcomingEvents,      label: 'événements islamiques à venir en IDF',      icon: Calendar },
    { count: allInstituts.length, label: 'instituts & professeurs de Coran',          icon: BookOpen },
    { count: 8,                   label: 'piscines burkini référencées en IDF',        icon: Waves },
    { count: 20,                  label: 'praticiens de santé sensibilisés',           icon: Stethoscope },
    { count: 10,                  label: 'cagnottes communautaires actives',           icon: HandCoins },
    { count: jobOffers.length,    label: 'offres d\'emploi voile & prière acceptés',   icon: Briefcase },
    { count: 10,                  label: 'librairies islamiques référencées',          icon: Library },
    { count: 8,                   label: 'packages Hajj & Omra à comparer',            icon: Plane },
    { count: 5,                   label: 'juristes & avocats spécialisés',             icon: Scale },
    { count: 10,                  label: 'associations islamiques répertoriées',       icon: Users },
    { count: 6,                   label: 'initiatives solidaires organisées',          icon: HeartHandshake },
    { count: 6,                   label: 'profils talents CMN disponibles',            icon: UserCheck },
    { count: 5,                   label: 'agences Hajj agréées & comparées',           icon: Landmark },
  ];
}

const STATS = buildStats();

const EVENTS = [
  { title: "Conférence : L'Éthique au Travail", date: 'Sam 28 Mars · 14h00', location: 'Grande Mosquée de Paris', organizer: 'Institut Al-Ghazali', tag: 'Conférence', color: '#059669' },
  { title: 'Maraude Solidaire — Gare du Nord', date: 'Dim 29 Mars · 19h30', location: 'Gare du Nord, Paris', organizer: 'Au Cœur de la Fraternité', tag: 'Solidarité', color: '#047857' },
  { title: "Webinaire : Comprendre les enjeux de l'IA", date: 'Jeu 2 Avril · 20h00', location: 'En ligne (Zoom)', organizer: 'Muslim Tech Network', tag: 'Webinaire', color: '#065f46' },
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
              La communauté musulmane française, centralisée.
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
                {/* Face intérieure — OPAQUE : cache le centre du gradient */}
                <div
                  className="led-face"
                  style={{ background: '#051c0e' }}
                >
                  {/* Icône Lucide tracé vert — pas d'emoji */}
                  <s.icon size={22} color="#6ee7b7" strokeWidth={1.5} />
                  <span style={{
                    fontSize: '0.54rem', fontWeight: 800,
                    color: 'rgba(255,255,255,0.88)',
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

      {/* ─── TICKER STATS — défile en continu ────────────────── */}
      <section style={{
        background: 'linear-gradient(180deg, #0a3d20 0%, #051c0e 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0.85rem 0',
        overflow: 'hidden',
      }}>
        {/* Masques flous sur les bords */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(to right, #051c0e, transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(to left, #051c0e, transparent)',
            pointerEvents: 'none',
          }} />

          {/* Piste défilante — items doublés pour le loop seamless */}
          <div className="ticker-track">
            {[...STATS, ...STATS].map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0 2.25rem',
                    borderRight: '1px solid rgba(255,255,255,0.07)',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {/* Icône Lucide — tracé vert, pas d'emoji */}
                  <Icon size={14} color="#6ee7b7" strokeWidth={1.8} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                    Plus de {s.count}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {SECTIONS.map(s => <RubriqueCard key={s.href} {...s} />)}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {EVENTS.map(ev => <EventCard key={ev.title} {...ev} />)}
          </div>
        </div>
      </section>

      {/* ─── CTA COMMUNAUTÉ — même vert profond que la bannière ── */}
      <section style={{
        background: 'linear-gradient(150deg, #0a3d20 0%, #052810 45%, #020f07 100%)',
        padding: '4rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Halo lumineux top-left identique au hero */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-5%',
          width: '50%', height: '120%',
          background: 'radial-gradient(ellipse at center, rgba(40,200,100,0.22) 0%, rgba(20,140,60,0.08) 50%, transparent 70%)',
          pointerEvents: 'none',
        }} />
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
            Contribue à faire grandir la plateforme communautaire
            de référence pour les musulmans de France.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.8rem 1.75rem',
              backgroundColor: '#fff', color: V[700],
              fontWeight: 700, fontSize: '0.9rem',
              textDecoration: 'none', borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,.15)',
            }}>
              Proposer une ressource <ArrowRight size={14} />
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

// ── RubriqueCard — image de fond + icône cercle vert + hover ─────
function RubriqueCard({ href, icon: Icon, color, title, arabic, description, tags, soon, image }: {
  href: string; icon: LucideIcon; color: string; bg: string;
  title: string; arabic: string; description: string;
  tags: string[]; soon?: boolean; image: string;
}) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <div
      onMouseEnter={() => !soon && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        height: '230px',
        cursor: soon ? 'default' : 'pointer',
        opacity: soon ? 0.7 : 1,
      }}
    >
      {/* Image de fond */}
      <img
        src={image}
        alt={title}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.5s ease',
        }}
      />

      {/* Overlay dégradé noir */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.18) 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.08) 100%)',
        transition: 'background 0.4s',
      }} />

      {/* Contenu */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '1.1rem 1.25rem',
      }}>
        {/* Icône en cercle tracé vert */}
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          border: '1.5px solid rgba(110,231,183,0.65)',
          backgroundColor: 'rgba(5,150,105,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '0.55rem',
          backdropFilter: 'blur(4px)',
        }}>
          <Icon size={17} color="#6ee7b7" strokeWidth={1.8} />
        </div>

        {/* Titre */}
        <h3 style={{
          color: '#fff', fontWeight: 700, fontSize: '1rem',
          margin: '0 0 1px', lineHeight: 1.2,
          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}>
          {title}
          {soon && <span style={{ marginLeft: '0.5rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6ee7b7', verticalAlign: 'middle' }}>BIENTÔT</span>}
        </h3>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', fontFamily: 'serif', display: 'block', marginBottom: '0.5rem' }}>
          {arabic}
        </span>

        {/* Description — slide up au survol */}
        <p style={{
          color: 'rgba(255,255,255,0.78)', fontSize: '0.73rem', lineHeight: 1.5, margin: '0 0 0.5rem',
          maxHeight: hovered ? '56px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}>
          {description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontSize: '0.62rem', fontWeight: 600,
              backgroundColor: 'rgba(5,150,105,0.28)',
              color: '#6ee7b7',
              border: '1px solid rgba(110,231,183,0.35)',
              padding: '2px 8px', borderRadius: '20px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (soon) return <div>{inner}</div>;
  return <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>;
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
