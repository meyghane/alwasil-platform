import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { CATEGORIES_LIST } from '@/lib/admin-forms';
import AdminLogout from './AdminLogout';

export default async function AdminPage() {
  if (!(await isAdminLoggedIn())) redirect('/admin/login');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#0a0a0a', borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#5e17eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.1rem', fontFamily: 'Poppins, sans-serif' }}>W</div>
            <div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>Al-Wasil Admin</div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Espace administration</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/admin/historique" style={{ fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'none', padding: '0.4rem 0.75rem', border: '1px solid #374151', borderRadius: '6px' }}>
              📋 Historique
            </Link>
            <Link href="/" style={{ fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'none' }}>← Site</Link>
            <AdminLogout />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem' }}>

        {/* Titre */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '1.75rem', color: '#0a0a0a', margin: '0 0 0.5rem' }}>
            Tableau de bord
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
            Ajouter une fiche — elle sera envoyée par email pour validation avant publication.
          </p>
        </div>

        {/* Grille des catégories */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {CATEGORIES_LIST.map(cat => (
            <Link
              key={cat.key}
              href={`/admin/ajouter/${cat.key}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{ backgroundColor: 'white', border: '2px solid #0a0a0a', borderRadius: '12px', padding: '1.5rem', boxShadow: '4px 4px 0 #0a0a0a', transition: 'all 0.15s', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: cat.color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '2px solid #0a0a0a', flexShrink: 0 }}>
                    {cat.emoji}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#0a0a0a' }}>{cat.label}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>→ {cat.sheetTab}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: cat.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  + Ajouter une fiche
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Infos */}
        <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px' }}>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#0369a1', margin: '0 0 0.5rem' }}>ℹ️ Comment ça marche</h3>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#0369a1', lineHeight: 1.8 }}>
            <li>Tu remplis le formulaire de la catégorie voulue</li>
            <li>Un email de validation est envoyé à al-wasil@hotmail.com</li>
            <li>Tu cliques <strong>"Valider"</strong> dans l'email → la fiche est ajoutée dans le Google Sheet</li>
            <li>Le site se met à jour automatiquement dans l'heure qui suit</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
