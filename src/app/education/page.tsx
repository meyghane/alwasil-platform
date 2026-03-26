import { Search, MapPin, Star, Filter } from 'lucide-react';

export default function EducationPage() {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Éducation & Savoir (Ilm)</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Trouvez l'institut ou le professeur idéal pour votre apprentissage.</p>
      </div>

      {/* Search & Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem', 
        flexWrap: 'wrap' 
      }}>
        <div style={{ 
          flex: 1, 
          position: 'relative', 
          minWidth: '300px' 
        }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Rechercher un cours, un institut, un sujet..." 
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem 0.75rem 3rem', 
              borderRadius: '0.5rem', 
              border: '1px solid var(--border-color)', 
              fontSize: '1rem',
              outline: 'none'
            }} 
          />
        </div>
        <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
          <Filter size={18} /> Filtres
        </button>
        <button className="btn btn-primary">Rechercher</button>
      </div>

      {/* Categories / Tags */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {['Tout', 'Coran & Tajwid', 'Langue Arabe', 'Sciences Islamiques', 'Enfants', 'Sœurs', 'En Ligne'].map((tag, i) => (
          <button key={i} style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '999px', 
            backgroundColor: i === 0 ? 'var(--primary-color)' : 'transparent',
            color: i === 0 ? 'white' : 'var(--text-secondary)',
            border: i === 0 ? 'none' : '1px solid var(--border-color)',
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}>
            {tag}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Card 1 - Institute */}
        <EducationCard 
          imageColor="#dcfce7"
          category="Institut Physique"
          title="Institut Al-Ghazali"
          location="Paris 5ème"
          rating={4.8}
          reviews={124}
          price="$$"
          description="Cours de théologie et de langue arabe. Programme complet sur 3 ans."
          tags={['Arabe', 'Théologie', 'Adultes']}
        />

         {/* Card 2 - Online Teacher */}
         <EducationCard 
          imageColor="#dbeafe"
          category="Professeur Indépendant"
          title="Sheikh Ahmed - Correction Coran"
          location="En Ligne (Zoom)"
          rating={5.0}
          reviews={42}
          price="$"
          description="Correction de récitation (Tajwid) personnalisée. Ijaza possible."
          tags={['Coran', 'Tajwid', 'Privé']}
        />

        {/* Card 3 */}
        <EducationCard 
          imageColor="#fef3c7"
          category="Institut En Ligne"
          title="Madrassah An-Nour"
          location="En Ligne"
          rating={4.5}
          reviews={89}
          price="$$$"
          description="École en ligne pour enfants et adolescents. Programme ludique."
          tags={['Enfants', 'Débutant']}
        />

         {/* Card 4 */}
         <EducationCard 
          imageColor="#f3e8ff"
          category="Cercle d'Étude"
          title="Halaqa Sœurs - Tafsir"
          location="Mosquée de Créteil"
          rating={4.9}
          reviews={15}
          price="Gratuit"
          description="Étude du Tafsir de Juz Amma entre sœurs chaque dimanche."
          tags={['Sœurs', 'Gratuit', 'Tafsir']}
        />

      </div>

    </div>
  );
}

const EducationCard = ({ imageColor, category, title, location, rating, reviews, price, description, tags }: any) => (
  <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ height: '160px', backgroundColor: imageColor, position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '1rem', 
        left: '1rem', 
        backgroundColor: 'rgba(255,255,255,0.9)', 
        padding: '0.25rem 0.75rem', 
        borderRadius: '4px', 
        fontSize: '0.75rem', 
        fontWeight: 600,
        color: 'var(--text-primary)'
      }}>
        {category}
      </div>
    </div>
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.3 }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
          <Star size={14} fill="#f59e0b" color="#f59e0b" /> {rating} <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>({reviews})</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        <MapPin size={14} /> {location} • {price}
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5, flex: 1 }}>
        {description}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {tags.map((tag: string, i: number) => (
          <span key={i} style={{ 
            backgroundColor: '#f5f5f4', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '4px', 
            fontSize: '0.75rem', 
            color: 'var(--text-secondary)' 
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);
