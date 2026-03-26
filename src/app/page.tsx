import Link from 'next/link';
import { BookOpen, Calendar, HandHeart, Briefcase, ArrowRight, ShieldCheck, MapPin, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 0', 
        textAlign: 'center', 
        maxWidth: '800px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '0.25rem 1rem', 
          backgroundColor: 'rgba(13, 148, 136, 0.1)', 
          color: 'var(--primary-color)', 
          borderRadius: '9999px', 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          marginBottom: '1.5rem' 
        }}>
          Bêta Privée - Rejoignez le mouvement
        </div>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 800, 
          lineHeight: 1.1, 
          letterSpacing: '-0.025em', 
          marginBottom: '1.5rem',
          background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          L'essentiel de la communauté, <br/> enfin réuni au même endroit.
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '2.5rem', 
          lineHeight: 1.6 
        }}>
          Trouvez des cours, participez à des événements, engagez-vous dans des actions solidaires et connectez-vous avec ceux qui partagent vos valeurs.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>Explorer les ressources</button>
          <button className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>Proposer une initiative</button>
        </div>
      </section>

      {/* Main Grid Navigation */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem', marginBottom: '6rem' }}>
        <FeatureCard 
          href="/education"
          icon={<BookOpen size={32} color="var(--primary-color)" />}
          title="Éducation (Ilm)"
          description="Trouvez des instituts, des professeurs particuliers et des cercles d'étude. Notez et partagez votre expérience."
        />
        <FeatureCard 
          href="/events"
          icon={<Calendar size={32} color="#f59e0b" />} // Amber
          title="Événements (Liqa)"
          description="Conférences, séminaires, portes ouvertes. Ne ratez plus rien de ce qui se passe autour de vous."
        />
        <FeatureCard 
          href="/solidarity"
          icon={<HandHeart size={32} color="#ef4444" />} // Red
          title="Solidarité (Takaful)"
          description="Maraudes, visites aux malades, actions humanitaires. Engagez-vous là où c'est nécessaire."
        />
        <FeatureCard 
          href="/jobs"
          icon={<Briefcase size={32} color="#3b82f6" />} // Blue
          title="Emploi (Amal)"
          description="Offres d'emploi éthiques, acceptant le voile, et réseau d'entraide professionnelle."
        />
        <FeatureCard 
          href="/justice"
          icon={<ShieldCheck size={32} color="#8b5cf6" />} // Violet
          title="Justice & Droits (Adl)"
          description="Signalements ARCOM, ressources juridiques et mobilisation collective contre les discriminations."
        />
         <FeatureCard 
          href="/about"
          icon={<Star size={32} color="#10b981" />} // Emerald
          title="La Communauté"
          description="Participez au brainstorming, proposez des idées et construisons ensemble l'avenir de la plateforme."
        />
      </section>

      {/* Featured Section (Mock) */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Événements à venir</h2>
          <Link href="/events" style={{ color: 'var(--primary-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Tout voir <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3" style={{ gap: '1.5rem' }}>
          {/* Event 1 */}
          <EventCard 
            title="Conférence : L'Éthique au Travail" 
            date="Samedi 28 Mars • 14h00" 
            location="Grande Mosquée de Paris" 
            organizer="Institut Al-Ghazali"
            tag="Conférence"
          />
          {/* Event 2 */}
          <EventCard 
            title="Maraude Solidaire - Gare du Nord" 
            date="Dimanche 29 Mars • 19h30" 
            location="Gare du Nord, Paris" 
            organizer="Au Cœur de la Fraternité"
            tag="Solidarité"
          />
          {/* Event 3 */}
          <EventCard 
            title="Webinaire : Comprendre les enjeux de l'IA" 
            date="Jeudi 2 Avril • 20h00" 
            location="En ligne (Zoom)" 
            organizer="Muslim Tech Network"
            tag="Webinaire"
          />
        </div>
      </section>

    </div>
  );
}

const FeatureCard = ({ href, icon, title, description }: any) => (
  <Link href={href} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textDecoration: 'none', height: '100%' }}>
    <div style={{ 
      width: '56px', 
      height: '56px', 
      borderRadius: '12px', 
      backgroundColor: 'rgba(0,0,0,0.03)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      {icon}
    </div>
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{description}</p>
    </div>
  </Link>
);

const EventCard = ({ title, date, location, organizer, tag }: any) => (
  <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
    <div style={{ height: '140px', backgroundColor: '#e5e7eb', position: 'relative' }}>
        {/* Placeholder for image */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
            {tag}
        </div>
    </div>
    <div style={{ padding: '1.5rem' }}>
      <div style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.5rem' }}>{date}</div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
        <MapPin size={14} /> {location}
      </div>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Par <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{organizer}</span>
      </div>
    </div>
  </div>
);
