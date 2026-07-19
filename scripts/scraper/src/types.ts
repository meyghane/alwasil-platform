export type Category =
  | 'evenement'
  | 'cagnotte'
  | 'solidarite'
  | 'education'
  | 'emploi'
  | 'piscine'
  | 'hajj';

// Categories requiring admin validation
export const MANUAL_REVIEW: Category[] = ['evenement', 'cagnotte', 'solidarite', 'education'];
// Categories auto-approved directly to PUBLIC sheet
export const AUTO_APPROVED: Category[] = ['emploi', 'piscine', 'hajj'];

export const SHEET_TAB: Record<Category, string> = {
  evenement: 'soumissions_events',
  cagnotte: 'soumissions_cagnottes',
  solidarite: 'soumissions_solidarite',
  education: 'soumissions_education',
  emploi: 'soumissions_emploi',
  piscine: 'soumissions_piscines',
  hajj: 'soumissions_hajj',
};

export interface ScrapedItem {
  id: string;
  category: Category;
  sheetTab: string;
  titre: string;
  description: string;
  date_iso?: string;       // for events
  heure?: string;
  ville: string;
  departement: string;
  organisateur: string;
  url_source: string;
  gratuit?: boolean;
  montant_objectif?: number;
  montant_actuel?: number;
  image?: string;
  source: string;          // 'helloasso' | 'launchgood' | 'gemini'
  scraped_at: string;
  status: 'a_verifier' | 'auto_approuve';
}

export interface DailyRun {
  date: string;           // YYYY-MM-DD
  items_found: number;
  email_sent: boolean;
}
