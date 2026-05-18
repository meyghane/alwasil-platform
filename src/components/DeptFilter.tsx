'use client';

// Filtre par département — composant réutilisable
// Utilisé sur les pages Éducation, Événements, Solidarité, etc.
// counts : nombre d'éléments par département (optionnel) — affiche un badge et masque les vides

const DEPTS = [
 { code: 'Tout', label: 'Tout' },
 { code: '75', label: 'Paris' },
 { code: '92', label: '92' },
 { code: '93', label: '93' },
 { code: '94', label: '94' },
 { code: '91', label: '91' },
 { code: '78', label: '78' },
 { code: '77', label: '77' },
 { code: '95', label: '95' },
 { code: '00', label: ' En ligne' },
];

type Props = {
 selected?: string;
 value?: string;
 onChange: (dept: string) => void;
 counts?: Record<string, number>; // nombre d'items par code dept
 label?: string; // label titre optionnel
};

export default function DeptFilter({ selected, value, onChange, counts, label }: Props) {
 const current = value ?? selected ?? 'Tout';

 const visible = DEPTS.filter(dept => {
 if (dept.code === 'Tout') return true;
 if (!counts) return true;
 return (counts[dept.code] ?? 0) > 0;
 });

 return (
 <div>
 <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
 {label ?? 'Département'}
 </p>
 <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
 {visible.map(dept => {
 const isActive = current === dept.code;
 const count = counts ? (dept.code === 'Tout' ? Object.values(counts).reduce((a, b) => a + b, 0) : (counts[dept.code] ?? 0)) : null;
 return (
 <button
 key={dept.code}
 onClick={() => onChange(dept.code)}
 style={{
 display: 'flex',
 alignItems: 'center',
 gap: '0.3rem',
 padding: '0.35rem 0.75rem',
 borderRadius: '999px',
 border: isActive ? '2px solid var(--primary-color)' : '1.5px solid var(--border-color)',
 backgroundColor: isActive ? 'var(--primary-color)' : 'white',
 color: isActive ? 'white' : 'var(--text-secondary)',
 fontSize: '0.8rem',
 fontWeight: isActive ? 700 : 400,
 cursor: 'pointer',
 transition: 'all 0.15s ease',
 whiteSpace: 'nowrap',
 }}
 >
 {dept.label}
 {count !== null && (
 <span style={{
 fontSize: '0.65rem',
 fontWeight: 700,
 backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
 color: isActive ? 'white' : 'var(--text-secondary)',
 borderRadius: '999px',
 padding: '0.05rem 0.4rem',
 lineHeight: 1.5,
 }}>
 {count}
 </span>
 )}
 </button>
 );
 })}
 </div>
 </div>
 );
}
