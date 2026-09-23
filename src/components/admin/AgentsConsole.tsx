'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, Archive, RotateCcw, ShieldCheck } from 'lucide-react';
type RecordRow = { id: string; title: string; status: string; updated_at: string; confidence: string; reasons: string[]; automatic: string; source_url: string };
type SourceRow = { id: string; url: string; category: string; departments: string[]; trust: string; evidence: string };
type Data = { records: RecordRow[]; sources: SourceRow[]; runs: Array<{ id: string; status: string; report: Record<string, unknown> }>; deliveries: Array<{ notification_type: string; result: string }> };
const button = { border: '1px solid #ddd', borderRadius: 999, padding: '.6rem 1rem', background: '#ECFF58', color: '#080808', cursor: 'pointer' };
export default function AgentsConsole() {
  const [data,setData] = useState<Data>(); const [error,setError] = useState(''); const [busy,setBusy] = useState(false); const [onlyNew,setOnlyNew] = useState(true);
  async function load() { const response = await fetch('/api/admin/agents'); if (!response.ok) throw new Error('Journal indisponible'); setData(await response.json()); }
  useEffect(() => { load().catch(() => setError('Impossible de charger le journal.')); }, []);
  async function act(body: Record<string,unknown>) {
    setBusy(true); setError('');
    try { const response = await fetch('/api/admin/agents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Action échouée'); } finally { setBusy(false); }
  }
  return <main style={{ padding: 'clamp(1rem,3vw,2rem)', color: '#080808', background: '#fff' }}>
    <h1>Agents et modération corrective</h1>
    <p>Sources autorisées, décisions explicables et retour arrière pendant sept jours. Les catégories sensibles restent à valider.</p>
    {error && <p role="alert" style={{ color: '#a02020' }}>{error}</p>}
    <label><input type="checkbox" checked={onlyNew} onChange={e => setOnlyNew(e.target.checked)} /> Publications automatiques des sept derniers jours</label>
    <section aria-label="Fiches des agents" style={{ display: 'grid', gap: 16, marginTop: 20 }}>
      {data?.records.filter(row => !onlyNew || row.automatic === 'true' && Date.now()-Date.parse(row.updated_at)<7*86400000).map(row => <article key={row.id} style={{ border: '1px solid #ddd', borderRadius: 18, padding: 18 }}>
        <h2 style={{ fontSize: 20 }}>{row.title}</h2><p>{row.status} · confiance {row.confidence}</p><p>{row.reasons?.join(' · ')}</p>
        <a href={row.source_url} rel="noreferrer" target="_blank">Voir la source</a> · <Link href={`/admin/soumissions?item=${row.id}`}>Corriger les champs et voir la fiche</Link>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {([['archive','Archiver',Archive],['restore','Restaurer',RefreshCw],['rollback','Annuler',RotateCcw],['reverify','Revérifier',ShieldCheck]] as const).map(([action,label,Icon]) => <button key={action} style={button} disabled={busy} onClick={() => act({ action,id:row.id,updatedAt:new Date(row.updated_at).toISOString() })}><Icon size={14} /> {label}</button>)}
        </div>
        <form onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); act({ action:'merge',id:row.id,updatedAt:new Date(row.updated_at).toISOString(),otherId:form.get('otherId') }); }} style={{ marginTop: 12 }}>
          <label>Identifiant du doublon à fusionner <input name="otherId" required /></label> <button style={button} disabled={busy}>Fusionner</button>
        </form>
      </article>)}
      {data && !data.records.length && <p>Aucune fiche issue des agents pour le moment.</p>}
    </section>
    <h2>Sources</h2>
    <form onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); act({ action:'source',url:form.get('url'),category:form.get('category'),departments:String(form.get('departments')).split(',').map(x=>x.trim()),evidence:form.get('evidence'),trust:'pending' }); }} style={{ display:'flex',flexWrap:'wrap',gap:12 }}>
      <label>URL officielle <input type="url" name="url" required /></label>
      <label>Catégorie <select name="category">{['mosquee','institut','evenement','association','librairie','piscine'].map(category=><option key={category}>{category}</option>)}</select></label>
      <label>Départements séparés par virgules <input name="departments" required /></label>
      <label>Preuve de fiabilité <input name="evidence" required minLength={30} /></label>
      <button style={button} disabled={busy}>Enregistrer en attente</button>
    </form>
    {data?.sources.map(source=><div key={source.id} style={{ padding:12,borderBottom:'1px solid #ddd',overflowWrap:'anywhere' }}><p>{source.url} · {source.category} · {source.trust}</p><p>{source.evidence}</p><button style={button} disabled={busy} onClick={()=>act({ ...source,action:'source',trust:'trusted' })}>Autoriser cette source officielle</button> <button style={button} disabled={busy} onClick={()=>act({ ...source,action:'source',trust:'blocked' })}>Source problématique</button></div>)}
    <h2>Rapports et erreurs</h2>
    {data?.runs.map(run=><details key={run.id}><summary>Exécution {run.status}</summary><pre style={{ whiteSpace:'pre-wrap',overflowWrap:'anywhere' }}>{JSON.stringify(run.report,null,2)}</pre></details>)}
    {data?.deliveries.map((delivery,index)=><p key={index}>Telegram : {delivery.notification_type} · {delivery.result}. Vérifier la livraison avant toute relance.</p>)}
  </main>;
}
