import { AUTO_CATEGORIES, type RecordData, type Source, type Assessment } from './contracts';
const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const phone = (value: string) => value.replace(/\D/g, '').replace(/^0033/, '33').replace(/^0/, '33');

export function assessRecord(record: RecordData, source: Source, duplicate = false, now = new Date()): Assessment {
  const blocked: string[] = [];
  if (!source.enabled || source.trust === 'blocked') blocked.push('source désactivée ou problématique');
  if (!record.provenance.url || record.provenance.sourceId !== source.id || !record.provenance.contentHash) blocked.push('provenance absente');
  try { if (new URL(record.provenance.url).origin !== new URL(source.url).origin) blocked.push('source contradictoire'); } catch { blocked.push('URL invalide'); }
  if (/<script|javascript:|-----BEGIN .*PRIVATE KEY|\b(?:api[_-]?key|password|mot de passe)\s*[:=]/i.test(JSON.stringify(record))) blocked.push('contenu malveillant ou privé');
  if (blocked.length) return { decision: 'blocked', confidence: 'low', reasons: blocked };
  const missing = [!record.title && 'titre', !record.description || record.description.length < 80 ? 'description utile' : '', !record.city && 'ville', !record.department && 'département', !record.address && 'adresse ou lieu', !source.official && 'source non officielle', source.trust !== 'trusted' && 'source non validée', !source.evidence && 'preuve de fiabilité absente', duplicate && 'doublon probable'];
  if (record.phone && !/^(?:33\d{9}|\d{8,15})$/.test(phone(record.phone))) missing.push('téléphone invalide');
  if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) missing.push('email invalide');
  const checked = Date.parse(record.provenance.fetchedAt);
  if (!Number.isFinite(checked) || checked > now.getTime() || now.getTime() - checked > 86400000) missing.push('source à revérifier');
  if (record.category === 'institut' && (!record.courses.length || !record.audience.length || !record.format.length || !record.hours.length || (!record.phone && !record.email))) missing.push('cours, public, modalités ou contact manquants');
  if (record.category === 'evenement' && (!record.date || record.date < now.toISOString().slice(0, 10) || !record.organizer)) missing.push('date ou organisateur manquant / événement passé');
  if (record.category === 'piscine') missing.push('adaptateur requis : type de piscine et politique de tenue à vérifier');
  if (!(AUTO_CATEGORIES as readonly string[]).includes(record.category)) missing.push('validation humaine de cette catégorie');
  const reasons = missing.filter((value): value is string => typeof value === 'string' && !!value);
  return reasons.length ? { decision: 'deferred', confidence: 'medium', reasons } : { decision: 'automatic', confidence: 'high', reasons: ['source officielle autorisée', 'données structurées complètes', 'aucun conflit détecté'] };
}

export function duplicateEvidence(a: RecordData, b: RecordData): string[] {
  if (a.category !== b.category) return [];
  if (a.category === 'evenement' && a.date !== b.date) return [];
  const reasons: string[] = [];
  if (normalize(a.title) === normalize(b.title) && normalize(a.city) === normalize(b.city)) reasons.push('nom et ville');
  if (a.phone && b.phone && phone(a.phone) === phone(b.phone)) reasons.push('téléphone');
  if (a.email && b.email && a.email.toLowerCase() === b.email.toLowerCase()) reasons.push('email');
  if (a.address && b.address && normalize(a.address) === normalize(b.address) && normalize(a.title) === normalize(b.title)) reasons.push('adresse et nom');
  if (a.website && a.website === b.website && normalize(a.title) === normalize(b.title)) reasons.push('URL et nom');
  if (a.historicalIds?.some(id => b.historicalIds?.includes(id))) reasons.push('identifiant historique');
  if (a.latitude !== undefined && b.latitude !== undefined && a.longitude !== undefined && b.longitude !== undefined && Math.abs(a.latitude-b.latitude)<0.0001 && Math.abs(a.longitude-b.longitude)<0.0001 && normalize(a.title) === normalize(b.title)) reasons.push('coordonnées et nom');
  return reasons;
}

export function mergeComplementary(primary: RecordData, incoming: RecordData) {
  const merged = { ...primary }; const conflicts: string[] = [];
  for (const key of ['address','phone','email','website','city','department','description'] as const) {
    if (!primary[key]) merged[key] = incoming[key];
    else if (incoming[key] && normalize(primary[key]) !== normalize(incoming[key])) conflicts.push(key);
  }
  for (const key of ['courses','hours','audience','format','tags'] as const) merged[key] = [...new Set([...primary[key], ...incoming[key]])];
  return { merged, conflicts };
}

export function correctiveState(action: string, current: string, eligible: boolean, snapshotStatus?: string) {
  if (action === 'archive') return 'expired';
  if (action === 'reverify') return 'pending';
  if (action === 'restore') return eligible ? 'approved' : 'pending';
  if (action === 'rollback' && snapshotStatus) return snapshotStatus === 'approved' && !eligible ? 'pending' : snapshotStatus;
  throw new Error('Action ou instantané invalide');
}
