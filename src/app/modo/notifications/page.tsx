import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/user-auth';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock, Bell } from 'lucide-react';

const VIOLET = '#c9973a';

async function getMesNotifications(authorName: string) {
  try {
    const APPS_URL = process.env.APPS_SCRIPT_WEBHOOK_URL;
    if (!APPS_URL) return [];

    // Lire l'historique des actions (validations/rejets)
    const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID || '1Qr-ZnpjCOUBWpki__ueQIQQrPSogs4bRJ0osy4RoLfU';
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Historique`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    const text = await res.text();
    const jsonStr = text.replace(/^[^(]+\(/, '').replace(/\);?\s*$/, '');
    const json = JSON.parse(jsonStr);
    if (!json.table?.rows) return [];

    // Filtrer les actions faites SUR des fiches soumises par ce modo
    return json.table.rows
      .map((row: { c?: { v?: string | number | null }[] }) => ({
        id:        String(row.c?.[0]?.v || ''),
        categorie: String(row.c?.[1]?.v || ''),
        sheetTab:  String(row.c?.[2]?.v || ''),
        nom:       String(row.c?.[3]?.v || ''),
        action:    String(row.c?.[4]?.v || ''),
        date:      String(row.c?.[5]?.v || ''),
        par:       String(row.c?.[6]?.v || ''),
      }))
      .filter((e: { par: string; action: string }) =>
        e.par !== authorName && // actions faites par quelqu'un d'autre (l'admin)
        (e.action === 'PUBLICATION' || e.action === 'REJET')
      )
      .slice(0, 20);
  } catch {
    return [];
  }
}

export default async function NotificationsPage() {
  const session = await getUserSession();
  if (!session) redirect('/modo/login');

  const notifs = await getMesNotifications(session.name);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fdfbf0 0%, #faf9ff 100%)' }}>

      <div style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1e0545 100%)', borderBottom: '1px solid rgba(196,181,253,0.15)' }}>
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/modo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8rem' }}>
            <ArrowLeft size={14} /> Accueil
          </Link>
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={15} color="#d4a853" strokeWidth={1.8} />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>Notifications</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '760px' }}>
        <h1 style={{ fontWeight: 900, fontSize: '1.4rem', color: '#0f0225', margin: '0 0 1.5rem', fontFamily: 'Poppins, sans-serif' }}>
          Activité récente
        </h1>

        {notifs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #fdfbf0' }}>
            <Bell size={32} color="#f0dea0" strokeWidth={1.4} style={{ display: 'block', margin: '0 auto 1rem' }} />
            <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif' }}>Aucune notification pour l&apos;instant.</p>
            <p style={{ fontSize: '0.78rem', marginTop: '0.5rem' }}>Tu seras notifié quand l&apos;admin validera ou rejettera une fiche.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifs.map((n: { id: string; action: string; categorie: string; nom: string; date: string; par: string }, i: number) => {
              const isPubli = n.action === 'PUBLICATION';
              return (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', border: `1px solid ${isPubli ? '#f0dea0' : '#fecaca'}`, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: isPubli ? '#fdfbf0' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isPubli
                      ? <CheckCircle size={20} color="#c9973a" strokeWidth={2} />
                      : <XCircle size={20} color="#dc2626" strokeWidth={2} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1c1917', fontFamily: 'Poppins, sans-serif' }}>
                      {isPubli ? 'Fiche publiée' : 'Fiche rejetée'} — <span style={{ color: VIOLET }}>{n.nom || '(sans titre)'}</span>
                    </div>
                    <div style={{ fontSize: '0.73rem', color: '#9ca3af', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={11} strokeWidth={2} />
                      {n.date} · {n.categorie} · par {n.par}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: isPubli ? '#fdfbf0' : '#fee2e2', color: isPubli ? '#8a6025' : '#991b1b' }}>
                    {isPubli ? 'EN LIGNE' : 'REJETÉ'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
