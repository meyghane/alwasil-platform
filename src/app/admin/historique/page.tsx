import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import Link from 'next/link';
import { ArrowLeft, History, Clock } from 'lucide-react';

const VIOLET = '#7c3aed';

const CAT_LABELS: Record<string, string> = {
  webinaire: 'Webinaire', conference: 'Conférence', jeunesse: 'Jeunesse',
  collecte: 'Collecte', iftar: 'Iftar', maraude: 'Maraude',
  piscine: 'Piscine', evenement: 'Événement', mosquee: 'Mosquée',
  emploi: 'Emploi', institut: 'Institut', librairie: 'Librairie',
  cagnotte: 'Cagnotte', psy: 'Psychologie', hijama: 'Hijama',
  roqya: 'Roqya', hajj: 'Hajj/Omra', 'en-ligne': 'En ligne',
  professeur: 'Professeur',
};

const ACTION_CONFIG: Record<string, { bg: string; color: string }> = {
  IMPORT:       { bg: '#ede9fe', color: VIOLET },
  PUBLICATION:  { bg: '#d1fae5', color: '#065f46' },
  REJET:        { bg: '#fee2e2', color: '#991b1b' },
};

function formatDate(raw: unknown): string {
  if (!raw) return '—';
  const s = String(raw);
  if (!s) return '—';
  const d = new Date(s);
  if (isNaN(d.getTime())) return s.slice(0, 16).replace('T', ' à ');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${d.getFullYear()} à ${hh}h${min}`;
}

type Entree = {
  id: string; nom: string; categorie: string; onglet: string;
  action: string; date: string; par: string;
};

async function getHistorique(): Promise<Entree[]> {
  const appsUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
  if (!appsUrl) return [];
  try {
    const res = await fetch(`${appsUrl}?action=listHistorique`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.historique || []).map((row: Record<string, unknown>) => ({
      id:        String(row.id || ''),
      nom:       String(row.nom || row.titre || row.name || ''),
      categorie: String(row.categorie || ''),
      onglet:    String(row.onglet || row.sheettab || ''),
      action:    String(row.action || 'IMPORT').toUpperCase(),
      date:      String(row.date || ''),
      par:       String(row.par || row.soumis_par || 'Wassil'),
    }));
  } catch {
    return [];
  }
}

export default async function HistoriquePage() {
  if (!(await isAdminLoggedIn())) redirect('/admin/login');
  const historique = await getHistorique();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f5f3ff 0%, #faf9ff 100%)' }}>

      {/* Header violet */}
      <div style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1e0545 100%)', borderBottom: '1px solid rgba(196,181,253,0.15)' }}>
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={16} color="#c4b5fd" strokeWidth={1.8} />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>
              Historique des ajouts
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '1040px' }}>

        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#0f0225', margin: '0 0 0.3rem', fontFamily: 'Poppins, sans-serif' }}>
            Historique des ajouts
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
            {historique.length} entrée{historique.length !== 1 ? 's' : ''} — tout ce qui a été ajouté ou validé
          </p>
        </div>

        {historique.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #ede9fe' }}>
            <History size={40} color="#ddd6fe" strokeWidth={1.2} style={{ display: 'block', margin: '0 auto 1rem' }} />
            <p style={{ margin: 0, color: '#9ca3af', fontFamily: 'Poppins, sans-serif' }}>Aucun ajout enregistré.</p>
            <p style={{ fontSize: '0.78rem', color: '#c4b5fd', marginTop: '0.5rem' }}>
              ⚠️ Si tu viens de redéployer l&apos;Apps Script, patiente 30 secondes puis rafraîchis.
            </p>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #ede9fe', overflow: 'hidden', boxShadow: '0 4px 20px rgba(124,58,237,0.06)' }}>

            {/* En-tête */}
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1.4fr', gap: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#f5f3ff', borderBottom: '1px solid #ede9fe' }}>
              {['Fiche', 'Action', 'Catégorie', 'Auteur', 'Date d\'ajout'].map(h => (
                <div key={h} style={{ fontSize: '0.68rem', fontWeight: 700, color: VIOLET, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Poppins, sans-serif' }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Lignes */}
            {historique.map((entry, i) => {
              const catLabel = CAT_LABELS[entry.categorie] || CAT_LABELS[entry.onglet] || entry.categorie || entry.onglet || '—';
              const actionCfg = ACTION_CONFIG[entry.action] ?? ACTION_CONFIG.IMPORT;
              const isAI = !entry.par || entry.par === 'Wassil' || entry.par === 'Claude' || entry.par === 'wassil' || entry.par === 'claude';

              return (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1.4fr',
                  gap: '1rem', padding: '0.9rem 1.5rem',
                  borderBottom: i < historique.length - 1 ? '1px solid #f5f3ff' : 'none',
                  backgroundColor: i % 2 === 0 ? 'white' : '#fdfcff',
                  alignItems: 'center',
                }}>
                  {/* Nom */}
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1c1917', lineHeight: 1.4, fontFamily: 'Poppins, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.nom || entry.id || '—'}
                  </div>

                  {/* Action */}
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', backgroundColor: actionCfg.bg, color: actionCfg.color, fontFamily: 'Poppins, sans-serif' }}>
                      {entry.action === 'IMPORT' ? '📥 Import' : entry.action === 'PUBLICATION' ? '✅ Publié' : '❌ Rejeté'}
                    </span>
                  </div>

                  {/* Catégorie */}
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', backgroundColor: '#f5f3ff', color: VIOLET, fontFamily: 'Poppins, sans-serif' }}>
                      {catLabel}
                    </span>
                  </div>

                  {/* Auteur */}
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', backgroundColor: isAI ? '#ede9fe' : '#d1fae5', color: isAI ? VIOLET : '#065f46', fontFamily: 'Poppins, sans-serif' }}>
                      {isAI ? '🤖 Wassil' : `👤 ${entry.par}`}
                    </span>
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
                    {formatDate(entry.date)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
