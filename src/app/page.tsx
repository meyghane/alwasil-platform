import Link from 'next/link';
import {
  ArrowRight, Users, BookOpen, Calendar, Briefcase,
  Waves, Library, Stethoscope, HandCoins, Scale, Plane, Building2,
  HeartHandshake, UserCheck, Landmark, ShieldCheck, MessageCircle,
  Search, CheckCircle, Zap, Plus, GraduationCap, Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Institut } from '@/data/institutes';
import type { Event } from '@/data/events';
import type { JobOffer } from '@/data/jobs';
import { getInstituts, getEvents, getJobOffers } from '@/lib/db-queries';
import { HOME_THEME as V } from '@/lib/home-theme';
import RubriqueCard from '@/components/home/RubriqueCard';
import EventCard from '@/components/home/EventCard';
import EditorialHero from '@/components/home/EditorialHero';
import CommunityStories from '@/components/home/CommunityStories';
import SolidarityPreview from '@/components/home/SolidarityPreview';
import PrayerTimesBar from '@/components/PrayerTimesBar';

export const revalidate = 3600;

// ── Types ─────────────────────────────────────────────────────────
type Section = {
  href: string; icon: LucideIcon; color: string; bg: string;
  title: string; arabic: string; description: string;
  tags: string[]; image: string; soon?: boolean;
};

type StatItem = { count: number; label: string; icon: LucideIcon };

// ── Data ──────────────────────────────────────────────────────────
const QUICK_CATEGORIES = [
  { href: '/events', icon: Calendar, label: 'Événements' },
  { href: '/solidarity', icon: HeartHandshake, label: 'Solidarité' },
  { href: '/hajj', icon: Plane, label: 'Hajj & Omra' },
  { href: '/jobs', icon: Briefcase, label: 'Emploi' },
  { href: '/education', icon: BookOpen, label: 'Éducation' },
  { href: '/sante', icon: Stethoscope, label: 'Santé' },
  { href: '/librairies', icon: Library, label: 'Librairies' },
  { href: '/piscines', icon: Waves, label: 'Piscines' },
];

