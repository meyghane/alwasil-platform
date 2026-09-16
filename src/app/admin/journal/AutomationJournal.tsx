'use client';
import { useEffect, useState } from 'react';
type Entry={id:string;stage:string;code:string;item_id:string|null;created_at:string};
export default function AutomationJournal(){
 const [entries,setEntries]=useState<Entry[]>([]);const [error,setError]=useState('');
 useEffect(()=>{fetch('/api/admin/automation-errors').then(async r=>{if(!r.ok)throw new Error();return r.json();}).then(data=>setEntries(data.errors??[])).catch(()=>setError('Journal indisponible.'));},[]);
 if(error)return <p role="alert">{error}</p>;
 return <section style={{background:'#fff',border:'1px solid #ddd',borderRadius:18,overflow:'hidden'}}>{entries.length===0?<p style={{padding:24}}>Aucune erreur enregistrée.</p>:entries.map(entry=><article key={entry.id} style={{display:'grid',gridTemplateColumns:'150px 1fr auto',gap:16,padding:'14px 18px',borderBottom:'1px solid #eee',alignItems:'center'}}><strong>{entry.stage}</strong><span>{entry.code}</span><time style={{fontSize:12,color:'#666'}}>{new Date(entry.created_at).toLocaleString('fr-FR')}</time></article>)}</section>;
}
