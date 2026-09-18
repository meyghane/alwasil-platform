'use client';

import { useEffect, useState } from 'react';

type Data = { pages: Array<{ path: string; views: number }>; slots: Array<{ slot: string | null; views: number }>; recent: Array<{ path: string; eventType: string; createdAt: string }> };

export default function AudienceClient() {
 const [data, setData] = useState<Data | null>(null);
 useEffect(() => { fetch('/api/admin/audience').then(response => response.json()).then(setData).catch(() => setData({ pages: [], slots: [], recent: [] })); }, []);
 if (!data) return <p>Chargement des statistiques…</p>;
 return <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}><section style={{ background: 'white', borderRadius: 14, padding: '1.25rem' }}><h2>Pages les plus vues</h2>{data.pages.map(item => <div key={item.path} style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', padding: '.65rem 0' }}><span>{item.path}</span><strong>{Number(item.views)} vues</strong></div>)}{data.pages.length === 0 && <p>Aucune donnée après consentement.</p>}</section><section style={{ background: 'white', borderRadius: 14, padding: '1.25rem' }}><h2>Emplacements publicitaires à privilégier</h2><p style={{ color: '#59565f' }}>Les emplacements seront mesurés dès qu’ils seront intégrés dans les pages.</p>{data.slots.map(item => <div key={item.slot} style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', padding: '.65rem 0' }}><span>{item.slot}</span><strong>{Number(item.views)} vues</strong></div>)}</section></div>;
}