const SECTIONS: Section[] = [
  { href: '/events', icon: Calendar, color: '#3a0a45', bg: '#ecfdf5', title: 'Événements', arabic: 'اللقاء', description: 'Conférences, séminaires, maraudes et rencontres communautaires en France.', tags: ['Conférences', 'Maraudes', 'Séminaires', 'En ligne'], image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80' },
  { href: '/hajj', icon: Plane, color: '#4a0e58', bg: '#ecfdf5', title: 'Hajj & Omra', arabic: 'الحج', description: 'Comparez les agences, offres 2026 et guide du pèlerin.', tags: ['Hajj 2026', 'Omra', 'Comparateur'], image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=80' },
  { href: '/solidarity', icon: HeartHandshake, color: '#2c0835', bg: '#f0ebfa', title: 'Solidarité', arabic: 'التكافل', description: 'Cagnottes, maraudes, collectes et initiatives solidaires partout en France.', tags: ['Cagnottes', 'Maraudes', 'Urgence', 'Gaza'], image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80' },
  { href: '/education', icon: BookOpen, color: '#4a0e58', bg: '#f0ebfa', title: 'Éducation', arabic: 'العلم', description: 'Instituts, cours d\'arabe, cercles d\'étude et professeurs de Coran.', tags: ['Instituts', 'Arabe', 'Halaqa', 'Tajwid'], image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80' },
  { href: '/librairies', icon: Library, color: '#2c0835', bg: '#ecfdf5', title: 'Librairies', arabic: 'المكتبة', description: 'Librairies islamiques d\'Île-de-France : livres, Corans, arabe.', tags: ['Corans', 'Livres', 'Enfants'], image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80' },
  { href: '/jobs', icon: Briefcase, color: '#4a0e58', bg: '#ecfdf5', title: 'Emploi', arabic: 'الأمل', description: 'Offres voile accepté, prière OK. Réseau CMN et vivier de talents.', tags: ['Voile OK', 'Prière OK', 'CDI / Freelance'], image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { href: '/sante', icon: Stethoscope, color: '#3a0a45', bg: '#f0ebfa', title: 'Santé', arabic: 'الشفاء', description: 'Psychologues orientés communauté, hijama certifiés et roqya.', tags: ['Psychologues', 'Hijama', 'Roqya'], image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80' },
  { href: '/piscines', icon: Waves, color: '#662a94', bg: '#f0ebfa', title: 'Piscines Burkini', arabic: 'السباحة', description: 'Créneaux burkini et maillots couvrants en Île-de-France.', tags: ['Créneaux femmes', 'Burkini', 'IdF'], image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80' },
  { href: '/justice', icon: ShieldCheck, color: '#3a0a45', bg: '#f0ebfa', title: 'Justice & Droits', arabic: 'العدل', description: 'Vos droits en France, FAQ voile/prière et signalements ARCOM.', tags: ['Voile au travail', 'ARCOM', 'Discrimination'], image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80' },
  { href: '#', icon: MessageCircle, color: 'rgba(255,255,255,0.85)', bg: '#f0ebfa', title: 'Communauté', arabic: 'الأمة', description: 'Annuaire de compétences, marrainage, muqabala et espace de brainstorming.', tags: ['Marrainage', 'Muqabala', 'Compétences', 'Entraide'], image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', soon: true },
];

const CAT_LABELS: Record<string, string> = {
  conference: 'Conférence', maraude: 'Maraude', cours: 'Cours',
  iftar: 'Iftar', webinaire: 'Webinaire', jeunesse: 'Jeunesse',
  famille: 'Famille', collecte: 'Collecte', autre: 'Événement',
};

const STEPS = [
  { icon: <Search size={24} color={V.primary} strokeWidth={1.8} />, step: '01', title: 'Cherche', desc: 'Tape ta ville, une catégorie ou un mot-clé. Filtre par département. Le moteur connaît plus de 1000 ressources vérifiées.' },
  { icon: <CheckCircle size={24} color={V.primary} strokeWidth={1.8} />, step: '02', title: 'Trouve instantanément', desc: 'Résultats filtrés et organisés. Chaque fiche est vérifiée ou soumise par la communauté. Contacts directs inclus.' },
  { icon: <Zap size={24} color={V.primary} strokeWidth={1.8} />, step: '03', title: 'Agis directement', desc: 'Clique, appelle, postule ou donne directement. Et si quelque chose manque, ajoute-le pour aider les suivants.' },
];

const CONTRIBUTION_ITEMS = [
  { href: '/contact?type=piscine',      icon: <Waves size={18} strokeWidth={1.8} />,    label: 'Ajouter une piscine burkini',  sub: 'Créneau, horaires, tarif' },
  { href: '/contact?type=evenement',    icon: <Calendar size={18} strokeWidth={1.8} />, label: 'Ajouter un événement',         sub: 'Conférence, maraude, cours...' },
  { href: '/contact?type=offre-emploi', icon: <Briefcase size={18} strokeWidth={1.8} />, label: 'Référencer un employeur',    sub: 'Voile accepté, prière OK' },
  { href: '/contact?type=general',      icon: <Plus size={18} strokeWidth={1.8} />,      label: 'Autre ressource',             sub: 'Institut, librairie, praticien...' },
];

// ── Stats ─────────────────────────────────────────────────────────
function buildStats(events: Event[], instituts: Institut[], jobOffers: JobOffer[]): StatItem[] {
  const upcomingCount = events.filter(e => new Date(e.date) >= new Date()).length;
  return [
    { count: 1040,               label: 'mosquées référencées en France',              icon: Building2 },
    { count: upcomingCount,      label: 'événements islamiques à venir en IDF',         icon: Calendar },
    { count: instituts.length,   label: 'instituts & professeurs de Coran',            icon: BookOpen },
    { count: 8,                  label: 'piscines burkini référencées en IDF',          icon: Waves },
    { count: 20,                 label: 'praticiens de santé sensibilisés',             icon: Stethoscope },
    { count: 10,                 label: 'cagnottes communautaires actives',             icon: HandCoins },
    { count: jobOffers.length,   label: 'offres d\'emploi voile & prière acceptés',    icon: Briefcase },
    { count: 10,                 label: 'librairies islamiques référencées',            icon: Library },
    { count: 8,                  label: 'packages Hajj & Omra à comparer',             icon: Plane },
    { count: 5,                  label: 'juristes & avocats spécialisés',              icon: Scale },
    { count: 10,                 label: 'associations islamiques répertoriées',         icon: Users },
    { count: 6,                  label: 'initiatives solidaires organisées',            icon: HeartHandshake },
    { count: 6,                  label: 'profils talents CMN disponibles',             icon: UserCheck },
    { count: 5,                  label: 'agences Hajj agréées & comparées',            icon: Landmark },
  ];
}

// ── Upcoming events (4 prochains) ──────────────────────────────────
function buildUpcomingEvents(events: Event[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6)
    .map(e => {
      const d = new Date(e.date);
      const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });
      return {
        title: e.title,
        date: `${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} · ${e.timeStart}`,
        location: e.location + (e.city ? `, ${e.city}` : ''),
        organizer: e.organizer,
        category: e.category,
        tag: CAT_LABELS[e.category] ?? 'Événement',
      };
    });
}

// ── Page ──────────────────────────────────────────────────────────
export default async function Home() {
  const [instituts, events, jobOffers] = await Promise.all([
    getInstituts(),
    getEvents(),
    getJobOffers(),
  ]);
  const STATS = buildStats(events, instituts, jobOffers);
  const UPCOMING_EVENTS = buildUpcomingEvents(events);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#fff', color: V.dark }}>

      <EditorialHero />
      <PrayerTimesBar />

      {/* ─── ÉVÉNEMENTS (priorité n°1) ───────────────────────── */}
      <section id="evenements" style={{ padding: 'clamp(54px, 7vw, 96px) 0', backgroundColor: '#f5f3f8', color: '#080808', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 clamp(18px, 4vw, 56px)' }}>
          <div style={{ maxWidth: 920, margin: '0 auto 40px', textAlign: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.13em', color: '#7652CA', textTransform: 'uppercase' }}>Se retrouver · Échanger · Apprendre</span>
            <h2 style={{ fontSize: 'clamp(38px, 6vw, 78px)', fontWeight: 500, lineHeight: 0.94, color: '#080808', letterSpacing: '-0.06em', margin: '18px 0 0', textTransform: 'uppercase' }}>Les prochains rendez-vous<br/><span style={{ color: '#7652CA' }}>de la communauté.</span></h2>
          </div>

          {UPCOMING_EVENTS.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: 18, border: `1px solid ${V.border}` }}>
              <p style={{ color: V.muted, margin: 0, fontSize: '0.9rem' }}>
                Aucun événement à venir pour le moment.{' '}
                <Link href="/contact?type=evenement" style={{ color: V.primary, fontWeight: 600, textDecoration: 'none' }}>Proposer un événement →</Link>
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'clamp(250px, 28vw, 330px)', gap: 14, overflowX: 'auto', scrollSnapType: 'x proximity', padding: '6px 0 24px', scrollbarWidth: 'thin' }}>
              <div style={{ minHeight: 390, borderRadius: 20, background: '#080808', color: '#fff', padding: 26, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', scrollSnapAlign: 'start' }}>
                <span style={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#ECFF58', color: '#080808' }}><Sparkles size={20} aria-hidden="true" /></span>
                <div><p style={{ color: '#ECFF58', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Agenda Al-Wasil</p><h3 style={{ fontSize: 29, lineHeight: 1.05, fontWeight: 500, letterSpacing: '-.045em', marginBottom: 14 }}>Six occasions de se retrouver.</h3><p style={{ color: '#d2d2d2', fontSize: 13, lineHeight: 1.6 }}>Conférences, maraudes, ateliers et rencontres : fais défiler les prochains rendez-vous.</p></div>
              </div>
              {UPCOMING_EVENTS.map(ev => <EventCard key={`${ev.title}-${ev.date}`} {...ev} />)}
              <Link href="/events" style={{ minHeight: 390, borderRadius: 20, background: '#ECFF58', color: '#080808', padding: 26, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', scrollSnapAlign: 'start' }}>
                <ArrowRight size={38}/><span style={{ fontSize: 32, lineHeight: 1, fontWeight: 600, letterSpacing: '-.05em' }}>Voir plus<br/>d’événements</span><span style={{ fontSize: 13 }}>Ouvrir tout l’agenda →</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── RENTRÉE 2026 (module saisonnier) ───────────────── */}
      <section style={{ padding: '3.5rem 0', background: V[100] }}>
        <div className="container">
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', backgroundColor: '#fff', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, color: V[600], marginBottom: '0.75rem' }}>
              <Sparkles size={12} /> SPÉCIAL RENTRÉE · Le bon moment pour s&apos;inscrire
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: V.dark, letterSpacing: '-0.025em' }}>Prépare la rentrée 2026</h2>
          </div>
          <div className="featured-duo">
            <Link href="/education" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '240px', boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}>
                <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80" alt="Instituts et cours" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,23,0.88) 0%, rgba(28,25,23,0.15) 60%, transparent 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}>
                  <GraduationCap size={22} color="#fff" style={{ marginBottom: '0.5rem' }} />
                  <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem', margin: '0 0 0.4rem' }}>Instituts &amp; cours d&apos;arabe</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', margin: '0 0 0.9rem' }}>Coran, tajwid, arabe, halaqa : inscriptions ouvertes</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#fff', fontWeight: 700, fontSize: '0.82rem' }}>Voir les instituts <ArrowRight size={14} /></span>
                </div>
              </div>
            </Link>
            <Link href="/librairies" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '240px', boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}>
                <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&q=80" alt="Librairies" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,23,0.88) 0%, rgba(28,25,23,0.15) 60%, transparent 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}>
                  <Library size={22} color="#fff" style={{ marginBottom: '0.5rem' }} />
                  <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem', margin: '0 0 0.4rem' }}>Librairies islamiques</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', margin: '0 0 0.9rem' }}>Corans, manuels scolaires, livres jeunesse près de chez toi</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#fff', fontWeight: 700, fontSize: '0.82rem' }}>Voir les librairies <ArrowRight size={14} /></span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <SolidarityPreview />

      {/* ─── HAJJ & OMRA (identité dédiée) ───────────────────── */}
      <section style={{ padding: '4rem 0', background: V.dark }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, color: V[300], marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.12)' }}>
                <Plane size={12} /> ESPACE DÉDIÉ
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>Hajj &amp; Omra 2026</h2>
              <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '440px' }}>
                Comparez les agences agréées, les formules et les prix. Vous êtes une agence Hajj/Omra ? Faites-vous référencer sur Al-Wasil.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/hajj" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.5rem', backgroundColor: V.lime, color: V.dark, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', borderRadius: '9999px' }}>
                  Comparer les agences <ArrowRight size={14} />
                </Link>
                <Link href="/annonceurs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#fff', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.25)' }}>
                  Vous êtes une agence ?
                </Link>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
              {[
                { label: 'Agences agréées', value: '13' },
                { label: 'Formules comparées', value: '20+' },
                { label: 'Départs IDF', value: 'Toute l\'année' },
              ].map(s => (
                <div key={s.label} style={{ flex: '1 1 140px', padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE ──────────────────────────────── */}
      <section style={{ backgroundColor: '#fff', padding: '4rem 0', borderBottom: `1px solid ${V.border}` }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: V.primary, textTransform: 'uppercase' }}>Comment ça marche</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: V.dark, letterSpacing: '-0.025em', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Trois étapes, c&apos;est tout.</h2>
            <p style={{ color: V.muted, fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto' }}>Pas d&apos;inscription, pas de compte. Trouve ce que tu cherches en quelques secondes.</p>
          </div>

          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '14px', backgroundColor: V[100], border: `2px solid ${V[400]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 2px 8px ${V[300]}44` }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: V[700], letterSpacing: '0.1em' }}>ÉTAPE {s.step}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: V.dark, marginBottom: '0.4rem' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: V.muted, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOUTES LES RUBRIQUES ───────────────────────────── */}
      <div style={{ backgroundColor: '#fff', padding: '3rem 0 0' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: V.primary, textTransform: 'uppercase' }}>Toutes les rubriques</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: V.dark, letterSpacing: '-0.025em', marginTop: '0.5rem', marginBottom: '0.4rem' }}>Que cherches-tu aujourd&apos;hui ?</h2>
          <p style={{ color: V.muted, fontSize: '0.88rem', maxWidth: '480px', margin: '0 auto' }}>{SECTIONS.length} rubriques · mises à jour par la communauté</p>
        </div>
      </div>

      <section style={{ backgroundColor: '#fff' }}>
        <div className="sections-grid">
          {SECTIONS.map(s => (
            <RubriqueCard
              key={s.href}
              href={s.href}
              color={V.primary}
              bg={V.surface}
              title={s.title}
              arabic={s.arabic}
              description={s.description}
              tags={s.tags}
              soon={s.soon}
              image={s.image}
              iconNode={<s.icon size={17} color="#fff" strokeWidth={1.8} />}
            />
          ))}
        </div>
      </section>

      {/* ─── TICKER STATS ───────────────────────────────────── */}
      <section style={{ background: V.dark, padding: '0.85rem 0', overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2, background: `linear-gradient(to right, ${V.dark}, transparent)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2, background: `linear-gradient(to left, ${V.dark}, transparent)`, pointerEvents: 'none' }} />
          <div className="ticker-track">
            {[...STATS, ...STATS].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0 2.25rem', borderRight: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  <Icon size={14} color={V.lime} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Plus de {s.count}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CommunityStories />

      {/* ─── CONTRIBUTION CTA ───────────────────────────────── */}
      <section style={{ background: V.primary, padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-5%', width: '50%', height: '120%', background: `radial-gradient(ellipse at center, ${V.primary}22 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>Ce site grandit grâce à vous</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0.75rem 0 0.875rem' }}>
              Chaque fiche ajoutée = une ressource<br />de plus pour quelqu&apos;un qui en a besoin.
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#fff', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              Al-Wasil est construit par la communauté, pour la communauté. Plus il y a de données, plus il est utile.
              <strong style={{ color: 'rgba(255,255,255,0.85)' }}> Tu fais partie de cette boucle.</strong>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {CONTRIBUTION_ITEMS.map((item, i) => (
              <Link key={i} href={item.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '0.875rem', padding: '1.1rem 1.25rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '8px', flexShrink: 0, backgroundColor: `${V.primary}26`, border: `1px solid ${V.primary}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.85)' }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', margin: '0 0 2px' }}>{item.label}</p>
                  <p style={{ color: '#fff', fontSize: '0.75rem', margin: 0 }}>{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/contact?type=general" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', backgroundColor: V.lime, color: V.dark, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', borderRadius: '9999px' }}>
              <Plus size={16} /> Contribuer à Al-Wasil
            </Link>
            <p style={{ color: '#fff', fontSize: '0.75rem', marginTop: '1rem' }}>Gratuit · Sans compte · En 2 minutes</p>
          </div>
        </div>
      </section>
    </div>
  );
}
