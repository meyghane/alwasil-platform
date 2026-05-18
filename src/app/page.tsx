'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, MapPin, ChevronRight, Users, BookOpen, Calendar, Briefcase,
  Waves, Library, Stethoscope, HandCoins, Scale, Plane, Building2,
  HeartHandshake, UserCheck, Landmark, ShieldCheck, MessageCircle,
  Search, CheckCircle, Zap, Plus, Moon, Radio,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { allInstituts } from '@/data/institutes';
import { allEvents } from '@/data/events';
import { jobOffers } from '@/data/jobs';

// ── Tokens ────────────────────────────────────────────────────────
const FONT = "'Inter', system-ui, -apple-system, sans-serif";

const V = {
  50:  '#fdfbf0',
  100: '#faf4d8',
  200: '#f0dea0',
  300: '#e0be60',
  400: '#c9973a',
  500: '#a87830',
  600: '#8a6025',
  700: '#6a481a',
  800: '#4a3010',
  900: '#2a1a08',
  primary:  '#c9973a',   // Or chaud — art islamique & spiritualité
  hover:    '#a87830',
  dark:     '#0f0a00',   // Titres (noir chaud)
  text:     '#3a2e1a',   // Corps
  muted:    '#7a6848',   // Secondaire
  border:   '#e8e0d0',   // Hairline neutre
  borderV:  '#f0dea0',   // Hairline or
  surface:  '#fdfbf2',   // Fond léger crème
  card:     '#fffef8',   // Fond carte
};

