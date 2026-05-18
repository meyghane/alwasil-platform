import { redirect, notFound } from 'next/navigation';
import { getUserSession, hasPermission } from '@/lib/user-auth';
import { CATEGORY_FORMS } from '@/lib/admin-forms';
import AddForm from '@/app/admin/ajouter/[categorie]/AddForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ModoAjouterPage({ params }: { params: Promise<{ categorie: string }> }) {
  const session = await getUserSession();
  if (!session) redirect('/modo/login');

  const { categorie } = await params;
  const form = CATEGORY_FORMS[categorie];
  if (!form) notFound();

  if (!hasPermission(session, categorie)) redirect('/modo');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fdfbf0 0%, #faf9ff 100%)' }}>

      <div style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1e0545 100%)', borderBottom: '1px solid rgba(196,181,253,0.15)' }}>
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/modo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.82rem' }}>
            <ArrowLeft size={14} /> Accueil modo
          </Link>
          <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>
            Ajouter — {form.label}
          </span>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '680px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #fdfbf0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(109,40,217,0.08)' }}>
          <div style={{ background: 'linear-gradient(135deg, #c9973a 0%, #a87830 100%)', padding: '1.25rem 1.75rem' }}>
            <div style={{ fontWeight: 800, color: 'white', fontSize: '1.05rem', fontFamily: 'Poppins, sans-serif' }}>{form.label}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Soumis par : {session.name}</div>
          </div>
          <AddForm categorie={categorie} form={form} backUrl="/modo" />
        </div>
      </div>
    </div>
  );
}
