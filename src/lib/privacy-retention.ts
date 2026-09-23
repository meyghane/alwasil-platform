export const RETENTION = { leadsDays: 365, submissionDays: 90 } as const;
export function retentionCutoffs(now = new Date()) {
  return { leads: new Date(now.getTime() - RETENTION.leadsDays * 86400000), submissions: new Date(now.getTime() - RETENTION.submissionDays * 86400000) };
}
export function retentionApproved(env: Record<string,string|undefined>) { return env.PERSONAL_DATA_RETENTION_ENABLED === 'true'; }
