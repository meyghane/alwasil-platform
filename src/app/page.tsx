import Link from 'next/link';
import {
  ArrowRight, ChevronRight, Users, BookOpen, Calendar, Briefcase,
  Waves, Library, Stethoscope, HandCoins, Scale, Plane, Building2,
  HeartHandshake, UserCheck, Landmark, ShieldCheck, MessageCircle,
  Search, CheckCircle, Zap, Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { allInstituts } from '@/data/institutes';
import { allEvents } from '@/data/events';
import { jobOffers } from '@/data/jobs';
import { V } from '@/lib/tokens';
import RubriqueCard from '@/components/home/RubriqueCard';
import TestimonialCard from '@/components/home/TestimonialCard';
import EventCard from '@/components/home/EventCard';

// ── Types ─────────────────────────────────────────────────────────
type Section = {
  href: string; icon: LucideIcon; color: string; bg: string;
  title: string; arabic: string; description: string;
  tags: string[]; image: string; soon?: boolean;
};

type StatItem = { count: number; label: string; icon: LucideIcon };

// ── Data ──────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  { href: '/education', icon: BookOpen, color: '#4a0e58', bg: '#fdfbf0', title: 'Éducation', arabic: 'العلم', description: 'Instituts, cours d\'arabe, cercles d\'étude et professeurs de Coran.', tags: ['Instituts', 'Arabe', 'Halaqa', 'Tajwid'], image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80' },
  { href: '/events', icon: Calendar, color: '#3a0a45', bg: '#ecfdf5', title: 'Événements', arabic: 'اللقاء', description: 'Conférences, séminaires et portes ouvertes en France.', tags: ['Conférences', 'Séminaires', 'En ligne'], image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80' },
  { href: '/solidarity', icon: HeartHandshake, color: '#2c0835', bg: '#fdfbf0', title: 'Solidarité', arabic: 'التكافل', description: 'Cagnottes, maraudes, visites aux malades et voyages humanitaires.', tags: ['Cagnottes', 'Maraudes', 'Urgence', 'Palestine', 'Voyages'], image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80' },
  { href: '/jobs', icon: Briefcase, color: '#4a0e58', bg: '#ecfdf5', title: 'Emploi', arabic: 'الأمل', description: 'Offres voile accepté, prière OK. Réseau CMN et vivier de talents.', tags: ['Voile OK', 'Prière OK', 'CDI / Freelance'], image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { href: '/sante', icon: Stethoscope, color: '#3a0a45', bg: '#fdfbf0', title: 'Santé', arabic: 'الشفاء', description: 'Psychologues orientés communauté, hijama certifiés et roqya.', tags: ['Psychologues', 'Hijama', 'Roqya'], image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80' },
  { href: '/librairies', icon: Library, color: '#2c0835', bg: '#ecfdf5', title: 'Librairies', arabic: 'المكتبة', description: 'Librairies islamiques d\'Île-de-France : livres, Corans, arabe.', tags: ['Corans', 'Livres', 'Enfants'], image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80' },
  { href: '/piscines', icon: Waves, color: '#662a94', bg: '#fdfbf0', title: 'Piscines Burkini', arabic: 'السباحة', description: 'Créneaux burkini et maillots couvrants en Île-de-France.', tags: ['Créneaux femmes', 'Burkini', 'IdF'], image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80' },
  { href: '/hajj', icon: Plane, color: '#4a0e58', bg: '#ecfdf5', title: 'Hajj & Omra', arabic: 'الحج', description: 'Comparez les agences, offres 2026 et guide du pèlerin.', tags: ['Hajj 2026', 'Omra', 'Comparateur'], image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=80' },
  { href: '/justice', icon: ShieldCheck, color: '#3a0a45', bg: '#fdfbf0', title: 'Justice & Droits', arabic: 'العدل', description: 'Vos droits en France, FAQ voile/prière et signalements ARCOM.', tags: ['Voile au travail', 'ARCOM', 'Discrimination'], image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80' },
  { href: '#', icon: MessageCircle, color: 'rgba(255,255,255,0.85)', bg: '#fdfbf0', title: 'Communauté', arabic: 'الأمة', description: 'Annuaire de compétences, marrainage, muqabala et espace de brainstorming.', tags: ['Marrainage', 'Muqabala', 'Compétences', 'Entraide'], image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', soon: true },
];

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

const PARTICLES = [
  { x: '5%',  y: '15%', s: 2, d: 0   }, { x: '15%', y: '70%', s: 1, d: 2.5 },
  { x: '25%', y: '40%', s: 3, d: 1.2 }, { x: '35%', y: '85%', s: 1, d: 4   },
  { x: '45%', y: '20%', s: 2, d: 0.8 }, { x: '55%', y: '60%', s: 1, d: 3.2 },
  { x: '65%', y: '30%', s: 2, d: 1.8 }, { x: '75%', y: '75%', s: 3, d: 0.4 },
  { x: '85%', y: '50%', s: 1, d: 2.8 }, { x: '92%', y: '25%', s: 2, d: 1.5 },
  { x: '10%', y: '55%', s: 1, d: 3.8 }, { x: '50%', y: '90%', s: 2, d: 2.2 },
  { x: '70%', y: '10%', s: 1, d: 0.6 }, { x: '80%', y: '85%', s: 3, d: 1.0 },
  { x: '40%', y: '5%',  s: 2, d: 4.5 }, { x: '20%', y: '95%', s: 1, d: 3.5 },
  { x: '60%', y: '45%', s: 2, d: 2.0 }, { x: '90%', y: '65%', s: 1, d: 1.3 },
];

const LANTERNS = [
  { x: '8%',  y: '15%', size: 28, delay: '0s',   dur: '7s'   },
  { x: '88%', y: '20%', size: 22, delay: '1.5s',  dur: '8s'   },
  { x: '15%', y: '70%', size: 18, delay: '3s',    dur: '6s'   },
  { x: '82%', y: '65%', size: 24, delay: '0.8s',  dur: '9s'   },
  { x: '50%', y: '8%',  size: 16, delay: '2s',    dur: '7.5s' },
  { x: '35%', y: '82%', size: 20, delay: '4s',    dur: '8s'   },
];

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

const TESTIMONIALS = [
  { quote: "J'ai trouvé une piscine avec créneau burkini à 10 min de chez moi en 2 minutes. Avant je passais des heures à chercher.", name: 'Amira B.', role: 'Utilisatrice · Seine-Saint-Denis', tag: 'Piscines burkini', initial: 'A' },
  { quote: "On a trouvé notre employeur actuel via Al-Wasil. Le voile est accepté, la prière aussi. Ça change tout.", name: 'Khadija M.', role: 'Utilisatrice · Paris 18e', tag: 'Emploi', initial: 'K' },
  { quote: "On utilise Al-Wasil pour promouvoir nos maraudes. On a 3× plus de bénévoles depuis qu'on est référencés.", name: 'Association An-Nour', role: 'Organisateur · Bobigny', tag: 'Solidarité', initial: 'N' },
];

// ── Stats ─────────────────────────────────────────────────────────
function buildStats(): StatItem[] {
  const upcomingCount = allEvents.filter(e => new Date(e.date) >= new Date()).length;
  return [
    { count: 1040,               label: 'mosquées référencées en France',              icon: Building2 },
    { count: upcomingCount,      label: 'événements islamiques à venir en IDF',         icon: Calendar },
    { count: allInstituts.length, label: 'instituts & professeurs de Coran',            icon: BookOpen },
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

// ── Upcoming events (3 prochains) ─────────────────────────────────
function buildUpcomingEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return allEvents
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
        tag: CAT_LABELS[e.category] ?? 'Événement',
        color: TAG_COLORS[e.category] ?? '#c9973a',
      };
    });
}

// ── Page ──────────────────────────────────────────────────────────
export default function Home() {
  const STATS = buildStats();
  const UPCOMING_EVENTS = buildUpcomingEvents();

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", backgroundColor: '#fff', color: V.dark }}>

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section style={{
        padding: '4.5rem 0 4rem',
        background: 'linear-gradient(150deg, #100c04 0%, #0a0806 45%, #050404 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Halo principal — animé, dérive lentement */}
        <div style={{ position: 'absolute', top: '-15%', left: '-8%', width: '55%', height: '80%', background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.45) 0%, rgba(20,14,4,0.18) 45%, transparent 70%)', pointerEvents: 'none', animation: 'halo-drift 18s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '35%', height: '60%', background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {PARTICLES.map((p, i) => (
          <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: `${p.s}px`, height: `${p.s}px`, borderRadius: '50%', backgroundColor: '#d4a853', opacity: 0.4, pointerEvents: 'none', animation: `particle-float ${6 + p.d}s ease-in-out ${p.d}s infinite` }} />
        ))}

        {/* Mosaïque arabe — couche base, toujours visible très faiblement */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start',
          gap: '0.5rem', padding: '1rem',
          pointerEvents: 'none', overflow: 'hidden',
          transform: 'rotate(-8deg) scale(1.15)',
          transformOrigin: 'center center',
          opacity: 0.05,
        }}>
          {Array.from({ length: 120 }).map((_, i) => (
            <span key={i} style={{
              fontFamily: "'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
              fontSize: '1.6rem', fontWeight: 700,
              color: '#d4a853', letterSpacing: '0.1em',
              userSelect: 'none', whiteSpace: 'nowrap',
            }}>
              الواصل
            </span>
          ))}
        </div>

        {/* Mosaïque arabe — couche révélée par le halo (screen blend) */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start',
          gap: '0.5rem', padding: '1rem',
          pointerEvents: 'none', overflow: 'hidden',
          transform: 'rotate(-8deg) scale(1.15)',
          transformOrigin: 'center center',
          opacity: 0.55,
          mixBlendMode: 'screen',
        }}>
          {Array.from({ length: 120 }).map((_, i) => (
            <span key={i} style={{
              fontFamily: "'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
              fontSize: '1.6rem', fontWeight: 700,
              color: '#d4a853', letterSpacing: '0.1em',
              userSelect: 'none', whiteSpace: 'nowrap',
            }}>
              الواصل
            </span>
          ))}
        </div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3.5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.03em', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#fff', display: 'inline-block' }} />
              La communauté musulmane française, centralisée.
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#fff', marginBottom: '1rem' }}>
              Fini de chercher partout.{' '}
              <span style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Tout est ici.
              </span>
            </h1>

            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '0.6rem', maxWidth: '430px', fontStyle: 'italic' }}>
              Emploi voile OK impossible à trouver. Piscine burkini introuvable. Cours d&apos;arabe dispersés. Événements qu&apos;on rate.
            </p>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '430px', fontWeight: 500 }}>
              Al-Wasil centralise <strong style={{ color: 'rgba(255,255,255,0.85)' }}>tout ce que la communauté musulmane de France cherche</strong> — en un seul endroit, mis à jour par la communauté.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="#rubriques" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.5rem', backgroundColor: '#fff', color: V[800], fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', borderRadius: '8px', boxShadow: '0 0 20px rgba(255,255,255,0.25), 0 4px 12px rgba(0,0,0,0.2)' }}>
                Je cherche une ressource <ArrowRight size={14} />
              </a>
              <Link href="/contact?type=general" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.25rem', backgroundColor: 'rgba(212,168,83,0.12)', color: '#d4a853', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', borderRadius: '8px', border: '1px solid rgba(212,168,83,0.35)' }}>
                <Plus size={14} /> Proposer une fiche
              </Link>
            </div>
          </div>

          {/* Mosaïque 3×3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            {SECTIONS.slice(0, 9).map(s => (
              <Link key={s.href} href={s.href} className="led-card-outer" style={{ aspectRatio: '1', textDecoration: 'none' }}>
                <div className="led-spin" />
                <div className="led-face" style={{ background: '#080604' }}>
                  <s.icon size={22} color="#d4a853" strokeWidth={1.5} />
                  <span style={{ fontSize: '0.54rem', fontWeight: 800, color: 'rgba(255,255,255,0.88)', textAlign: 'center', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1.2, padding: '0 0.35rem' }}>
                    {s.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TICKER STATS ───────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #0d0b04 0%, #080604 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.85rem 0', overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2, background: 'linear-gradient(to right, #0d0b04, transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2, background: 'linear-gradient(to left, #0d0b04, transparent)', pointerEvents: 'none' }} />
          <div className="ticker-track">
            {[...STATS, ...STATS].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0 2.25rem', borderRight: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  <Icon size={14} color="#d4a853" strokeWidth={1.8} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Plus de {s.count}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>{s.label}</span>
                </div>
              );
            })}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
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

      {/* ─── RUBRIQUES ──────────────────────────────────────── */}
      <div id="rubriques" style={{ backgroundColor: '#fff', padding: '3.5rem 0 0' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: V.primary, textTransform: 'uppercase' }}>Toutes les rubriques</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: V.dark, letterSpacing: '-0.025em', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Que cherches-tu aujourd&apos;hui ?</h2>
          <p style={{ color: V.muted, fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto' }}>{SECTIONS.length} rubriques · chacune mise à jour par la communauté</p>
        </div>
      </div>

      {/* Grille full-bleed — 3 colonnes, flush, sans arrondis */}
      <section style={{ backgroundColor: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {SECTIONS.map(s => (
            <RubriqueCard
              key={s.href}
              href={s.href}
              color={s.color}
              bg={s.bg}
              title={s.title}
              arabic={s.arabic}
              description={s.description}
              tags={s.tags}
              soon={s.soon}
              image={s.image}
              iconNode={<s.icon size={17} color="#d4a853" strokeWidth={1.8} />}
            />
          ))}
        </div>
      </section>

      {/* ─── ÉVÉNEMENTS ─────────────────────────────────────── */}
      <section style={{ padding: '3rem 0 5rem', backgroundColor: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '3px', height: '16px', backgroundColor: V[600], borderRadius: '9999px', display: 'block', flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: V.dark, textTransform: 'uppercase' }}>Événements à venir</span>
            </div>
            <Link href="/events" style={{ fontSize: '0.8rem', fontWeight: 600, color: V.primary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              Tout voir <ChevronRight size={14} />
            </Link>
          </div>

          {UPCOMING_EVENTS.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fdfbf2', borderRadius: '16px', border: '1px solid #f0dea0' }}>
              <p style={{ color: V.muted, margin: 0, fontSize: '0.9rem' }}>
                Aucun événement à venir pour le moment.{' '}
                <Link href="/contact?type=evenement" style={{ color: V.primary, fontWeight: 600, textDecoration: 'none' }}>Proposer un événement →</Link>
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${UPCOMING_EVENTS.length}, 1fr)`, gap: '1rem' }}>
              {UPCOMING_EVENTS.map(ev => <EventCard key={ev.title} {...ev} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── TÉMOIGNAGES ────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(160deg, #0a0806 0%, #100c04 50%, #0a0806 100%)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,151,58,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,151,58,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {LANTERNS.map((l, i) => (
          <div key={i} style={{ position: 'absolute', left: l.x, top: l.y, pointerEvents: 'none', opacity: 0.18, animation: `particle-float ${l.dur} ease-in-out ${l.delay} infinite` }}>
            <svg width={l.size} height={l.size * 1.5} viewBox="0 0 20 30" fill="none">
              <line x1="10" y1="0" x2="10" y2="4" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="6" y="4" width="8" height="2" rx="1" fill="#d4a853"/>
              <path d="M4 6 Q3 13 4 20 L16 20 Q17 13 16 6 Z" fill="rgba(212,168,83,0.2)" stroke="#d4a853" strokeWidth="1"/>
              <line x1="4" y1="11" x2="16" y2="11" stroke="#d4a853" strokeWidth="0.6" opacity="0.5"/>
              <line x1="4" y1="16" x2="16" y2="16" stroke="#d4a853" strokeWidth="0.6" opacity="0.5"/>
              <rect x="6" y="20" width="8" height="2" rx="1" fill="#d4a853"/>
              <ellipse cx="10" cy="27" rx="4" ry="2" fill="rgba(212,168,83,0.4)"/>
            </svg>
          </div>
        ))}

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: V.primary, textTransform: 'uppercase' }}>Ils utilisent Al-Wasil</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginTop: '0.5rem' }}>Ce que dit la communauté</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'rgba(201,151,58,0.45)', marginTop: '2rem' }}>
            Ces témoignages seront remplacés par de vrais retours.{' '}
            <Link href="/contact?type=general" style={{ color: V.primary, textDecoration: 'none', fontWeight: 600 }}>Partager ton expérience →</Link>
          </p>
        </div>
      </section>

      {/* ─── CONTRIBUTION CTA ───────────────────────────────── */}
      <section style={{ background: 'linear-gradient(150deg, #100c04 0%, #0a0806 45%, #050404 100%)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-5%', width: '50%', height: '120%', background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.28) 0%, rgba(20,14,4,0.1) 50%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>Ce site grandit grâce à vous</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0.75rem 0 0.875rem' }}>
              Chaque fiche ajoutée = une ressource<br />de plus pour quelqu&apos;un qui en a besoin.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              Al-Wasil est construit par la communauté, pour la communauté. Plus il y a de données, plus il est utile.
              <strong style={{ color: 'rgba(255,255,255,0.85)' }}> Tu fais partie de cette boucle.</strong>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {CONTRIBUTION_ITEMS.map((item, i) => (
              <Link key={i} href={item.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '0.875rem', padding: '1.1rem 1.25rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '8px', flexShrink: 0, backgroundColor: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.85)' }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', margin: '0 0 2px' }}>{item.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', margin: 0 }}>{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/contact?type=general" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', backgroundColor: '#fff', color: '#2c0835', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <Plus size={16} /> Contribuer à Al-Wasil
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '1rem' }}>Gratuit · Sans compte · En 2 minutes</p>
          </div>
        </div>
      </section>
    </div>
  );
}
