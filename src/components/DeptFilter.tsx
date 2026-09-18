'use client';

// Filtre par département - composant réutilisable
// Utilisé sur les pages Éducation, Événements, Solidarité, etc.
// counts : nombre d'éléments par département (optionnel) - affiche un badge et masque les vides

const DEPARTMENT_LABELS: Record<string, string> = {
 '01': 'Ain', '02': 'Aisne', '03': 'Allier', '04': 'Alpes-de-Haute-Provence', '05': 'Hautes-Alpes', '06': 'Alpes-Maritimes',
 '07': 'Ardèche', '08': 'Ardennes', '09': 'Ariège', '10': 'Aube', '11': 'Aude', '12': 'Aveyron', '13': 'Bouches-du-Rhône',
 '14': 'Calvados', '15': 'Cantal', '16': 'Charente', '17': 'Charente-Maritime', '18': 'Cher', '19': 'Corrèze', '21': "Côte-d'Or",
 '22': "Côtes-d'Armor", '23': 'Creuse', '24': 'Dordogne', '25': 'Doubs', '26': 'Drôme', '27': 'Eure', '28': 'Eure-et-Loir',
 '29': 'Finistère', '2A': 'Corse-du-Sud', '2B': 'Haute-Corse', '30': 'Gard', '31': 'Haute-Garonne', '32': 'Gers', '33': 'Gironde',
 '34': 'Hérault', '35': 'Ille-et-Vilaine', '36': 'Indre', '37': 'Indre-et-Loire', '38': 'Isère', '39': 'Jura', '40': 'Landes',
 '41': 'Loir-et-Cher', '42': 'Loire', '43': 'Haute-Loire', '44': 'Loire-Atlantique', '45': 'Loiret', '46': 'Lot', '47': 'Lot-et-Garonne',
 '48': 'Lozère', '49': 'Maine-et-Loire', '50': 'Manche', '51': 'Marne', '52': 'Haute-Marne', '53': 'Mayenne', '54': 'Meurthe-et-Moselle',
 '55': 'Meuse', '56': 'Morbihan', '57': 'Moselle', '58': 'Nièvre', '59': 'Nord', '60': 'Oise', '61': 'Orne', '62': 'Pas-de-Calais',
 '63': 'Puy-de-Dôme', '64': 'Pyrénées-Atlantiques', '65': 'Hautes-Pyrénées', '66': 'Pyrénées-Orientales', '67': 'Bas-Rhin', '68': 'Haut-Rhin',
 '69': 'Rhône', '70': 'Haute-Saône', '71': 'Saône-et-Loire', '72': 'Sarthe', '73': 'Savoie', '74': 'Haute-Savoie', '75': 'Paris',
 '76': 'Seine-Maritime', '77': 'Seine-et-Marne', '78': 'Yvelines', '79': 'Deux-Sèvres', '80': 'Somme', '81': 'Tarn', '82': 'Tarn-et-Garonne',
 '83': 'Var', '84': 'Vaucluse', '85': 'Vendée', '86': 'Vienne', '87': 'Haute-Vienne', '88': 'Vosges', '89': 'Yonne', '90': 'Territoire de Belfort',
 '91': 'Essonne', '92': 'Hauts-de-Seine', '93': 'Seine-Saint-Denis', '94': 'Val-de-Marne', '95': "Val-d'Oise", '971': 'Guadeloupe',
 '972': 'Martinique', '973': 'Guyane', '974': 'La Réunion', '976': 'Mayotte', '00': 'En ligne',
};

type Props = {
 selected?: string;
 value?: string;
 onChange: (dept: string) => void;
 counts?: Record<string, number>; // nombre d'items par code dept
 label?: string; // label titre optionnel
};

export default function DeptFilter({ selected, value, onChange, counts, label }: Props) {
 const current = value ?? selected ?? 'Tout';

 const codes = counts ? Object.keys(counts).filter(code => code !== 'Tout' && (counts[code] ?? 0) > 0).sort((a, b) => a.localeCompare(b, 'fr', { numeric: true })) : Object.keys(DEPARTMENT_LABELS);
 const visible = [{ code: 'Tout', label: 'Tout' }, ...codes.map(code => ({ code, label: DEPARTMENT_LABELS[code] ?? code }))];

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