// ── Data ──────────────────────────────────────────────────────────
const SECTIONS: {
  href: string; icon: LucideIcon; color: string; bg: string;
  title: string; arabic: string; description: string; tags: string[];
  image: string; soon?: boolean;
}[] = [
  {
    href: '/education', icon: BookOpen,
    color: '#4a0e58', bg: '#fdfbf0',
    title: 'Éducation', arabic: 'العلم',
    description: 'Instituts, cours d\'arabe, cercles d\'étude et professeurs de Coran.',
    tags: ['Instituts', 'Arabe', 'Halaqa', 'Tajwid'],
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  },
  {
    href: '/events', icon: Calendar,
    color: '#3a0a45', bg: '#ecfdf5',
    title: 'Événements', arabic: 'اللقاء',
    description: 'Conférences, séminaires et portes ouvertes en France.',
    tags: ['Conférences', 'Séminaires', 'En ligne'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    href: '/solidarity', icon: HeartHandshake,
    color: '#2c0835', bg: '#fdfbf0',
    title: 'Solidarité', arabic: 'التكافل',
    description: 'Cagnottes, maraudes, visites aux malades et voyages humanitaires.',
    tags: ['Cagnottes', 'Maraudes', 'Urgence', 'Palestine', 'Voyages'],
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
  },
  {
    href: '/jobs', icon: Briefcase,
    color: '#4a0e58', bg: '#ecfdf5',
    title: 'Emploi', arabic: 'الأمل',
    description: 'Offres voile accepté, prière OK. Réseau CMN et vivier de talents.',
    tags: ['Voile OK', 'Prière OK', 'CDI / Freelance'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
  {
    href: '/sante', icon: Stethoscope,
    color: '#3a0a45', bg: '#fdfbf0',
    title: 'Santé', arabic: 'الشفاء',
    description: 'Psychologues orientés communauté, hijama certifiés et roqya.',
    tags: ['Psychologues', 'Hijama', 'Roqya'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
  },
  {
    href: '/librairies', icon: Library,
    color: '#2c0835', bg: '#ecfdf5',
    title: 'Librairies', arabic: 'المكتبة',
    description: 'Librairies islamiques d\'Île-de-France : livres, Corans, arabe.',
    tags: ['Corans', 'Livres', 'Enfants'],
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
  },
  {
    href: '/piscines', icon: Waves,
    color: '#662a94', bg: '#fdfbf0',
    title: 'Piscines Burkini', arabic: 'السباحة',
    description: 'Créneaux burkini et maillots couvrants en Île-de-France.',
    tags: ['Créneaux femmes', 'Burkini', 'IdF'],
    image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80',
  },
  {
    href: '/hajj', icon: Plane,
    color: '#4a0e58', bg: '#ecfdf5',
    title: 'Hajj & Omra', arabic: 'الحج',
    description: 'Comparez les agences, offres 2026 et guide du pèlerin.',
    tags: ['Hajj 2026', 'Omra', 'Comparateur'],
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=80',
  },
  {
    href: '/justice', icon: ShieldCheck,
    color: '#3a0a45', bg: '#fdfbf0',
    title: 'Justice & Droits', arabic: 'العدل',
    description: 'Vos droits en France, FAQ voile/prière et signalements ARCOM.',
    tags: ['Voile au travail', 'ARCOM', 'Discrimination'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
  },
  {
    href: '#', icon: MessageCircle,
    color: 'rgba(255,255,255,0.85)', bg: '#fdfbf0',
    title: 'Communauté', arabic: 'الأمة',
    description: 'Annuaire de compétences, marrainage, muqabala et espace de brainstorming.',
    tags: ['Marrainage', 'Muqabala', 'Compétences', 'Entraide'],
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

// Prochains événements réels — filtrés dynamiquement depuis les données
const TAG_COLORS: Record<string, string> = {
  conference: '#a87830', maraude: '#8a6025', cours: '#c9973a',
  iftar: '#d4a853', webinaire: '#6a481a', jeunesse: '#a87830',
  famille: '#c9973a', collecte: '#8a6025', autre: '#a87830',
};
const CAT_LABELS: Record<string, string> = {
  conference: 'Conférence', maraude: 'Maraude', cours: 'Cours',
  iftar: 'Iftar', webinaire: 'Webinaire', jeunesse: 'Jeunesse',
  famille: 'Famille', collecte: 'Collecte', autre: 'Événement',
};
const today = new Date();
today.setHours(0, 0, 0, 0);

const UPCOMING_EVENTS = allEvents
  .filter(e => new Date(e.date) >= today)
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, 3)
  .map(e => {
    const d = new Date(e.date);
    const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });
    return {
      title: e.title,
      date: `${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} · ${e.timeStart}`,
      location: e.location + (e.city ? `, ${e.city}` : ''),
      organizer: e.organizer,
      tag: CAT_LABELS[e.category] || 'Événement',
      color: TAG_COLORS[e.category] || '#c9973a',
    };
  });

// ── Page ──────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ fontFamily: FONT, backgroundColor: '#fff', color: V.dark }}>

      {/* ─── HERO — fond vert profond + border beam LED ─────── */}
      <section style={{
        padding: '4.5rem 0 4rem',
        background: 'linear-gradient(150deg, #100c04 0%, #0a0806 45%, #050404 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Halo lumineux vert top-left */}
        <div style={{
          position: 'absolute', top: '-15%', left: '-8%',
          width: '50%', height: '75%',
          background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.45) 0%, rgba(20,14,4,0.18) 45%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Halo secondaire subtil bottom-right */}
        <div style={{
          position: 'absolute', bottom: '0', right: '0',
          width: '35%', height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.15) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Particules poussière — même que PageHeader */}
        {[
          { x:'5%',  y:'15%', s:2, d:0 },   { x:'15%', y:'70%', s:1, d:2.5 },
          { x:'25%', y:'40%', s:3, d:1.2 }, { x:'35%', y:'85%', s:1, d:4 },
          { x:'45%', y:'20%', s:2, d:0.8 }, { x:'55%', y:'60%', s:1, d:3.2 },
          { x:'65%', y:'30%', s:2, d:1.8 }, { x:'75%', y:'75%', s:3, d:0.4 },
          { x:'85%', y:'50%', s:1, d:2.8 }, { x:'92%', y:'25%', s:2, d:1.5 },
          { x:'10%', y:'55%', s:1, d:3.8 }, { x:'50%', y:'90%', s:2, d:2.2 },
          { x:'70%', y:'10%', s:1, d:0.6 }, { x:'80%', y:'85%', s:3, d:1.0 },
          { x:'40%', y:'5%',  s:2, d:4.5 }, { x:'20%', y:'95%', s:1, d:3.5 },
          { x:'60%', y:'45%', s:2, d:2.0 }, { x:'90%', y:'65%', s:1, d:1.3 },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', left: p.x, top: p.y,
            width: `${p.s}px`, height: `${p.s}px`,
            borderRadius: '50%', backgroundColor: '#d4a853',
            opacity: 0.4, pointerEvents: 'none',
            animation: `particle-float ${6 + p.d}s ease-in-out ${p.d}s infinite`,
          }} />
        ))}

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
              fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
              fontWeight: 800, lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#fff', marginBottom: '1rem',
            }}>
              Fini de chercher partout.{' '}
              <span style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Tout est ici.</span>
            </h1>

            {/* Problème */}
            <p style={{
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6, marginBottom: '0.6rem', maxWidth: '430px',
              fontStyle: 'italic',
            }}>
              Emploi voile OK impossible à trouver. Piscine burkini introuvable. Cours d&apos;arabe dispersés. Événements qu&apos;on rate.
            </p>

            {/* Solution */}
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.7, marginBottom: '2rem', maxWidth: '430px',
              fontWeight: 500,
            }}>
              Al-Wasil centralise <strong style={{ color: 'rgba(255,255,255,0.85)' }}>tout ce que la communauté musulmane de France cherche</strong> — en un seul endroit, mis à jour par la communauté.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="#rubriques" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#fff', color: V[800],
                fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none', borderRadius: '8px',
                boxShadow: '0 0 20px rgba(255,255,255,0.25), 0 4px 12px rgba(0,0,0,0.2)',
              }}>
                Je cherche une ressource <ArrowRight size={14} />
              </a>
              <Link href="/contact?type=general" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'rgba(212,168,83,0.12)', color: '#d4a853',
                fontWeight: 600, fontSize: '0.9rem',
                textDecoration: 'none', borderRadius: '8px',
                border: '1px solid rgba(212,168,83,0.35)',
              }}>
                <Plus size={14} /> Proposer une fiche
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
                {/* Face intérieure — OPAQUE : cache le centre du gradient */}
                <div
                  className="led-face"
                  style={{ background: '#080604' }}
                >
                  {/* Icône Lucide tracé vert — pas d'emoji */}
                  <s.icon size={22} color="#d4a853" strokeWidth={1.5} />
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
        background: 'linear-gradient(180deg, #0d0b04 0%, #080604 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0.85rem 0',
        overflow: 'hidden',
      }}>
        {/* Masques flous sur les bords */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(to right, #0d0b04, transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(to left, #0d0b04, transparent)',
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
                  <Icon size={14} color="#d4a853" strokeWidth={1.8} style={{ flexShrink: 0 }} />
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

      {/* ─── COMMENT ÇA MARCHE ────────────────────────────────── */}
      <section style={{ backgroundColor: '#fff', padding: '4rem 0', borderBottom: `1px solid ${V.border}` }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: V.primary, textTransform: 'uppercase' }}>
              Comment ça marche
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: V.dark, letterSpacing: '-0.025em', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              Trois étapes, c&apos;est tout.
            </h2>
            <p style={{ color: V.muted, fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto' }}>
              Pas d&apos;inscription, pas de compte. Trouve ce que tu cherches en quelques secondes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[
              {
                icon: <Search size={24} color={V.primary} strokeWidth={1.8} />,
                step: '01',
                title: 'Cherche',
                desc: 'Tape ta ville, une catégorie ou un mot-clé. Filtre par département. Le moteur connaît plus de 1000 ressources vérifiées.',
              },
              {
                icon: <CheckCircle size={24} color={V.primary} strokeWidth={1.8} />,
                step: '02',
                title: 'Trouve instantanément',
                desc: 'Résultats filtrés et organisés. Chaque fiche est vérifiée ou soumise par la communauté. Contacts directs inclus.',
              },
              {
                icon: <Zap size={24} color={V.primary} strokeWidth={1.8} />,
                step: '03',
                title: 'Agis directement',
                desc: 'Clique, appelle, postule ou donne directement. Et si quelque chose manque, ajoute-le pour aider les suivants.',
              },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '14px',
                    backgroundColor: V[100], border: `2px solid ${V[400]}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 2px 8px ${V[300]}44`,
                  }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: V[700], letterSpacing: '0.1em' }}>ÉTAPE {s.step}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: V.dark, marginBottom: '0.4rem' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: V.muted, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
                {i < 2 && (
                  <div style={{ position: 'absolute', right: '-1rem', top: '26px', color: V[300] }}>
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LABEL RUBRIQUES ──────────────────────────────────── */}
      <div id="rubriques" style={{ backgroundColor: '#fff', padding: '3.5rem 0 0' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: V.primary, textTransform: 'uppercase' }}>
            Toutes les rubriques
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: V.dark, letterSpacing: '-0.025em', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            Que cherches-tu aujourd&apos;hui ?
          </h2>
          <p style={{ color: V.muted, fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto' }}>
            {SECTIONS.length} rubriques · chacune mise à jour par la communauté
          </p>
        </div>
      </div>

      {/* ─── GRID SECTIONS ────────────────────────────────────── */}
      <section style={{ padding: '0 0 4rem', backgroundColor: '#fff' }}>
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

          {UPCOMING_EVENTS.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fdfbf2', borderRadius: '16px', border: '1px solid #f0dea0' }}>
              <p style={{ color: V.muted, margin: 0, fontSize: '0.9rem' }}>
                Aucun événement à venir pour le moment.{' '}
                <Link href="/contact?type=evenement" style={{ color: V.primary, fontWeight: 600, textDecoration: 'none' }}>
                  Proposer un événement →
                </Link>
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${UPCOMING_EVENTS.length}, 1fr)`, gap: '1rem' }}>
              {UPCOMING_EVENTS.map(ev => <EventCard key={ev.title} {...ev} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── TÉMOIGNAGES ──────────────────────────────────────── */}
      <section style={{ backgroundColor: V[50], padding: '4rem 0', borderTop: `1px solid ${V[200]}` }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: V.primary, textTransform: 'uppercase' }}>
              Ils utilisent Al-Wasil
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: V.dark, letterSpacing: '-0.025em', marginTop: '0.5rem' }}>
              Ce que dit la communauté
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {[
              {
                quote: "J'ai trouvé une piscine avec créneau burkini à 10 min de chez moi en 2 minutes. Avant je passais des heures à chercher.",
                name: 'Amira B.',
                role: 'Utilisatrice · Seine-Saint-Denis',
                tag: 'Piscines burkini',
              },
              {
                quote: "On a trouvé notre employeur actuel via Al-Wasil. Le voile est accepté, la prière aussi. Ça change tout.",
                name: 'Khadija M.',
                role: 'Utilisatrice · Paris 18e',
                tag: 'Emploi',
              },
              {
                quote: "On utilise Al-Wasil pour promouvoir nos maraudes. On a 3× plus de bénévoles depuis qu'on est référencés.",
                name: 'Association An-Nour',
                role: 'Organisateur · Bobigny',
                tag: 'Solidarité',
              },
            ].map((t, i) => (
              <div key={i} style={{
                backgroundColor: '#fff',
                borderRadius: '14px',
                padding: '1.5rem',
                border: `1px solid ${V[200]}`,
                display: 'flex', flexDirection: 'column', gap: '1rem',
                boxShadow: '0 2px 8px rgba(20,14,4,0.06)',
              }}>
                {/* Quote */}
                <p style={{
                  fontSize: '0.9rem', color: V.text, lineHeight: 1.7,
                  fontStyle: 'italic', flex: 1,
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Auteur */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: V.dark, margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: '0.72rem', color: V.muted, margin: 0 }}>{t.role}</p>
                  </div>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    backgroundColor: V[50], color: V.primary,
                    padding: '3px 10px', borderRadius: '20px',
                    border: `1px solid ${V[200]}`,
                  }}>
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: V.muted, marginTop: '1.5rem' }}>
            Ces témoignages seront remplacés par de vrais retours de la communauté.{' '}
            <Link href="/contact?type=general" style={{ color: V.primary, textDecoration: 'none', fontWeight: 600 }}>
              Partager ton expérience →
            </Link>
          </p>
        </div>
      </section>

      {/* ─── CONTRIBUTION CTA — même vert profond que la bannière ── */}
      <section style={{
        background: 'linear-gradient(150deg, #100c04 0%, #0a0806 45%, #050404 100%)',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-5%',
          width: '50%', height: '120%',
          background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.28) 0%, rgba(20,14,4,0.1) 50%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Accroche centrale */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>
              Ce site grandit grâce à vous
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0.75rem 0 0.875rem' }}>
              Chaque fiche ajoutée = une ressource<br />de plus pour quelqu&apos;un qui en a besoin.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              Al-Wasil est construit par la communauté, pour la communauté.
              Plus il y a de données, plus il est utile. Plus il est utile, plus les gens l&apos;utilisent.
              <strong style={{ color: 'rgba(255,255,255,0.85)' }}> Tu fais partie de cette boucle.</strong>
            </p>
          </div>

          {/* 4 actions de contribution */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { href: '/contact?type=piscine',      icon: <Waves size={18} strokeWidth={1.8} />,         label: 'Ajouter une piscine burkini',     sub: 'Créneau, horaires, tarif' },
              { href: '/contact?type=evenement',     icon: <Calendar size={18} strokeWidth={1.8} />,      label: 'Ajouter un événement',             sub: 'Conférence, maraude, cours...' },
              { href: '/contact?type=offre-emploi',  icon: <Briefcase size={18} strokeWidth={1.8} />,     label: 'Référencer un employeur',          sub: 'Voile accepté, prière OK' },
              { href: '/contact?type=general',       icon: <Plus size={18} strokeWidth={1.8} />,           label: 'Autre ressource',                  sub: 'Institut, librairie, praticien...' },
            ].map((item, i) => (
              <Link key={i} href={item.href} style={{
                textDecoration: 'none',
                display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                padding: '1.1rem 1.25rem',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '8px', flexShrink: 0,
                  backgroundColor: 'rgba(212,168,83,0.15)',
                  border: '1px solid rgba(212,168,83,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.85)',
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', margin: '0 0 2px' }}>{item.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', margin: 0 }}>{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA principal */}
          <div style={{ textAlign: 'center' }}>
            <Link href="/contact?type=general" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.9rem 2rem',
              backgroundColor: '#fff', color: '#2c0835',
              fontWeight: 700, fontSize: '0.95rem',
              textDecoration: 'none', borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}>
              <Plus size={16} /> Contribuer à Al-Wasil
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '1rem' }}>
              Gratuit · Sans compte · En 2 minutes
            </p>
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
          border: '1.5px solid rgba(212,168,83,0.65)',
          backgroundColor: 'rgba(20,14,4,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '0.55rem',
          backdropFilter: 'blur(4px)',
        }}>
          <Icon size={17} color="#d4a853" strokeWidth={1.8} />
        </div>

        {/* Titre */}
        <h3 style={{
          color: '#fff', fontWeight: 700, fontSize: '1rem',
          margin: '0 0 1px', lineHeight: 1.2,
          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}>
          {title}
          {soon && <span style={{ marginLeft: '0.5rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', verticalAlign: 'middle' }}>BIENTÔT</span>}
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
              backgroundColor: 'rgba(20,14,4,0.28)',
              color: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(212,168,83,0.35)',
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
