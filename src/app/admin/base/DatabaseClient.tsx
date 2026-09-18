'use client';

import { useEffect, useState } from 'react';

type Item = { id: string; title: string; category: string; status: string; city?: string | null; description?: string | null; sourceUrl?: string | null; source?: string; updatedAt: string };
type Log = { id: string; itemId: string; action: string; actor: string; actedAt: string };

export default function DatabaseClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [history, setHistory] = useState<Log[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  async function load() { setLoading(true); const params = new URLSearchParams({ q }); if (status) params.set('status', status); const res = await fetch(`/api/admin/database?${params}`); const data = await res.json(); setItems(data.items ?? []); setHistory(data.history ?? []); setLoading(false); }
  useEffect(() => { load(); }, []);
  async function action(id: string, actionName: 'archive' | 'delete' | 'restore' | 'reverify') {
    if (actionName === 'delete' && !window.confirm('Supprimer définitivement cette fiche ?')) return;
    await fetch('/api/admin/database', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: actionName }) });
    await load();
  }
  async function edit(item: Item) {
    const title = window.prompt('Titre', item.title); if (title === null) return;
    const city = window.prompt('Ville', item.city || '') ?? '';
    const description = window.prompt('Description', item.description || '') ?? '';
    const sourceUrl = window.prompt('Lien source HTTPS', item.sourceUrl || '') ?? '';
    await fetch('/api/admin/database', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, action: 'edit', edits: { title, city, description, sourceUrl } }) });
    await load();
  }
  return <div>
    <div style={{ display: 'flex', gap: 8, margin: '1.5rem 0', flexWrap: 'wrap' }}><input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') load(); }} placeholder="Rechercher une fiche, une ville..." style={{ flex: 1, minWidth: 240, padding: 12, border: '1px solid #ddd6fe', borderRadius: 8 }} /><select value={status} onChange={e => { setStatus(e.target.value); setTimeout(load, 0); }} style={{ padding: 12, border: '1px solid #ddd6fe', borderRadius: 8 }}><option value="">Tous les statuts</option><option value="approved">En ligne</option><option value="pending">À vérifier</option><option value="rejected">Rejetées</option><option value="expired">Archivées</option></select><button onClick={load} style={{ padding: '0 16px', border: 0, borderRadius: 8, background: '#7652CA', color: 'white', fontWeight: 700 }}>Rechercher</button></div>
    {loading ? <p>Chargement...</p> : <div style={{ display: 'grid', gap: 10 }}>{items.map(item => <article key={item.id} style={{ background: 'white', border: '1px solid #e2d7f5', borderRadius: 10, padding: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}><div style={{ minWidth: 0 }}><strong>{item.title}</strong><div style={{ color: '#6b7280', fontSize: 13 }}>{item.category} | {item.status === 'approved' ? 'En ligne' : item.status === 'expired' ? 'Archivée' : item.status} | {item.city || 'Ville inconnue'}</div>{item.description && <p style={{ color: '#59565f', fontSize: 13, margin: '8px 0 0' }}>{item.description}</p>}{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer" style={{ color: '#7652CA', fontSize: 12 }}>Voir la source</a>}</div><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'flex-start' }}><button onClick={() => edit(item)}>Modifier</button>{item.status === 'expired' ? <><button onClick={() => action(item.id, 'restore')}>Remettre en ligne</button><button onClick={() => action(item.id, 'delete')}>Supprimer</button></> : <><button onClick={() => action(item.id, 'reverify')}>Re vérifier</button><button onClick={() => action(item.id, 'archive')}>Archiver</button></>}</div></div></article>)}</div>}
    <h2 style={{ marginTop: '2rem' }}>Historique récent</h2><div style={{ background: 'white', border: '1px solid #e2d7f5', borderRadius: 10, padding: 14 }}>{history.slice(0, 50).map(log => <div key={log.id} style={{ padding: '8px 0', borderBottom: '1px solid #f1f0f5', fontSize: 13 }}>{log.action} | {log.actor} | {new Date(log.actedAt).toLocaleString('fr-FR')}</div>)}</div>
  </div>;
}
