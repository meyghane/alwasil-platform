'use client';

// Filtre par département — composant réutilisable
// Utilisé sur les pages Éducation et Événements

const DEPTS = [
  { code: 'Tout', label: 'Tout IDF', emoji: '🗺️' },
  { code: '75', label: 'Paris', emoji: '🏛️' },
  { code: '92', label: 'Hauts-de-Seine', emoji: '92' },
  { code: '93', label: 'Seine-St-Denis', emoji: '93' },
  { code: '94', label: 'Val-de-Marne', emoji: '94' },
  { code: '91', label: 'Essonne', emoji: '91' },
  { code: '78', label: 'Yvelines', emoji: '78' },
  { code: '77', label: 'Seine-et-Marne', emoji: '77' },
  { code: '95', label: "Val-d'Oise", emoji: '95' },
  { code: '00', label: 'En ligne', emoji: '💻' },
];

type Props = {
  value: string;
  onChange: (dept: string) => void;
};

export default function DeptFilter({ value, onChange }: Props) {
  return (
    <div>
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Département
      </p>
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}>
        {DEPTS.map(dept => {
          const isActive = value === dept.code;
          return (
            <button
              key={dept.code}
              onClick={() => onChange(dept.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                border: isActive ? '2px solid var(--primary-color)' : '1.5px solid var(--border-color)',
                backgroundColor: isActive ? 'var(--primary-color)' : 'white',
                color: isActive ? 'white' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>{dept.emoji}</span>
              {dept.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
