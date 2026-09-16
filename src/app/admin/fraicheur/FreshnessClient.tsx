'use client';
import {useEffect,useState} from 'react';
type Due={id:string;title:string;category:string;nextReviewAt:string|null;lastVerifiedAt:string|null;metadata?:{quality?:{link:string;invalidPhone:boolean;duplicates:{id:string;reasons?:string[]}[]}}};
export default function FreshnessClient(){
 const [items,setItems]=useState<Due[]>([]);const [error,setError]=useState('');const [loading,setLoading]=useState(true);
 const load=()=>fetch('/api/admin/freshness').then(async r=>{if(!r.ok)throw new Error();return r.json();}).then(j=>setItems(j.due));
 useEffect(()=>{load().catch(()=>setError('Impossible de charger les fiches.')).finally(()=>setLoading(false));},[]);
 async function act(id:string,action:'verify'|'dismiss-duplicates'|'reject'){setError('');const res=await fetch('/api/admin/freshness',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,action})});if(!res.ok){setError('Action impossible.');return;}await load();}
 if(error)return <p role="alert">{error}</p>;if(loading)return <p>Chargement…</p>;
 const button:React.CSSProperties={border:'1px solid #080808',borderRadius:999,padding:'9px 14px',background:'#fff',color:'#080808',fontWeight:700,cursor:'pointer'};
 return <section style={{padding:'1rem',background:'white'}}><h2>À vérifier ({items.length}, maximum 500)</h2>{items.length===0?<p>Aucune fiche en attente.</p>:items.map(item=><article key={item.id} style={{padding:'1.25rem 0',borderBottom:'1px solid #ddd'}}><strong>{item.title}</strong><p>{item.category} · Dernière vérification : {item.lastVerifiedAt?new Date(item.lastVerifiedAt).toLocaleDateString('fr-FR'):'non établie'}</p>{item.metadata?.quality&&<p>Lien : {item.metadata.quality.link} · Téléphone : {item.metadata.quality.invalidPhone?'format à corriger':'aucune anomalie détectée'} · Doublons possibles : {item.metadata.quality.duplicates.length}</p>}<div style={{display:'flex',gap:8,flexWrap:'wrap'}}><button style={{...button,background:'#ECFF58'}} onClick={()=>act(item.id,'verify')}>Fiche vérifiée</button>{Boolean(item.metadata?.quality?.duplicates.length)&&<button style={button} onClick={()=>act(item.id,'dismiss-duplicates')}>Ce ne sont pas des doublons</button>}<button style={{...button,borderColor:'#b91c1c',color:'#b91c1c'}} onClick={()=>act(item.id,'reject')}>Rejeter la fiche</button></div></article>)}</section>;
}
