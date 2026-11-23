import { AUTO_CATEGORIES, type RecordData, type Source, type Assessment } from './contracts';
const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const phone = (value: string) => value.replace(/\D/g, '').replace(/^0033/, '33').replace(/^0/, '33');

export function assessRecord(record: RecordData, source: Source, duplicate = false, now = new Date()): Assessment {
  const blocked: string[] = [];
  if (!source.enabled || source.trust === 'blocked') blocked.push('source désactivée ou problématique');
  if (!record.provenance.url || record.provenance.sourceId !== source.id || !record.provenance.contentHash) blocked.push('provenance absente');
  try { if (new URL(record.provenance.url).origin !== new URL(source.url).origin) blocked.push('source contradictoire'); } catch { blocked.push('URL invalide'); }
  if (!record.relevanceEvidence?.excerpt || record.relevanceEvidence.url !== record.provenance.url || record.relevanceEvidence.excerpt.length < 12) blocked.push('preuve explicite de pertinence musulmane absente');
  if (/<script|javascript:|-----BEGIN .*PRIVATE KEY|\b(?:api[_-]?key|password|mot de passe)\s*[:=]/i.test(JSON.stringify(record))) blocked.push('contenu malveillant ou privé');
  if (blocked.length) return { decision: 'blocked', confidence: 'low', reasons: blocked };
  const remoteMode = /en ligne|online|webinaire|visioconférence|t[eé]l[eé]consultation/i.test(`${record.format.join(' ')} ${record.description}`);
  const onlineEvent = record.category === 'evenement' && remoteMode;
  const remoteHealth = record.category === 'sante' && remoteMode;
  const locationNotRequired = onlineEvent || remoteHealth || (record.category === 'cagnotte' && !!record.campaignDestination) || (record.category === 'justice' && !!record.serviceArea);
  const hajjOffer = record.category === 'hajj' ? record.hajjOffer : undefined;
  const missing = [!record.title && 'titre', !record.description || record.description.length < 80 ? 'description utile' : '', !record.city && !locationNotRequired && 'ville', !record.department && !locationNotRequired && 'département', !record.address && !locationNotRequired && !hajjOffer && 'adresse ou lieu', !source.official && 'source non officielle', source.trust !== 'trusted' && 'source non validée', !source.evidence && 'preuve de fiabilité absente', duplicate && 'doublon probable'];
  if (record.department && source.departments.length && !source.departments.includes(record.department)) missing.push('fiche située hors du territoire recherché');
  if (record.phone && !/^(?:33\d{9}|\d{8,15})$/.test(phone(record.phone))) missing.push('téléphone invalide');
  if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) missing.push('email invalide');
  const checked = Date.parse(record.provenance.fetchedAt);
  if (!Number.isFinite(checked) || checked > now.getTime() || now.getTime() - checked > 86400000) missing.push('source à revérifier');
  if (record.category === 'institut' && (!record.courses.length || !record.audience.length || !record.format.length || !record.hours.length || (!record.phone && !record.email))) missing.push('cours, public, modalités ou contact manquants');
  if (record.category === 'evenement' && (!record.date || record.date < now.toISOString().slice(0, 10) || !record.organizer)) missing.push('date ou organisateur manquant / événement passé');
  if (record.category === 'piscine') {
    const policyEvidence = `${record.relevanceEvidence?.excerpt || ''} ${record.description}`;
    if (!record.poolType) missing.push('type de piscine non établi par la source');
    if (!/burkini|maillot.*(couvrant|int[eé]gral)|tenue.*(int[eé]grale|couvrante)/i.test(policyEvidence) || !/bras/i.test(policyEvidence) || !/chevilles/i.test(policyEvidence) || !/cheveux|chevelure/i.test(policyEvidence) || !/autoris[eé]|accept[eé]|admis/i.test(policyEvidence)) missing.push('politique actuelle du gestionnaire ne confirme pas explicitement une tenue autorisée couvrant bras, jambes jusqu’aux chevilles et cheveux');
  }
  if (record.category === 'sante') {
    if (!record.healthSubtype) missing.push('spécialité santé structurée');
    if (!record.qualification || !record.qualificationUrl) missing.push('qualification et source officielle de vérification');
    if (!record.adaptationEvidence?.url || !record.adaptationEvidence.excerpt || record.adaptationEvidence.excerpt.length < 12) missing.push('preuve officielle d’adaptation au public musulman');
    else {
      try {
        if (new URL(record.adaptationEvidence.url).origin !== new URL(source.url).origin) missing.push('preuve d’adaptation hors de la source officielle vérifiée');
      } catch { missing.push('URL de preuve d’adaptation invalide'); }
    }
    if (!record.city && !remoteHealth) missing.push('ville ou modalité à distance documentée');
  }
  if (record.category === 'cagnotte') {
    if (!record.organizer) missing.push('organisateur identifié');
    if (!record.campaignDestination) missing.push('destination de la collecte');
    if (record.campaignStatus !== 'active') missing.push('campagne explicitement active');
    const evidence = record.campaignStatusEvidence;
    if (!evidence?.excerpt || evidence.excerpt.trim().length < 12 || evidence.url !== record.provenance.url) missing.push('preuve datée de l’état actif sur la page originale');
    if (evidence && Date.parse(evidence.checkedAt) !== Date.parse(record.provenance.fetchedAt)) missing.push('date de contrôle de campagne incohérente');
    if (record.campaignRaised !== undefined && (record.campaignRaised < 0 || !record.campaignCurrency)) missing.push('jauge ou devise incohérente');
    if (record.campaignGoal !== undefined && (record.campaignGoal <= 0 || !record.campaignCurrency)) missing.push('objectif ou devise incohérent');
    if (record.campaignBackers !== undefined && record.campaignBackers < 0) missing.push('nombre de soutiens invalide');
  }
  if (record.category === 'hajj') {
    if (!hajjOffer) missing.push('données structurées de l’offre Hajj/Omra');
    else {
      if (!/^[0-9a-f-]{36}$/i.test(hajjOffer.partnerId)) missing.push('identifiant partenaire réel');
      if (!hajjOffer.agencyName || !hajjOffer.agencyCity || !hajjOffer.departureCity) missing.push('agence, ville de l’agence et ville de départ');
      if (!Number.isFinite(hajjOffer.price) || hajjOffer.price <= 0 || hajjOffer.currency !== 'EUR') missing.push('prix et devise publiés');
      if (!Number.isInteger(hajjOffer.duration) || hajjOffer.duration <= 0) missing.push('durée publiée');
      if (!hajjOffer.dates || !hajjOffer.includes.length) missing.push('période et prestations publiées');
      if (hajjOffer.description.trim().length < 80) missing.push('description utile de l’offre');
    }
  }
  if (record.category === 'justice') {
    if (!record.justiceSubtype || !['avocat', 'association', 'permanence', 'aide-juridique'].includes(record.justiceSubtype)) missing.push('type de ressource juridique');
    if (!record.serviceArea) missing.push('zone de service');
    if (!record.accessConditions) missing.push('modalités d’accès');
    if (record.justiceSubtype === 'avocat' && (!record.justiceQualification || !record.justiceQualificationUrl)) missing.push('qualification professionnelle vérifiable');
  }
  if (!(AUTO_CATEGORIES as readonly string[]).includes(record.category) && !['sante', 'cagnotte', 'justice'].includes(record.category) && !(record.category === 'hajj' && hajjOffer)) missing.push('adaptateur de publication propre à la catégorie requis : recherche autorisée, publication non activée');
  const reasons = missing.filter((value): value is string => typeof value === 'string' && !!value);
  if (record.commercial && !['librairie', 'piscine'].includes(record.category) && !(record.category === 'hajj' && hajjOffer)) reasons.push('fiche commerciale : validation humaine');
  if (!record.phone && !record.email && !record.website) reasons.push('contact public manquant');
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
