import { revalidatePath } from 'next/cache';
import { runAgents } from '@/lib/agents/pipeline';
import { registeredSources, saveAgentRecord, rollbackInvisible, saveAgentReport, claimRun, recordSourceCheck, existingRun, lastDiscoveryCursor } from '@/lib/agents/store';
import { fetchOfficialPage } from '@/lib/agents/security';
import { formatAgentReport } from '@/lib/agents/report';
import { deliverOnce } from '@/lib/delivery-ledger';
import { telegramStore } from '@/lib/telegram-delivery';
import { moderationChatId, sendModerationText } from '@/lib/telegram-moderation';
import { reviewAgentFreshness } from '@/lib/agents/freshness';

export const maxDuration = 60;
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return Response.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const now = new Date();
    // Cron-secret-only manual launch, capped to one per Paris calendar day.
    // This lets an operator run the just-deployed automation after the scheduled
    // daily claim already exists, without deleting or rewriting the old run.
    const manual = new URL(request.url).searchParams.get('manual') === '1';
    const dateParts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
    const date = `${dateParts.find(part => part.type === 'year')?.value}-${dateParts.find(part => part.type === 'month')?.value}-${dateParts.find(part => part.type === 'day')?.value}`;
    const key = `agents:${date}${manual ? ':manual' : ''}`;
    const id = await claimRun(key);
    if (!id) {
      const status = await existingRun(key);
      return Response.json({ ok: status === 'complete', alreadyRun: true, status }, { status: status === 'complete' ? 200 : 409 });
    }
    const cursor = await lastDiscoveryCursor();
    const report = await runAgents({
      sources: registeredSources, fetch: fetchOfficialPage, save: saveAgentRecord, sourceChecked: recordSourceCheck,
      async verifyPublic(itemId) {
        for (const path of ['/', '/education', '/events', '/solidarity', '/librairies', '/piscines', '/lieux-priere', '/api/mosques', `/api/public/items/${itemId}`]) revalidatePath(path);
        const response = await fetch(`https://al-wasil.fr/api/public/items/${itemId}`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
        return response.ok && (await response.json()).id === itemId;
      },
      rollback: rollbackInvisible, finish: saveAgentReport,
    }, now, id, cursor);
    report.actions.push(...await reviewAgentFreshness());
    await saveAgentReport(report);
    const recipient = moderationChatId();
    if (recipient) await deliverOnce(telegramStore(), { key: `report:${recipient}:${id}`, source: 'agent:report', recipient, type: 'daily_report' }, () => sendModerationText(formatAgentReport(report)));
    return Response.json({ ok: !report.errors.length, report });
  } catch { return Response.json({ error: 'Veille indisponible. Vérifier le journal administrateur.' }, { status: 503 }); }
}
