'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, RefreshCw, CheckCircle, AlertCircle, Clock, Play } from 'lucide-react';

const GOLD = '#c9973a';

const SCRAPERS = [
  { cat: 'events',     label: 'Événements',  freq: '4×/jour',      icon: '📅' },
  { cat: 'solidarite', label: 'Solidarité',  freq: '2×/jour',      icon: '🤝' },
  { cat: 'emploi',     label: 'Emploi',      freq: '2×/jour',      icon: '💼' },
  { cat: 'cagnottes',  label: 'Cagnottes',   freq: '1×/jour',      icon: '💝' },
  { cat: 'praticiens', label: 'Praticiens',  freq: '1×/semaine',   icon: '🧠' },
  { cat: 'librairies', label: 'Librairies',  freq: '1×/semaine',   icon: '📚' },
  { cat: 'piscines',   label: 'Piscines',    freq: '1×/semaine',   icon: '🏊' },
  { cat: 'education',  label: 'Éducation',   freq: '1×/semaine',   icon: '📖' },
  { cat: 'hajj',       label: 'Hajj & Omra', freq: '1×/semaine',   icon: '🕋' },
];

type RunResult = { cat: string; found: number; written: number; status: 'ok' | 'error' | 'loading' | 'idle'; lastRun?: string };

export default function AutoPage() {
  const [results, setResults] = useState<Record<string, RunResult>>({});
  const [running, setRunning] = useState<string | null>(null);

  async function runScraper(cat: string) {
    setRunning(cat);
    setResults(prev => ({ ...prev, [cat]: { cat, found: 0, written: 0, status: 'loading' } }));
    try {
      const res = await fetch(`/api/auto/scrape?cat=${cat}`);
      const data = await res.json();
      setResults(prev => ({
        ...prev,
        [cat]: { cat, found: data.found ?? 0, written: data.written ?? 0, status: res.ok ? 'ok' : 'error', lastRun: new Date().toLocaleTimeString('fr-FR') },
      }));
    } catch {
      setResults(prev => ({ ...prev, [cat]: { cat, found: 0, written: 0, status: 'error', lastRun: new Date().toLocaleTimeString('fr-FR') } }));
    } finally {
      setRunning(null);
    }
  }

  async function runAll() {
    for (const s of SCRAPERS) {
      await runScraper(s.cat);
      await new Promise(r => setTimeout(r, 2000)); // 2s entre chaque pour pas spammer Gemini
    }
  }

  async function runCleanup() {
    setRunning('cleanup');
    try {
      const res = await fetch('/api/auto/cleanup');
      const data = await res.json();
      alert(`Nettoyage terminé — ${data.cleaned} onglet(s) traités`);
    } catch { alert('Erreur cleanup'); }
    finally { setRunning(null); }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fdfbf0 0%, #fffef8 100%)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #100c04 0%, #0a0806 100%)', borderBottom: '1px solid rgba(201,151,58,0.2)' }}>
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/admin" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color={GOLD} strokeWidth={1.8} />
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>
                Automatisations Wassil
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={runCleanup} disabled={!!running}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.875rem', backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
              🧹 Nettoyer expirés
            </button>
            <button onClick={runAll} disabled={!!running}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.875rem', backgroundColor: GOLD, color: '#0a0806', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.6 : 1, fontFamily: 'Poppins, sans-serif' }}>
              <Play size={13} strokeWidth={2} /> Tout lancer
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '900px' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#0f0a00', margin: '0 0 0.3rem', fontFamily: 'Poppins, sans-serif' }}>
            Automatisations en cours
          </h1>
          <p style={{ color: '#7a6848', fontSize: '0.85rem', margin: 0 }}>
            Les scrapers Gemini tournent automatiquement via Vercel Cron. Lance-les manuellement ici pour tester ou forcer une mise à jour.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.875rem' }}>
          {SCRAPERS.map(s => {
            const r = results[s.cat];
            const isLoading = running === s.cat;
            const status = r?.status;

            return (
              <div key={s.cat} style={{
                backgroundColor: 'white',
                borderRadius: '14px',
                border: `1px solid ${status === 'ok' ? 'rgba(201,151,58,0.3)' : status === 'error' ? '#fee2e2' : '#f0dea0'}`,
                padding: '1.25rem',
                boxShadow: '0 2px 8px rgba(15,10,0,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f0a00', fontFamily: 'Poppins, sans-serif' }}>{s.label}</div>
                      <div style={{ fontSize: '0.68rem', color: '#7a6848', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={10} strokeWidth={2} /> {s.freq}
                      </div>
                    </div>
                  </div>
                  {status === 'ok' && <CheckCircle size={16} color="#059669" strokeWidth={2} />}
                  {status === 'error' && <AlertCircle size={16} color="#dc2626" strokeWidth={2} />}
                  {isLoading && <RefreshCw size={16} color={GOLD} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />}
                </div>

                {r && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', backgroundColor: '#fdfbf0', border: '1px solid #f0dea0', color: '#7a6848' }}>
                      🔍 {r.found} trouvés
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', backgroundColor: r.written > 0 ? '#f0fdf4' : '#f9fafb', border: `1px solid ${r.written > 0 ? '#bbf7d0' : '#e5e7eb'}`, color: r.written > 0 ? '#059669' : '#6b7280' }}>
                      ✅ {r.written} écrits
                    </span>
                    {r.lastRun && <span style={{ fontSize: '0.68rem', color: '#9ca3af', marginLeft: 'auto' }}>{r.lastRun}</span>}
                  </div>
                )}

                <button
                  onClick={() => runScraper(s.cat)}
                  disabled={!!running}
                  style={{
                    width: '100%', padding: '0.5rem', borderRadius: '8px',
                    backgroundColor: isLoading ? 'rgba(201,151,58,0.1)' : GOLD,
                    color: isLoading ? GOLD : '#0a0806',
                    border: isLoading ? `1px solid ${GOLD}` : 'none',
                    fontSize: '0.78rem', fontWeight: 700, cursor: running ? 'not-allowed' : 'pointer',
                    opacity: running && !isLoading ? 0.5 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                    fontFamily: 'Poppins, sans-serif',
                    transition: 'all 0.2s',
                  }}
                >
                  {isLoading
                    ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> En cours...</>
                    : <><Play size={13} strokeWidth={2} /> Lancer maintenant</>
                  }
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', backgroundColor: 'white', borderRadius: '14px', border: '1px solid #f0dea0', fontSize: '0.8rem', color: '#7a6848', lineHeight: 1.7 }}>
          <strong style={{ color: '#0f0a00' }}>Comment ça marche :</strong> Vercel Cron appelle automatiquement ces scrapers selon le planning défini. Les nouvelles fiches arrivent dans <strong>soumissions_X</strong> avec le status <em>à vérifier</em>. Tu reçois une notification Telegram à chaque ajout. Pour les valider : <Link href="/admin/soumissions" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600 }}>page de modération →</Link>
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
