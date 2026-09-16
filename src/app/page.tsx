import Link from 'next/link';
import {
  ArrowRight, Users, BookOpen, Calendar, Briefcase,
  Waves, Library, Stethoscope, HandCoins, Scale, Plane, Building2,
  HeartHandshake, UserCheck, Landmark, ShieldCheck,
  Search, CheckCircle, Zap, Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Institut } from '@/data/institutes';
import type { Event } from '@/data/events';
import type { JobOffer } from '@/data/jobs';
import { getInstituts, getEvents, getJobOffers } from '@/lib/db-queries';
import { HOME_THEME as V } from '@/lib/home-theme';
import RubriqueCard from '@/components/home/RubriqueCard';
import EditorialHero from '@/components/home/EditorialHero';
import CommunityStories from '@/components/home/CommunityStories';
import SolidarityPreview from '@/components/home/SolidarityPreview';
import UpcomingEventsRail from '@/components/home/UpcomingEventsRail';
import BackToSchool from '@/components/home/BackToSchool';
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
    .filter(e => new Date(e.date) >= today && e.title !== 'Exposition — Le Jardin Oriental-Islamique de Berlin')
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

      {/* ─── NAVIGATEUR DE SERVICES ─────────────────────────── */}
      <section className="service-navigator" aria-labelledby="service-navigator-title">
        <div className="service-navigator__head">
          <span>La communauté, à portée de main</span>
          <h2 id="service-navigator-title">Que cherches-tu<br/>aujourd&apos;hui ?</h2>
          <p>Événements, entraide, voyage, apprentissage et services du quotidien : choisis ton besoin.</p>
        </div>
        <div className="service-navigator__priorities">
          {SECTIONS.slice(0, 3).map(s => <RubriqueCard key={s.href} href={s.href} title={s.title} arabic={s.arabic} description={s.description} tags={s.tags} soon={s.soon} image={s.image} color={V.primary} bg={V.surface} priority iconNode={<s.icon size={23} color="#fff" strokeWidth={1.8} />} />)}
        </div>
        <div className="service-navigator__services">
          {SECTIONS.slice(3).map(s => <RubriqueCard key={s.href} href={s.href} title={s.title} arabic={s.arabic} description={s.description} tags={s.tags} soon={s.soon} image={s.image} color={V.primary} bg={V.surface} iconNode={<s.icon size={19} color="#fff" strokeWidth={1.8} />} />)}
        </div>
      </section>

      {/* ─── ÉVÉNEMENTS (priorité n°1) ───────────────────────── */}
      <section id="evenements" className="events-showcase">
        <div style={{ maxWidth: 1540, margin: '0 auto' }}>
          <div className="events-showcase__label" aria-hidden="true">ÉVÉNEMENTS</div>
          {UPCOMING_EVENTS.length === 0 ? (
            <div style={{ margin: '0 clamp(18px, 4vw, 56px)', textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: 18, border: `1px solid ${V.border}` }}>
              <p style={{ color: V.muted, margin: 0, fontSize: '0.9rem' }}>
                Aucun événement à venir pour le moment.{' '}
                <Link href="/contact?type=evenement" style={{ color: V.primary, fontWeight: 600, textDecoration: 'none' }}>Proposer un événement →</Link>
              </p>
            </div>
          ) : (
            <UpcomingEventsRail events={UPCOMING_EVENTS} />
          )}
        </div>
      </section>

      <SolidarityPreview />

      {/* ─── HAJJ & OMRA (priorité n°3) ──────────────────────── */}
      <section className="hajj-showcase" aria-labelledby="hajj-showcase-title">
        <div className="hajj-showcase__label" aria-hidden="true">HAJJ &amp; OMRA</div>
        <div className="hajj-showcase__feature">
          <div className="hajj-showcase__copy">
            <span><Plane size={15} aria-hidden="true" /> PRÉPARER SON VOYAGE</span>
            <div>
              <h2 id="hajj-showcase-title">Un voyage spirituel.<br/><mark>Des choix éclairés.</mark></h2>
              <p>Comparez les agences agréées, les formules et les départs pour préparer votre Hajj ou votre Omra avec plus de sérénité.</p>
            </div>
            <div className="hajj-showcase__actions">
              <Link href="/hajj">Comparer les agences <ArrowRight size={17} /></Link>
              <Link href="/annonceurs">Vous êtes une agence ?</Link>
            </div>
          </div>
          <div className="hajj-showcase__visual">
            <img src="/images/testimonials/hajj-flight.png" alt="Voyageuse regardant le paysage depuis un avion en route vers son pèlerinage" />
            <span>Hajj &amp; Omra 2026</span>
          </div>
        </div>
        <div className="hajj-showcase__stats" aria-label="Chiffres clés Hajj et Omra">
          <div><strong>13</strong><span>agences agréées<br/>référencées</span></div>
          <div><strong>20+</strong><span>formules à<br/>comparer</span></div>
          <div><strong>Toute l’année</strong><span>des départs depuis<br/>l’Île-de-France</span></div>
        </div>
      </section>

      <BackToSchool />
      <CommunityStories />

      {/* ─── COMMENT ÇA MARCHE ──────────────────────────────── */}
      <section className="how-it-works">
        <div className="how-it-works__head">
          <span>Comment ça marche</span>
          <h2>Tu cherches.<br/><mark>Tu trouves.</mark><br/>Tu agis.</h2>
          <p>Pas de compte à créer. Al-Wasil te mène directement vers la bonne ressource et le bon contact.</p>
        </div>
        <div className="how-it-works__steps">
          {STEPS.map((s, i) => (
            <article key={i}>
              <div className="how-it-works__number">{s.step}</div>
              <div className="how-it-works__icon">{s.icon}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </article>
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
