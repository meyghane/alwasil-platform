'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronUp, Archive } from 'lucide-react';

const V = '#7652CA';

type Soumission = {
 id: string;
 categorie: string;
 destinationTab: string;
 status: string;
 soumis_le: string;
 soumis_par?: string;
 name?: string;
 titre?: string;
 ville?: string;
 description?: string;
 [key: string]: string | undefined;
};

const STATUS_CONFIG = {
 'à vérifier': { color: '#f59e0b', bg: '#fffbeb', label: 'À vérifier', dot: '' },
 'en ligne': { color: '#16a34a', bg: '#f0fdf4', label: 'En ligne', dot: '' },
 'pas en ligne':{ color: '#6b7280', bg: '#f9fafb', label: 'Rejeté', dot: '' },
 'archivé': { color: '#64748b', bg: '#f8fafc', label: 'Archivé', dot: '' },
};

export default function SoumissionsClient() {
 const [items, setItems] = useState<Soumission[]>([]);
 const [loading, setLoading] = useState(true);
 const [filter, setFilter] = useState<'all' | 'à vérifier' | 'en ligne' | 'pas en ligne' | 'archivé'>('à vérifier');
 const [expanded, setExpanded] = useState<string | null>(null);
 const [actionLoading, setActionLoading] = useState<string | null>(null);
 const [editing, setEditing] = useState<string | null>(null);
 const [editValues, setEditValues] = useState<Record<string, string>>({});
 const [category, setCategory] = useState('all');
 const [search, setSearch] = useState('');

 async function load() {
 setLoading(true);
 try {
 const res = await fetch('/api/admin/soumissions');
 const json = await res.json();
 const submissions = (json.soumissions || []) as Soumission[];
 setItems(submissions);
 const linkedId = new URLSearchParams(window.location.search).get('item');
 if (linkedId && submissions.some(item => item.id === linkedId)) setExpanded(linkedId);
 } catch {
 setItems([]);
 } finally {
 setLoading(false);
 }
 }

 function startEdit(item: Soumission) {
   const title = item.name || item.titre || '';
   const text = `${title} ${item.description || ''}`;
   const departure = item.depart || text.match(/départ(?:\s+depuis)?\s+([^,.;]+)/i)?.[1]?.trim() || '';
   const isHajj = item.categorie === 'hajj' || /\b(omra|hajj|hadj)\b/i.test(text);
   setEditing(item.id);
   setExpanded(item.id);
   setEditValues({ title, description: item.description || '',
     city: item.ville || '', department: item.departement || '', sourceUrl: item.url_source || '',
     date: item.date_evenement || '', organizer: item.organisateur || '', timeStart: item.heure || '',
     location: item.lieu || departure || item.ville || '', address: item.adresse || '',
     departure: departure || item.ville || '', price: item.prix || '', priceDouble: item.prix_double || '',
     priceTriple: item.prix_triple || '', priceQuad: item.prix_quad || '', priceSingle: item.prix_single || '',
     duration: item.duree || '', airline: item.compagnie || '', hotelMakkah: item.hotel_makkah || '',
     hotelMadinah: item.hotel_madinah || '', distanceHaram: item.distance_haram || '',
     distanceNabawi: item.distance_nabawi || '', places: item.places || '', placesRemaining: item.places_restantes || '',
     promo: item.promotion || '', includes: item.inclusions || '', excludes: item.exclusions || '',
     requiredDocuments: item.documents_requis || '', isHajj: isHajj ? 'true' : 'false' });
 }

 async function saveEdit(id: string) {
   if (!window.confirm('Confirmer cette modification ? La fiche sera mise à jour sur le site.')) return;
   setActionLoading(id);
   try {
     const res = await fetch('/api/admin/soumissions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ id, edits: { ...editValues, verifiedDetails: true } }) });
     const result = await res.json();
     if (!res.ok) { alert(result.error || 'Correction impossible.'); return; }
     setEditing(null);
     await load();
     if (result.needsMoreDetails) alert('Fiche enregistrée, mais les informations nécessaires à la publication sont encore incomplètes.');
   } finally { setActionLoading(null); }
 }

 useEffect(() => { load(); }, []);

 async function updateStatus(item: Soumission, status: 'en ligne' | 'pas en ligne' | 'archivé') {
 if (status === 'archivé' && !window.confirm('Confirmer l’archivage ? La fiche ne sera plus visible sur le site.')) return;
 if (status === 'en ligne' && item.status === 'archivé' && !window.confirm('Confirmer la remise en ligne ? Cette fiche redeviendra visible sur le site.')) return;
 const verifiedCampaign = item.requires_campaign_check === 'oui' && status === 'en ligne';
 if (verifiedCampaign && !window.confirm('As-tu vérifié sur la page source que la collecte est active, que l’organisateur est fiable et que la destination des dons est exacte ? Confirmer publiera cette cagnotte.')) return;
 const id = item.id;
 setActionLoading(id);
 try {
 const res = await fetch('/api/admin/soumissions', {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id, status, verifiedCampaign }),
 });
 if (!res.ok) { const data = await res.json(); alert(data.error || 'Impossible de modifier cette fiche.'); return; }
 await load();
 } finally {
 setActionLoading(null);
 }
 }

 const categories = Array.from(new Set(items.map(item => item.categorie).filter(Boolean))).sort();
 const normalizedSearch = search.trim().toLocaleLowerCase('fr-FR');
 const filtered = items.filter(item => {
   if (filter !== 'all' && item.status !== filter) return false;
   if (category !== 'all' && item.categorie !== category) return false;
   if (!normalizedSearch) return true;
   return Object.values(item).some(value => typeof value === 'string' && value.toLocaleLowerCase('fr-FR').includes(normalizedSearch));
 });
 const pending = items.filter(i => i.status === 'à vérifier').length;

 return (
 <div>
 {/* Filtres */}
 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
 {(['à vérifier', 'en ligne', 'archivé', 'pas en ligne', 'all'] as const).map(f => {
 const isActive = filter === f;
 const count = f === 'all' ? items.length : items.filter(i => i.status === f).length;
 return (
 <button key={f} onClick={() => setFilter(f)}
 style={{
 padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
 border: isActive ? `2px solid ${V}` : '1.5px solid #f0ebfa',
 backgroundColor: isActive ? V : 'white',
 color: isActive ? 'white' : '#6b7280',
 display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
 }}>
 {f === 'all' ? 'Tout' : f === 'à vérifier' ? 'À vérifier' : f === 'en ligne' ? 'En ligne' : f === 'archivé' ? 'Archivées' : 'Rejeté'}
 <span style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#f0ebfa', color: isActive ? 'white' : V, borderRadius: '20px', padding: '0 6px', fontSize: '0.72rem', fontWeight: 800 }}>{count}</span>
 </button>
 );
 })}

 <select value={category} onChange={event => setCategory(event.target.value)} aria-label="Filtrer par catégorie" style={{ padding: '0.4rem 0.75rem', borderRadius: 20, border: '1.5px solid #f0ebfa', background: 'white', color: '#6b7280', fontWeight: 600, fontSize: '0.8rem' }}>
 <option value="all">Toutes les catégories</option>
 {categories.map(value => <option key={value} value={value}>{value}</option>)}
 </select>

 <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Rechercher une fiche, une ville, un mot-clé..." aria-label="Rechercher dans toutes les fiches" style={{ minWidth: 250, flex: '1 1 280px', padding: '0.45rem 0.75rem', borderRadius: 20, border: '1.5px solid #f0ebfa', background: 'white', color: '#080808', fontSize: '0.8rem' }} />

 <button onClick={load} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.875rem', borderRadius: '8px', border: '1px solid #f0ebfa', backgroundColor: 'white', color: '#6b7280', fontSize: '0.78rem', cursor: 'pointer' }}>
 <RefreshCw size={12} /> Rafraîchir
 </button>
 </div>

 {loading ? (
 <div style={{ textAlign: 'center', padding: '3rem', color: '#a8a29e' }}>
 <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem', display: 'block' }} />
 Chargement...
 </div>
 ) : filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '3rem', color: '#a8a29e' }}>
 <CheckCircle size={32} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.3 }} />
 <p style={{ fontWeight: 600 }}>Aucune soumission {filter !== 'all' ? `"${filter}"` : ''}</p>
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
 {filtered.map(item => {
 const sc = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG['à vérifier'];
 const isExpanded = expanded === item.id;
 const isLoading = actionLoading === item.id;
 const nom = item.name || item.titre || item.nom || '(Sans titre)';

 return (
 <div key={item.id} style={{
 backgroundColor: 'white', borderRadius: '12px',
 border: `1px solid ${item.status === 'à vérifier' ? '#fde68a' : '#f0ebfa'}`,
 overflow: 'hidden',
 boxShadow: item.status === 'à vérifier' ? '0 2px 8px rgba(245,158,11,0.08)' : '0 1px 4px rgba(109,40,217,0.05)',
 }}>
 {/* Row principal */}
 <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
 {/* Status dot */}
 <div style={{
 width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
 backgroundColor: sc.color,
 }} />

 {/* Infos */}
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
 <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#080808' }}>{nom}</span>
 <span style={{ backgroundColor: '#f0ebfa', color: V, padding: '1px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700 }}>
 {item.categorie}
 </span>
 </div>
 <div style={{ fontSize: '0.72rem', color: '#a8a29e', marginTop: '2px' }}>
 {item.ville && <span>{item.ville} · </span>}
 {item.soumis_le && <span>{new Date(item.soumis_le).toLocaleDateString('fr-FR')} à {new Date(item.soumis_le).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>}
 </div>
 {item.requires_campaign_check === 'oui' && item.status === 'à vérifier' && <div style={{ color: '#9a3412', fontSize: '0.72rem', marginTop: 6 }}>Cagnotte : vérifier la collecte, l’organisateur et la destination avant publication. {item.url_source?.startsWith('https://') && <a href={item.url_source} target="_blank" rel="noopener noreferrer" style={{ color: '#7652CA' }}>Ouvrir la source</a>}</div>}
 </div>

 {/* Actions */}
 <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
 {item.status === 'à vérifier' && (
 <>
 <button
 onClick={() => updateStatus(item, 'en ligne')}
 disabled={isLoading}
 style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.875rem', backgroundColor: '#7652CA', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', opacity: isLoading ? 0.6 : 1 }}>
 <CheckCircle size={13} /> Valider
 </button>
 <button
 onClick={() => updateStatus(item, 'pas en ligne')}
 disabled={isLoading}
 style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.875rem', backgroundColor: '#f0ebfa', color: '#6b7280', border: '1px solid #f0ebfa', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', opacity: isLoading ? 0.6 : 1 }}>
 <XCircle size={13} /> Rejeter
 </button>
 {item.source_system === 'neon' && <button onClick={() => startEdit(item)} disabled={isLoading}
 style={{ padding: '0.45rem 0.875rem', borderRadius: 8, border: '1px solid #7652CA', background: 'white', color: '#7652CA', fontWeight: 700, cursor: 'pointer' }}>Modifier</button>}
 </>
 )}
 {item.status === 'en ligne' && (
 <>
 <button onClick={() => startEdit(item)} disabled={isLoading} style={{ padding: '0.45rem 0.875rem', borderRadius: 8, border: '1px solid #7652CA', background: 'white', color: '#7652CA', fontWeight: 700, cursor: 'pointer' }}>Modifier</button>
 <button onClick={() => updateStatus(item, 'archivé')} disabled={isLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.875rem', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}><Archive size={13} /> Archiver</button>
 <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
 <CheckCircle size={13} /> En ligne
 </span>
 </>
 )}
 {item.status === 'archivé' && <><button onClick={() => startEdit(item)} disabled={isLoading} style={{ padding: '0.45rem 0.875rem', borderRadius: 8, border: '1px solid #7652CA', background: 'white', color: '#7652CA', fontWeight: 700, cursor: 'pointer' }}>Modifier</button><button onClick={() => updateStatus(item, 'en ligne')} disabled={isLoading} style={{ padding: '0.45rem 0.875rem', borderRadius: 8, border: 0, background: '#16a34a', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Remettre en ligne</button></>}
 <button onClick={() => setExpanded(isExpanded ? null : item.id)}
 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8a29e', padding: '0.25rem' }}>
 {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
 </button>
 </div>
 </div>

 {/* Détails dépliables */}
 {isExpanded && (
 <div style={{ borderTop: '1px solid #f0ebfa', padding: '1rem 1.25rem', backgroundColor: '#faf9ff' }}>
 {editing === item.id && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 20 }}>
 {([['title', 'Titre'], ['city', 'Ville / départ'], ['department', 'Département'], ['date', item.categorie === 'hajj' ? 'Date de départ (AAAA-MM-JJ)' : 'Date de l’événement (AAAA-MM-JJ)'], ['timeStart', 'Heure'], ['organizer', 'Organisateur / agence (interne)'], ['location', 'Lieu précis'], ['address', 'Adresse'], ['sourceUrl', 'Lien source HTTPS']] as const).map(([key, label]) => (
   <label key={key} style={{ display: 'grid', gap: 4, fontSize: 12, fontWeight: 700 }}>{label}
     <input value={editValues[key] || ''} onChange={event => setEditValues(previous => ({ ...previous, [key]: event.target.value }))}
       style={{ width: '100%', padding: 9, border: '1px solid #d1c6ea', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
   </label>
 ))}
 <label style={{ gridColumn: '1 / -1', display: 'grid', gap: 4, fontSize: 12, fontWeight: 700 }}>Description
   <textarea value={editValues.description || ''} onChange={event => setEditValues(previous => ({ ...previous, description: event.target.value }))}
     rows={6} style={{ width: '100%', minHeight: 150, resize: 'vertical', padding: 11, border: '1px solid #d1c6ea', borderRadius: 8, fontSize: 14, lineHeight: 1.45, boxSizing: 'border-box' }} />
 </label>
 {(/\b(omra|hajj|hadj)\b/i.test(`${item.name || item.titre || ''} ${item.description || ''}`) || item.categorie === 'hajj') && <div style={{ gridColumn: '1 / -1', display: 'grid', gap: 10, padding: 14, borderRadius: 10, background: '#f5f1ff', border: '1px solid #d9cdf4' }}>
   <strong style={{ color: '#4c1d95' }}>Détails structurés de l’offre Hajj / Omra</strong>
   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
   {([['departure', 'Départ / période'], ['price', 'Prix de base / personne'], ['priceDouble', 'Prix en chambre double'], ['priceTriple', 'Prix en chambre triple'], ['priceQuad', 'Prix en chambre quadruple'], ['priceSingle', 'Prix en chambre single'], ['duration', 'Durée'], ['airline', 'Compagnie aérienne'], ['hotelMakkah', 'Hôtel à La Mecque'], ['hotelMadinah', 'Hôtel à Médine'], ['distanceHaram', 'Distance du Haram'], ['distanceNabawi', 'Distance du Nabawi'], ['places', 'Places totales'], ['placesRemaining', 'Places restantes'], ['promo', 'Promotion / avantage']] as const).map(([key, label]) => <label key={key} style={{ display: 'grid', gap: 4, fontSize: 12, fontWeight: 700 }}>{label}<input value={editValues[key] || ''} onChange={event => setEditValues(previous => ({ ...previous, [key]: event.target.value }))} style={{ width: '100%', padding: 9, border: '1px solid #d1c6ea', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} /></label>)}
   </div>
   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
   {([['includes', 'Inclusions (une par ligne)'], ['excludes', 'Exclusions (une par ligne)'], ['requiredDocuments', 'Documents requis (un par ligne)']] as const).map(([key, label]) => <label key={key} style={{ display: 'grid', gap: 4, fontSize: 12, fontWeight: 700 }}>{label}<textarea value={editValues[key] || ''} onChange={event => setEditValues(previous => ({ ...previous, [key]: event.target.value }))} rows={4} style={{ width: '100%', resize: 'vertical', padding: 9, border: '1px solid #d1c6ea', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} /></label>)}
   </div>
 </div>}
 <div style={{ display: 'flex', alignItems: 'end', gap: 8 }}>
   <button onClick={() => saveEdit(item.id)} disabled={isLoading} style={{ padding: '10px 16px', borderRadius: 8, border: 0, background: '#7652CA', color: 'white', fontWeight: 700 }}>Enregistrer</button>
   <button onClick={() => setEditing(null)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #d1c6ea', background: 'white' }}>Annuler</button>
 </div>
 </div>}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
 {Object.entries(item)
 .filter(([k]) => !['id', 'status', 'soumis_le', 'soumis_par', 'categorie', 'destinationTab', 'sheetTab'].includes(k))
 .filter(([, v]) => v && v !== '')
 .map(([k, v]) => (
 <div key={k} style={{ fontSize: '0.78rem' }}>
 <span style={{ color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em' }}>{k}</span>
 <div style={{ color: '#080808', marginTop: '1px' }}>{v}</div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 );
 })}
 </div>
 )}

 <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
 </div>
 );
}
