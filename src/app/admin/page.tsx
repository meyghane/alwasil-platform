import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { CATEGORIES_LIST } from '@/lib/admin-forms';
import AdminLogout from './AdminLogout';
import ChatInterne from '@/components/ChatInterne';
import {
  Waves, BookOpen, Calendar, Briefcase, Brain, Activity,
  Gem, Library, HandCoins, Plane, History, ArrowLeft, Plus,
  LayoutDashboard, Info, Inbox, Users, Sparkles, Zap,
} from 'lucide-react';

const CAT_ICONS: Record<string, typeof Waves> = {
  piscine:   Waves,
  institut:  BookOpen,
  evenement: Calendar,
  emploi:    Briefcase,
  psy:       Brain,
  hijama:    Activity,
  roqya:     Activity,
  librairie: Library,
  cagnotte:  HandCoins,
  hajj:      Plane,
};

function getCatIcon(key: string) {
  return CAT_ICONS[key] ?? Plus;
}

const VIOLET = '#7c3aed';
const VIOLET_DARK = '#0f0225';

export default async function AdminPage() {
  if (!(await isAdminLoggedIn())) redirect('/admin/login');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f5f3ff 0%, #faf9ff 100%)' }}>

      {/* Header violet */}
      <div style={{
        background: 'linear-gradient(135deg, #3b0764 0%, #1e0545 100%)',
        borderBottom: '1px solid rgba(196,181,253,0.15)',
      }}>
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '10px',
              background: 'rgba(196,181,253,0.15)',
              border: '1px solid rgba(196,181,253,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LayoutDashboard size={18} color="#c4b5fd" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>Al-Wasil Admin</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(196,181,253,0.6)' }}>Espace administration</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <Link href="/admin/auto" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              fontSize: '0.78rem', color: '#c9973a', textDecoration: 'none',
              padding: '0.4rem 0.875rem',
              backgroundColor: 'rgba(201,151,58,0.12)',
              border: '1px solid rgba(201,151,58,0.3)',
              borderRadius: '8px',
            }}>
              <Zap size={13} strokeWidth={2} /> Autos
            </Link>
            <Link href="/admin/comptes" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              fontSize: '0.78rem', color: 'white', textDecoration: 'none',
              padding: '0.4rem 0.875rem',
              backgroundColor: 'rgba(196,181,253,0.15)',
              border: '1px solid rgba(196,181,253,0.3)',
              borderRadius: '8px',
            }}>
              <Users size={13} strokeWidth={2} /> Comptes
            </Link>
            <Link href="/admin/soumissions" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              fontSize: '0.78rem', color: 'white', textDecoration: 'none',
              padding: '0.4rem 0.875rem',
              backgroundColor: 'rgba(196,181,253,0.2)',
              border: '1px solid rgba(196,181,253,0.4)',
              borderRadius: '8px',
            }}>
              <Inbox size={13} strokeWidth={2} /> Soumissions
            </Link>
            <Link href="/admin/historique" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
              padding: '0.4rem 0.75rem', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px', transition: 'all 0.15s',
            }}>
              <History size={12} strokeWidth={2} /> Historique
            </Link>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
            }}>
              <ArrowLeft size={12} /> Site
            </Link>
            <AdminLogout />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '1000px' }}>

        {/* Ajout Rapide — bandeau Wassil */}
        <Link href="/modo/ajout-rapide" style={{ textDecoration: 'none', display: 'block', marginBottom: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #4c1d95, #3b0764)', borderRadius: '16px', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 24px rgba(76,29,149,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={22} color="#c4b5fd" strokeWidth={1.6} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', fontFamily: 'Poppins, sans-serif' }}>Ajout Rapide — Wassil</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(196,181,253,0.65)', marginTop: '2px' }}>Décris en texte libre → Wassil cherche sur Google et crée la fiche automatiquement</div>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#c4b5fd', fontWeight: 700, flexShrink: 0 }}>✨ Essayer →</div>
          </div>
        </Link>

        {/* Titre */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontWeight: 900, fontSize: '1.75rem', color: VIOLET_DARK, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
            Tableau de bord
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
            Sélectionne une catégorie pour ajouter une nouvelle fiche.
          </p>
        </div>

        {/* Leaderboard équipe */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #ede9fe', padding: '1.25rem 1.5rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(109,40,217,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Classement hasanates ✨
            </div>
            <Link href="/admin/comptes" style={{ fontSize: '0.75rem', color: VIOLET, textDecoration: 'none', fontWeight: 600 }}>Gérer l&apos;équipe →</Link>
          </div>
          {/* Podium statique — se remplira quand getStats sera dans Apps Script */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { name: 'Admin', initiale: 'A', hasanates: 0, level: 'Moubtadi\'', color: '#7c3aed' },
            ].map((m, i) => (
              <div key={m.name} style={{ flex: 1, backgroundColor: i === 0 ? '#f5f3ff' : '#fafafa', borderRadius: '12px', border: `1px solid ${i === 0 ? '#ddd6fe' : '#f3f4f6'}`, padding: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1rem' }}>
                    {m.initiale}
                  </div>
                  {i < 3 && <div style={{ position: 'absolute', top: -6, right: -6, fontSize: '0.7rem' }}>{['🥇','🥈','🥉'][i]}</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1c1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                    <div style={{ flex: 1, height: 4, backgroundColor: '#ede9fe', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min((m.hasanates / 75) * 100, 100)}%`, background: 'linear-gradient(90deg, #7c3aed, #fbbf24)', borderRadius: '99px' }} />
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fbbf24', flexShrink: 0 }}>{m.hasanates} ✨</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ flex: 2, backgroundColor: '#f5f3ff', borderRadius: '12px', border: '1px dashed #ddd6fe', padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#9ca3af', textAlign: 'center' }}>Le classement se remplit quand des modérateurs ajoutent des fiches</div>
              <Link href="/admin/comptes" style={{ fontSize: '0.72rem', color: VIOLET, textDecoration: 'none', fontWeight: 600 }}>+ Inviter un modo</Link>
            </div>
          </div>
        </div>

        {/* Grille des catégories */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {CATEGORIES_LIST.map(cat => {
            const Icon = getCatIcon(cat.key);
            return (
              <Link key={cat.key} href={`/admin/ajouter/${cat.key}`} style={{ textDecoration: 'none' }}>
                <div className="admin-cat-card" style={{
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  border: '1px solid #ede9fe',
                  padding: '1.25rem',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  boxShadow: '0 2px 8px rgba(109,40,217,0.06)',
                  cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
                      backgroundColor: '#f5f3ff',
                      border: '1px solid #ddd6fe',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} color={VIOLET} strokeWidth={1.8} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1c1917' }}>{cat.label}</div>
                      <div style={{ fontSize: '0.67rem', color: '#a8a29e' }}>→ {cat.sheetTab}</div>
                    </div>
                  </div>

                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    fontSize: '0.78rem', color: VIOLET, fontWeight: 700,
                  }}>
                    <Plus size={13} strokeWidth={2.5} /> Ajouter une fiche
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Comment ça marche */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f5f3ff',
          border: '1px solid #ddd6fe',
          borderRadius: '14px',
          display: 'flex', gap: '1rem', alignItems: 'flex-start',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '8px', flexShrink: 0,
            backgroundColor: VIOLET, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Info size={16} color="white" strokeWidth={2} />
          </div>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: VIOLET_DARK, margin: '0 0 0.5rem' }}>
              Comment ça marche
            </h3>
            <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.83rem', color: '#57534e', lineHeight: 1.9 }}>
              <li>Tu remplis le formulaire de la catégorie voulue</li>
              <li>La fiche est envoyée au modérateur avec toutes les données</li>
              <li>Le modérateur valide → la fiche passe <strong style={{ color: VIOLET }}>"en ligne"</strong></li>
              <li>La fiche apparaît instantanément sur le site</li>
            </ol>
          </div>
        </div>
      </div>

      <ChatInterne currentUser="Admin" currentRole="admin" />
    </div>
  );
}
