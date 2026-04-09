import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';

async function getHistorique() {
  try {
    const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID || '1Qr-ZnpjCOUBWpki__ueQIQQrPSogs4bRJ0osy4RoLfU';
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Historique`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    const text = await res.text();
    const jsonStr = text.replace(/^[^(]+\(/, '').replace(/\);?\s*$/, '');
    const json = JSON.parse(jsonStr);
    if (!json.table?.rows) return [];
    return json.table.rows.map((row: any) => ({
      id:         row.c?.[0]?.v || '',
      categorie:  row.c?.[1]?.v || '',
      sheetTab:   row.c?.[2]?.v || '',
      nom:        row.c?.[3]?.v || '',
      action:     row.c?.[4]?.v || '',
      date:       row.c?.[5]?.v || '',
    }));
  } catch {
    return [];
  }
}

export default async function HistoriquePage() {
  if (!(await isAdminLoggedIn())) redirect('/admin/login');

  const historique = await getHistorique();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#0a0a0a', borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/admin" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem' }}>← Dashboard</a>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#374151' }} />
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>📋 Historique des modifications</span>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Historique</h1>

        {historique.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
            <p>Aucune modification enregistrée pour l&apos;instant.</p>
            <p style={{ fontSize: '0.8rem' }}>L&apos;historique se remplit automatiquement à chaque validation.</p>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', border: '2px solid #0a0a0a', borderRadius: '12px', boxShadow: '4px 4px 0 #0a0a0a', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0a0a0a' }}>
                  {['Date', 'Action', 'Catégorie', 'Fiche', 'Onglet Sheet'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...historique].reverse().map((entry: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {entry.date ? new Date(entry.date).toLocaleString('fr-FR') : '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: entry.action === 'PUBLICATION' ? '#d1fae5' : '#fee2e2', color: entry.action === 'PUBLICATION' ? '#065f46' : '#991b1b' }}>
                        {entry.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>{entry.categorie}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: '#0a0a0a' }}>{entry.nom}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', color: '#9ca3af' }}>{entry.sheetTab}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
