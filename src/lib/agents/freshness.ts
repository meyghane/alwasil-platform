import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';
import { fetchOfficialPage } from './security';
import { freshnessProposal } from './pipeline';
import type { RecordData } from './contracts';

/** One due source per run; failed HTTP checks never imply a permanent closure. */
export async function reviewAgentFreshness(): Promise<string[]> {
  const sql=neon(process.env.DATABASE_URL!);
  const rows=await sql`SELECT id,metadata FROM items WHERE metadata ? 'agentRecord' AND status='approved' AND next_review_at<=now() ORDER BY next_review_at LIMIT 1`;
  const actions:string[]=[];
  for (const row of rows) {
    const record=row.metadata.agentRecord as RecordData;
    let reachable=false; let changed=false;
    try { const html=await fetchOfficialPage(record.provenance.url); reachable=true; changed=createHash('sha256').update(html).digest('hex')!==record.provenance.contentHash; } catch { /* A proposal records the uncertainty. */ }
    const proposal=changed?{action:'reverify',reason:'source modifiée : comparer les champs, horaires et contacts'}:freshnessProposal(record,reachable);
    await sql`UPDATE items SET metadata=metadata || jsonb_build_object('freshnessProposal',${JSON.stringify({...proposal,checkedAt:new Date().toISOString()})}::jsonb),next_review_at=now()+interval '7 days' WHERE id=${row.id}::uuid`;
    if (proposal.action!=='none') actions.push(`${record.title} : ${proposal.reason}`);
  }
  return actions;
}
