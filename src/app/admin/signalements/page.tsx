'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Archive, RefreshCw, Flag } from 'lucide-react';

type Report = { id: string; page?: string; element?: string; message?: string; email?: string; status: string; createdAt: string };

export default function SignalementsPage() {
 const [reports, setReports] = useState<Report[]>([]);
 const [loading, setLoading] = useState(true);
 async function load() { setLoading(true); try { const r = await fetch('/api/admin/reports'); const d = await r.json(); setReports(d.reports || []); } finally { setLoading(false); } }
 async function update(id: string, status: 'resolved' | 'archived') { await fetch('/api/admin/reports', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) }); load(); }
 useEffect(() => { load(); }, []);
 return <main style={{ minHeight: '100vh', background: '#faf9f2', padding: '1rem' }}>
  <div style={{ maxWidth: 900, margin: '0 auto' }}>
   <Link href="/admin" style={{ color: '#8a6723', textDecoration: 'none', display: 'inline-flex', gap: '.35rem', alignItems: 'center', fontSize: '.85rem' }}><ArrowLeft size={14} /> Dashboard</Link>
   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', margin: '2rem 0 1.25rem' }}><div><h1 style={{ margin: 0, fontSize: '1.6rem' }}>Signalements visiteurs</h1><p style={{ color: '#78716c', margin: '.35rem 0 0' }}>Les corrections remontées depuis les pages publiques.</p></div><button onClick={load} style={{ padding: '.55rem .8rem', border: '1px solid #ead9a8', borderRadius: 8, background: 'white', cursor: 'pointer' }}><RefreshCw size={15} /></button></div>
   {loading ? <p>Chargement…</p> : reports.filter(r => r.status === 'open').length === 0 ? <div style={{ background: 'white', border: '1px solid #ead9a8', borderRadius: 12, padding: '2rem', textAlign: 'center', color: '#78716c' }}><CheckCircle size={28} color="#c9973a" /><p>Aucun signalement en attente.</p></div> : <div style={{ display: 'grid', gap: '.75rem' }}>{reports.filter(r => r.status === 'open').map(r => <article key={r.id} style={{ background: 'white', border: '1px solid #ead9a8', borderRadius: 12, padding: '1rem' }}><div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}><Flag size={17} color="#c9973a" /><strong>{r.element || 'Élément non précisé'}</strong></div><div style={{ color: '#78716c', fontSize: '.82rem', margin: '.45rem 0' }}>{r.page || 'Page inconnue'} · {new Date(r.createdAt).toLocaleDateString('fr-FR')}</div>{r.message && <p style={{ margin: '.5rem 0', lineHeight: 1.5 }}>{r.message}</p>}<div style={{ display: 'flex', gap: '.5rem', marginTop: '.75rem' }}><button onClick={() => update(r.id, 'resolved')} style={{ background: '#c9973a', color: 'white', border: 0, borderRadius: 7, padding: '.45rem .7rem', cursor: 'pointer' }}><CheckCircle size={13} /> Traité</button><button onClick={() => update(r.id, 'archived')} style={{ background: '#f5f5f4', color: '#57534e', border: 0, borderRadius: 7, padding: '.45rem .7rem', cursor: 'pointer' }}><Archive size={13} /> Archiver</button></div></article>)}</div>}
  </div>
 </main>;
}
