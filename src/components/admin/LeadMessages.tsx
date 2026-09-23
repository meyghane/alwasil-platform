'use client';
import { useEffect, useState } from 'react';
import { Send, RefreshCw } from 'lucide-react';
type Entry={recipient_type:string;result:string;error_code:string|null;created_at:string};
export default function LeadMessages({id,partnerAllowed,active}:{id:string;partnerAllowed:boolean;active:boolean}) {
  const [recipient,setRecipient]=useState('client'),[message,setMessage]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[entries,setEntries]=useState<Entry[]>([]);
  async function load() { const response=await fetch(`/api/admin/leads/messages?id=${encodeURIComponent(id)}`); if(response.ok)setEntries((await response.json()).messages); }
  useEffect(()=>{setMessage('');setNotice('');setRecipient('client');setEntries([]);load();},[id]);
  async function send() {
    setBusy(true);setNotice('');
    try { const response=await fetch('/api/admin/leads/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,recipient,message}),signal:AbortSignal.timeout(15000)}); const result=await response.json(); setNotice(result.notice||result.error||'Réponse inconnue'); if(response.ok)setMessage(''); await load(); }
    catch {setNotice('Réponse incertaine. Vérifier le journal avant de réessayer.');} finally {setBusy(false);}
  }
  return <section aria-label="Messages et livraisons" style={{marginTop:20}}><h3>Messages et relances</h3>
    <label>Destinataire <select value={recipient} onChange={event=>setRecipient(event.target.value)}><option value="client">Client</option><option value="partner" disabled={!partnerAllowed}>Agence vérifiée</option></select></label>
    <label style={{display:'block',marginTop:10}}>Message<textarea value={message} onChange={event=>setMessage(event.target.value)} maxLength={4000} rows={6} style={{display:'block',width:'100%',boxSizing:'border-box',border:'1px solid #ddd',borderRadius:12,padding:12}} /></label>
    <button disabled={busy||!active||message.trim().length<10||(recipient==='partner'&&!partnerAllowed)} onClick={send} style={{border:0,borderRadius:999,padding:'10px 16px',background:'#ECFF58',color:'#080808'}}><Send size={14}/> Envoyer le message ou la relance</button>
    <button onClick={load} aria-label="Actualiser le journal" style={{marginLeft:10,border:0,background:'white'}}><RefreshCw size={16}/></button>
    {!active&&<p>Ticket archivé ou consentement absent : envoi désactivé.</p>}{notice&&<p role="status">{notice}</p>}
    <p style={{fontSize:12}}>« Accepté » signifie accepté par Resend, pas livré au destinataire. Les messages identiques du jour ne sont pas renvoyés.</p>
    {entries.map((entry,index)=><p key={index} style={{fontSize:12}}>{new Date(entry.created_at).toLocaleString('fr-FR')} · {entry.recipient_type} · {entry.result}{entry.error_code?` · ${entry.error_code}`:''}</p>)}
  </section>;
}
