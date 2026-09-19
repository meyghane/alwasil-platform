type ContactFields = Record<string, unknown>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_LIMITS: Record<string, number> = {
  nom: 120, email: 240, phone: 40, type: 80, budget: 80, depart: 80,
  ville_depart: 80, personnes: 20, nombre: 20, message: 2000,
};

export function validateContactFields(type: string, fields: ContactFields): string | null {
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') return `Champ invalide : ${key}`;
    const max = FIELD_LIMITS[key];
    if (max && String(value ?? '').length > max) return `Champ trop long : ${key}`;
  }
  const email = String(fields.email ?? '').trim();
  if (email && !EMAIL.test(email)) return 'Adresse email invalide.';
  if (type === 'hajj-devis') {
    for (const key of ['nom', 'email', 'type', 'budget']) if (!String(fields[key] ?? '').trim()) return `Champ obligatoire manquant : ${key}`;
    if (fields.consentFollowUp !== 'true') return 'Le consentement de suivi est requis.';
  }
  return null;
}
