export const AUTO_CATEGORIES = ['mosquee', 'institut', 'evenement', 'association', 'librairie', 'piscine'] as const;
export type AgentCategory = typeof AUTO_CATEGORIES[number] | 'hajj' | 'cagnotte' | 'sante' | 'justice' | 'emploi';
export type Source = { id: string; url: string; category: AgentCategory; departments: string[]; trust: 'pending' | 'trusted' | 'blocked'; official: boolean; evidence: string; enabled: boolean };
export type RecordData = {
  title: string; category: AgentCategory; subType: string; description: string;
  city: string; department: string; address: string; phone: string; email: string;
  website: string; hours: string[]; courses: string[]; audience: string[]; format: string[];
  tags: string[]; verifiedAt: string; image?: string; date?: string; organizer?: string;
  latitude?: number; longitude?: number; historicalIds?: string[];
  provenance: { sourceId: string; url: string; fetchedAt: string; contentHash: string; fields: string[] };
};
export type Assessment = { decision: 'automatic' | 'deferred' | 'blocked'; confidence: 'high' | 'medium' | 'low'; reasons: string[] };
export type RunReport = { id: string; startedAt: string; zones: string[]; categories: string[]; found: number; published: number; corrected: number; duplicates: number; rejected: number; archived: number; deferred: number; errors: string[]; quotaReached: boolean; uncovered: string[]; actions: string[] };
export const AGENTS = {
  discovery: { input: 'sources, zones, quotas', output: 'sources exécutables, couverture', permission: 'lecture sources officielles' },
  extraction: { input: 'document JSON-LD', output: 'RecordData avec provenance', permission: 'aucune écriture' },
  deduplication: { input: 'candidat et fiches existantes', output: 'correspondances et compléments sans écrasement', permission: 'lecture fiches' },
  quality: { input: 'fiche et source', output: 'Assessment et raisons', permission: 'aucune écriture' },
  publication: { input: 'Assessment et fiche', output: 'décision historisée et visibilité vérifiée', permission: 'items et agent_item_history' },
  freshness: { input: 'fiche et source contrôlée', output: 'proposition correction/archivage', permission: 'propositions uniquement' },
  report: { input: 'RunReport', output: 'rapport Telegram unique', permission: 'agent_runs et telegram_deliveries' },
  security: { input: 'source, fiche, contexte accès', output: 'blocages et erreurs masquées', permission: 'aucune mutation externe' },
} as const;
