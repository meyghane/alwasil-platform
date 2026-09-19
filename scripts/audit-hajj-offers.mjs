import { db } from '../src/db/index.ts';
import { items } from '../src/db/schema.ts';
import { eq } from 'drizzle-orm';
import { assessHajjOfferReadiness } from '../src/lib/hajj-offer-quality.ts';

const archive = process.argv.includes('--archive');
const rows = await db.select().from(items).where(eq(items.category, 'hajj'));
const report = rows.map((item) => {
  const raw = (item.metadata?.raw || {}) as Record<string, unknown>;
  const readiness = assessHajjOfferReadiness(raw);
  return { id: item.id, title: item.title, status: item.status, sourceUrl: item.sourceUrl, eligible: readiness.eligible, missing: readiness.missing };
});
const incomplete = report.filter((item) => !item.eligible);
if (archive) {
  for (const item of incomplete.filter((candidate) => candidate.status === 'approved')) {
    await db.update(items).set({ status: 'expired', updatedAt: new Date(), metadata: { ...(rows.find((row) => row.id === item.id)?.metadata || {}), requiresEnrichment: true, audit: { action: 'archived_incomplete_hajj_offer', at: new Date().toISOString(), missing: item.missing } } }).where(eq(items.id, item.id));
  }
}
console.log(JSON.stringify({ total: report.length, eligible: report.filter((item) => item.eligible).length, incomplete: incomplete.length, archived: archive ? incomplete.filter((item) => item.status === 'approved').length : 0, offers: report }, null, 2));
