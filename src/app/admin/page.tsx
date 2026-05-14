import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { CATEGORIES_LIST } from '@/lib/admin-forms';
import AdminLogout from './AdminLogout';
import {
  Waves, BookOpen, Calendar, Briefcase, Brain, Activity,
  Gem, Library, HandCoins, Plane, History, ArrowLeft, Plus,
  LayoutDashboard, Info,
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

        {/* Titre */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontWeight: 900, fontSize: '1.75rem', color: VIOLET_DARK, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
            Tableau de bord
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
            Sélectionne une catégorie pour ajouter une nouvelle fiche.
          </p>
        </div>

        {/* Grille des catégories */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {CATEGORIES_LIST.map(cat => {
            const Icon = getCatIcon(cat.key);
            return (
              <Link key={cat.key} href={`/admin/ajouter/${cat.key}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  border: '1px solid #ede9fe',
                  padding: '1.25rem',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  boxShadow: '0 2px 8px rgba(109,40,217,0.06)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  cursor: 'pointer',
                }}
                  onMouseOver={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-2px)';
                    el.style.boxShadow = '0 8px 20px rgba(109,40,217,0.14)';
                  }}
                  onMouseOut={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = '';
                    el.style.boxShadow = '0 2px 8px rgba(109,40,217,0.06)';
                  }}
                >
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
              <li>Tu remplis le formulaire de la catégorie</li>
              <li>Les données sont envoyées à Make → Gemini formate → Google Sheet</li>
              <li>Un email de notification arrive sur al-wasil@hotmail.com</li>
              <li>Tu changes le statut → <strong style={{ color: VIOLET }}>"en ligne"</strong> dans le Sheet</li>
              <li>La fiche apparaît sur le site immédiatement</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
