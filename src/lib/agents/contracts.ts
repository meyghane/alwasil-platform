export const AUTO_CATEGORIES = ['mosquee', 'institut', 'evenement', 'association', 'librairie'] as const;
export type AgentCategory = typeof AUTO_CATEGORIES[number] | 'piscine' | 'hajj' | 'cagnotte' | 'sante' | 'justice' | 'emploi';
export type Source = { id: string; url: string; category: AgentCategory; departments: string[]; trust: 'pending' | 'trusted' | 'blocked'; official: boolean; evidence: string; enabled: boolean };
export type RecordData = {
  title: string; category: AgentCategory; subType: string; description: string;
  city: string; department: string; address: string; phone: string; email: string;
  website: string; hours: string[]; courses: string[]; audience: string[]; format: string[];
  registrationUrl?: string;
  tags: string[]; verifiedAt: string; image?: string; date?: string; organizer?: string;
  latitude?: number; longitude?: number; historicalIds?: string[]; commercial?: boolean;
  relevanceEvidence?: { url: string; excerpt: string; reason: string };
  provenance: { sourceId: string; url: string; fetchedAt: string; contentHash: string; fields: string[] };
};
export type Assessment = { decision: 'automatic' | 'deferred' | 'blocked'; confidence: 'high' | 'medium' | 'low'; reasons: string[] };
export type RunMetrics = {
  groundingRequests: number;
  searchQueries: number;
  pagesAttempted: number;
  pagesFetched: number;
  candidates: number;
  writes: number;
  visiblePublications: number;
};
export type DiscoveryCursor = { start: number; next: number; completedSlots: number; totalSlots: number };
export type RunReport = {
  id: string; startedAt: string; zones: string[]; categories: string[]; sources: string[];
  added: number; rejectionReasons: string[]; found: number; published: number; corrected: number;
  duplicates: number; rejected: number; archived: number; deferred: number; errors: string[];
  quotaReached: boolean; uncovered: string[]; actions: string[];
  metrics: RunMetrics; cursor: DiscoveryCursor;
};
export const AGENTS = {
  discovery: { input: 'sources, categories, territoires, curseur, budget', output: 'sources approuvées, créneaux manquants et recherches de repli', permission: 'lecture sources officielles et recherche web' },
  extraction: { input: 'page officielle JSON-LD', output: 'RecordData avec provenance', permission: 'aucune écriture' },
  deduplication: { input: 'candidat et fiches existantes', output: 'correspondances et compléments sans écrasement', permission: 'lecture fiches' },
  quality: { input: 'fiche, preuve officielle et pertinence explicite', output: 'Assessment et raisons', permission: 'aucune écriture' },
  publication: { input: 'Assessment et fiche', output: 'fiche, instantané et visibilité vérifiée', permission: 'écriture uniquement après critères complets' },
  freshness: { input: 'fiche et source contrôlée', output: 'proposition de revérification ou archivage', permission: 'propositions uniquement' },
  report: { input: 'RunReport avec compteurs observés', output: 'rapport Telegram unique', permission: 'agent_runs et telegram_deliveries' },
  security: { input: 'source, fiche, contexte accès', output: 'refus de destination privée, contenu suspect ou permission absente', permission: 'aucune mutation externe' },
} as const;
