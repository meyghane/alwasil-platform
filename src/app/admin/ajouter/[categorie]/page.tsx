import { redirect, notFound } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { CATEGORY_FORMS } from '@/lib/admin-forms';
import AddForm from './AddForm';

export default async function AjouterPage({ params }: { params: Promise<{ categorie: string }> }) {
  if (!(await isAdminLoggedIn())) redirect('/admin/login');

  const { categorie } = await params;
  const form = CATEGORY_FORMS[categorie];
  if (!form) notFound();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#0a0a0a', borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/admin" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem' }}>← Dashboard</a>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#374151' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>{form.emoji}</span>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>
              Ajouter — {form.label}
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '720px' }}>
        <div style={{ backgroundColor: 'white', border: '2px solid #0a0a0a', borderRadius: '12px', boxShadow: '4px 4px 0 #0a0a0a', overflow: 'hidden' }}>

          {/* Form header */}
          <div style={{ backgroundColor: form.color, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{form.emoji}</span>
            <div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: 'white', fontSize: '1rem' }}>{form.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Onglet Sheet : {form.sheetTab}</div>
            </div>
          </div>

          <AddForm categorie={categorie} form={form} />
        </div>
      </div>
    </div>
  );
}
