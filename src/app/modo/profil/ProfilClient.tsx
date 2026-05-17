'use client';

import { useState } from 'react';
import { ArrowLeft, Lock, CheckCircle, Star, TrendingUp, FileText, Shield } from 'lucide-react';
import type { UserSession } from '@/lib/user-auth';

const VIOLET = '#7c3aed';

type Stats = { soumises: number; validees: number; rejetees: number; ajoutsRapides: number };
type Level = { label: string; ar: string; color: string; next: number | null; progress: number };

const PERM_LABELS: Record<string, string> = {
  all: 'Tout', piscine: 'Piscines', events: 'Événements', mosquees: 'Mosquées',
  emploi: 'Emploi', instituts: 'Instituts', cagnottes: 'Cagnottes', librairies: 'Librairies',
  psy: 'Psychologie', hijama: 'Hijama', roqya: 'Roqya', hajj: 'Hajj/Omra',
};

export default function ProfilClient({
  session, stats, hasanates, level,
}: {
  session: UserSession; stats: Stats; hasanates: number; level: Level;
}) {
  const [tab, setTab]         = useState<'profil' | 'securite'>('profil');
  const [displayName, setDN]  = useState(session.name);
  const [savingName, setSN]   = useState(false);
  const [nameOk, setNameOk]   = useState(false);

  const [oldPwd, setOldPwd]   = useState('');
  const [newPwd, setNewPwd]   = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwdStatus, setPwdS]  = useState<'idle' | 'ok' | 'error'>('idle');
  const [pwdMsg, setPwdMsg]   = useState('');

  const taux = stats.soumises > 0 ? Math.round((stats.validees / stats.soumises) * 100) : 0;

  async function saveName() {
    if (!displayName.trim()) return;
    setSN(true);
    await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: displayName.trim() }),
    });
    setSN(false);
    setNameOk(true);
    setTimeout(() => setNameOk(false), 3000);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd !== confirm) { setPwdS('error'); setPwdMsg('Les mots de passe ne correspondent pas.'); return; }
    if (newPwd.length < 6) { setPwdS('error'); setPwdMsg('Minimum 6 caractères.'); return; }
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd }),
    });
    const d = await res.json();
    if (res.ok) { setPwdS('ok'); setPwdMsg('Mot de passe mis à jour !'); setOldPwd(''); setNewPwd(''); setConfirm(''); }
    else { setPwdS('error'); setPwdMsg(d.error || 'Erreur.'); }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f5f3ff 0%, #faf9ff 100%)', fontFamily: 'Poppins, sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1e0545 100%)' }}>
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/modo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8rem' }}>
            <ArrowLeft size={14} /> Accueil
          </a>
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Mon profil</span>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '680px' }}>

        {/* Card identité + niveau */}
        <div style={{ background: 'linear-gradient(135deg, #3b0764, #1e0545)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.5rem', boxShadow: '0 8px 32px rgba(59,7,100,0.3)', position: 'relative', overflow: 'hidden' }}>
          {/* Halo déco */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', position: 'relative' }}>
            {/* Avatar */}
            <div style={{ width: 64, height: 64, borderRadius: '18px', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'white', flexShrink: 0, boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
              {session.name.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'white' }}>{session.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(196,181,253,0.7)', marginTop: '2px' }}>{session.email}</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(196,181,253,0.15)', color: '#c4b5fd', border: '1px solid rgba(196,181,253,0.2)' }}>
                  {session.role === 'admin' ? '⚙️ Administrateur' : '🛡️ Modérateur'}
                </span>
                {session.permissions.includes('all') ? (
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(196,181,253,0.15)', color: '#c4b5fd' }}>Accès complet</span>
                ) : session.permissions.map(p => (
                  <span key={p} style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>{PERM_LABELS[p] || p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Hasanates & niveau */}
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(196,181,253,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Hasanates gagnées</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>{hasanates.toLocaleString('fr-FR')}</span>
                  <span style={{ fontSize: '1rem' }}>✨</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.68rem', color: 'rgba(196,181,253,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Niveau actuel</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: level.color }}>{level.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(196,181,253,0.5)', direction: 'rtl' }}>{level.ar}</div>
              </div>
            </div>

            {/* Barre de progression */}
            {level.next && (
              <div>
                <div style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${level.progress}%`, background: 'linear-gradient(90deg, #7c3aed, #fbbf24)', borderRadius: '99px', transition: 'width 0.6s ease' }} />
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(196,181,253,0.5)', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{level.progress}% vers {level.next.toLocaleString('fr-FR')} ✨</span>
                  <span>Prochain niveau</span>
                </div>
              </div>
            )}
            {!level.next && (
              <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, textAlign: 'center', marginTop: '0.25rem' }}>
                🏆 Niveau maximum atteint — bārakAllāhu fīk !
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Soumises', value: stats.soumises, icon: FileText, color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Validées', value: stats.validees, icon: CheckCircle, color: '#059669', bg: '#f0fdf4' },
            { label: 'Rejetées', value: stats.rejetees, icon: Shield, color: '#dc2626', bg: '#fef2f2' },
            { label: 'Taux OK', value: `${taux}%`, icon: TrendingUp, color: '#d97706', bg: '#fffbeb' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #ede9fe', padding: '1rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(109,40,217,0.06)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                <Icon size={18} color={color} strokeWidth={1.8} />
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#0f0225' }}>{value}</div>
              <div style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Gains par action */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #ede9fe', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(109,40,217,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>Comment gagner des hasanates ✨</div>
          {[
            { action: 'Ajouter une fiche manuellement', gain: '+10 ✨', color: '#7c3aed' },
            { action: 'Ajout Rapide avec Wassil', gain: '+15 ✨', color: '#5b21b6' },
            { action: 'Fiche validée par l\'admin', gain: '+25 ✨', color: '#059669' },
            { action: 'Valider une soumission', gain: '+5 ✨', color: '#0284c7' },
          ].map(({ action, gain, color }) => (
            <div key={action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f5f3ff' }}>
              <span style={{ fontSize: '0.83rem', color: '#374151' }}>{action}</span>
              <span style={{ fontSize: '0.83rem', fontWeight: 700, color }}>{gain}</span>
            </div>
          ))}
          <div style={{ marginTop: '0.875rem', padding: '0.75rem', backgroundColor: '#f5f3ff', borderRadius: '10px', fontSize: '0.75rem', color: '#7c3aed', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.5 }}>
            &ldquo;Qui guide vers une bonne action reçoit une récompense équivalente.&rdquo; — Hadith
          </div>
        </div>

        {/* Onglets Profil / Sécurité */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #ede9fe', overflow: 'hidden', boxShadow: '0 2px 8px rgba(109,40,217,0.06)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #ede9fe' }}>
            {(['profil', 'securite'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: '0.875rem', background: 'none', border: 'none', fontWeight: tab === t ? 700 : 500, fontSize: '0.85rem', color: tab === t ? VIOLET : '#9ca3af', cursor: 'pointer', borderBottom: tab === t ? `2px solid ${VIOLET}` : '2px solid transparent', fontFamily: 'Poppins, sans-serif', transition: 'all 0.15s' }}>
                {t === 'profil' ? '👤 Mon profil' : '🔒 Sécurité'}
              </button>
            ))}
          </div>

          <div style={{ padding: '1.5rem' }}>
            {tab === 'profil' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nom affiché</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input value={displayName} onChange={e => setDN(e.target.value)}
                      style={{ flex: 1, padding: '0.75rem 1rem', border: '2px solid #ede9fe', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', fontFamily: 'Poppins, sans-serif' }} />
                    <button onClick={saveName} disabled={savingName}
                      style={{ padding: '0.75rem 1.25rem', backgroundColor: nameOk ? '#059669' : VIOLET, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif', transition: 'background 0.2s' }}>
                      {nameOk ? '✓ Sauvé' : savingName ? '...' : 'Sauvegarder'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '0.35rem 0 0' }}>Apparaît dans l&apos;historique des modifications.</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                  <div style={{ padding: '0.75rem 1rem', border: '1.5px solid #f3f4f6', borderRadius: '10px', fontSize: '0.9rem', color: '#9ca3af', backgroundColor: '#fafafa' }}>{session.email}</div>
                  <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '0.35rem 0 0' }}>L&apos;email est géré par l&apos;administrateur.</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rôle & permissions</label>
                  <div style={{ padding: '0.75rem 1rem', border: '1.5px solid #f3f4f6', borderRadius: '10px', backgroundColor: '#fafafa', fontSize: '0.85rem', color: '#374151' }}>
                    <strong>{session.role === 'admin' ? 'Administrateur' : 'Modérateur'}</strong> — {session.permissions.includes('all') ? 'Toutes catégories' : session.permissions.map(p => PERM_LABELS[p] || p).join(', ')}
                  </div>
                </div>
              </div>
            )}

            {tab === 'securite' && (
              <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Lock size={16} color={VIOLET} strokeWidth={2} />
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f0225', margin: 0 }}>Changer le mot de passe</h3>
                </div>
                {[['Mot de passe actuel', oldPwd, setOldPwd], ['Nouveau mot de passe', newPwd, setNewPwd], ['Confirmer le nouveau', confirm, setConfirm]].map(([label, val, setter]) => (
                  <div key={label as string}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label as string}</label>
                    <input type="password" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} required
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #ede9fe', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }} />
                  </div>
                ))}
                {pwdStatus !== 'idle' && (
                  <div style={{ padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: pwdStatus === 'ok' ? '#d1fae5' : '#fee2e2', color: pwdStatus === 'ok' ? '#065f46' : '#991b1b' }}>{pwdMsg}</div>
                )}
                <button type="submit" style={{ padding: '0.8rem', backgroundColor: VIOLET, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                  Mettre à jour
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Niveaux */}
        <div style={{ marginTop: '1.5rem', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #ede9fe', padding: '1.25rem', boxShadow: '0 2px 8px rgba(109,40,217,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>Niveaux & récompenses</div>
          {[
            { label: 'Moubtadi\'', ar: 'مبتدئ', min: 0, max: 75, color: '#6b7280' },
            { label: 'Mousāhim', ar: 'مساهم', min: 75, max: 200, color: '#0284c7' },
            { label: 'Nāfi\'', ar: 'نافع', min: 200, max: 500, color: '#059669' },
            { label: 'Bâtisseur', ar: 'بانٍ', min: 500, max: 1000, color: '#7c3aed' },
            { label: 'Pilier', ar: 'ركيزة', min: 1000, max: null, color: '#f59e0b' },
          ].map(({ label, ar, min, max, color }) => {
            const isCurrentLevel = hasanates >= min && (max === null || hasanates < max);
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '8px', marginBottom: '0.35rem', backgroundColor: isCurrentLevel ? '#f5f3ff' : 'transparent', border: isCurrentLevel ? '1px solid #ddd6fe' : '1px solid transparent' }}>
                <Star size={14} color={color} strokeWidth={isCurrentLevel ? 2.5 : 1.5} fill={isCurrentLevel ? color : 'none'} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: isCurrentLevel ? 700 : 500, fontSize: '0.85rem', color: isCurrentLevel ? color : '#6b7280' }}>{label}</span>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginLeft: '0.5rem', direction: 'rtl' }}>{ar}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{min.toLocaleString('fr-FR')} {max ? `→ ${max.toLocaleString('fr-FR')} ✨` : '+ ✨'}</span>
                {isCurrentLevel && <span style={{ fontSize: '0.65rem', fontWeight: 700, color, backgroundColor: `${color}15`, padding: '2px 6px', borderRadius: '4px' }}>TON NIVEAU</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
