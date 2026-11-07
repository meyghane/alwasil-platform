'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, ListFilter, Search } from 'lucide-react';

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
 const [open, setOpen] = useState(false);
 const [query, setQuery] = useState('');
 const rootRef = useRef<HTMLDivElement>(null);
 const buttonRef = useRef<HTMLButtonElement>(null);
 const searchRef = useRef<HTMLInputElement>(null);
 const panelId = useId();

 useEffect(() => {
  if (!open) return;
  searchRef.current?.focus();
  const closeOutside = (event: PointerEvent) => {
   if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
  };
  const closeEscape = (event: KeyboardEvent) => {
   if (event.key !== 'Escape') return;
   setOpen(false);
   buttonRef.current?.focus();
  };
  document.addEventListener('pointerdown', closeOutside);
  document.addEventListener('keydown', closeEscape);
  return () => {
   document.removeEventListener('pointerdown', closeOutside);
   document.removeEventListener('keydown', closeEscape);
  };
 }, [open]);

 const codes = counts ? Object.keys(counts).filter(code => code !== 'Tout' && (counts[code] ?? 0) > 0).sort((a, b) => a.localeCompare(b, 'fr', { numeric: true })) : Object.keys(DEPARTMENT_LABELS);
 const visible = [{ code: 'Tout', label: 'Tout' }, ...codes.map(code => ({ code, label: DEPARTMENT_LABELS[code] ?? code }))];
 const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr-FR');
 const search = normalize(query.trim());
 const filtered = search ? visible.filter(dept => normalize(dept.label).includes(search) || normalize(dept.code).includes(search)) : visible;
 const currentLabel = current === 'Tout' ? 'Tous les départements' : DEPARTMENT_LABELS[current] ?? current;
 const total = counts ? Object.entries(counts).filter(([code]) => code !== 'Tout').reduce((sum, [, count]) => sum + count, 0) : null;

 return (
 <div ref={rootRef} style={{ position: 'relative', width: '100%', maxWidth: '24rem' }}>
  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label ?? 'Département'}</p>
  <button ref={buttonRef} type="button" aria-expanded={open} aria-controls={panelId}
   onClick={() => { setQuery(''); setOpen(wasOpen => !wasOpen); }}
   style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', width: '100%', minHeight: 46, padding: '0.6rem 0.9rem', borderRadius: 14, border: `1.5px solid ${open || current !== 'Tout' ? 'var(--primary-color)' : 'var(--border-color)'}`, background: '#fff', color: '#080808', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 650, textAlign: 'left' }}>
   <ListFilter size={18} aria-hidden="true" style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
   <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentLabel}</span>
   {current !== 'Tout' && counts && <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{counts[current] ?? 0}</span>}
   <ChevronDown size={18} aria-hidden="true" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
  </button>
  {open && <div id={panelId} style={{ position: 'absolute', top: 'calc(100% + 0.4rem)', left: 0, zIndex: 30, width: '100%', background: '#fff', border: '1px solid var(--border-color)', borderRadius: 16, boxShadow: '0 10px 24px rgba(8,8,8,0.12)', padding: '0.65rem' }}>
   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.65rem', border: '1px solid var(--border-color)', borderRadius: 10 }}>
    <Search size={17} aria-hidden="true" style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
    <input ref={searchRef} type="search" aria-label="Rechercher un département" placeholder="Nom ou numéro de département" value={query} onChange={event => setQuery(event.target.value)} style={{ width: '100%', minWidth: 0, border: 0, background: 'transparent', color: '#080808', fontSize: '0.86rem' }} />
   </div>
   <div style={{ maxHeight: 260, overflowY: 'auto', overscrollBehavior: 'contain', marginTop: '0.5rem' }}>
    {filtered.map(dept => {
     const isActive = current === dept.code;
     const count = counts ? (dept.code === 'Tout' ? total : (counts[dept.code] ?? 0)) : null;
     return <button key={dept.code} type="button" aria-pressed={isActive}
      onClick={() => { onChange(dept.code); setOpen(false); setQuery(''); buttonRef.current?.focus(); }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', width: '100%', padding: '0.55rem 0.65rem', borderRadius: 10, border: 0, backgroundColor: isActive ? 'var(--primary-color)' : 'white', color: isActive ? 'white' : '#080808', fontSize: '0.84rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', textAlign: 'left' }}>
      <span>{dept.label}</span>
      {count !== null && <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isActive ? 'white' : 'var(--text-secondary)' }}>{count}</span>}
     </button>;
    })}
    {filtered.length === 0 && <p style={{ padding: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.84rem' }}>Aucun département trouvé.</p>}
   </div>
  </div>}
 </div>
 );
}
