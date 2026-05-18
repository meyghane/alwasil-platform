import { redirect, notFound } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { CATEGORY_FORMS } from '@/lib/admin-forms';
import AddForm from './AddForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AjouterPage({ params }: { params: Promise<{ categorie: string }> }) {
 if (!(await isAdminLoggedIn())) redirect('/admin/login');

 const { categorie } = await params;
 const form = CATEGORY_FORMS[categorie];
 if (!form) notFound();

 return (
 <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fdfbf0 0%, #faf9ff 100%)' }}>

 {/* Header violet */}
 <div style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1e0545 100%)', borderBottom: '1px solid rgba(196,181,253,0.15)' }}>
 <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
 <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.82rem', transition: 'color 0.15s' }}>
 <ArrowLeft size={14} /> Dashboard
 </Link>
 <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
 <span style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
 Ajouter — {form.label}
 </span>
 </div>
 </div>

 <div className="container" style={{ padding: '2rem 1rem', maxWidth: '680px' }}>

 {/* Card formulaire */}
 <div style={{
 backgroundColor: 'white',
 borderRadius: '16px',
 border: '1px solid #fdfbf0',
 overflow: 'hidden',
 boxShadow: '0 4px 20px rgba(109,40,217,0.08)',
 }}>
 {/* Form header violet */}
 <div style={{
 background: 'linear-gradient(135deg, #c9973a 0%, #a87830 100%)',
 padding: '1.25rem 1.75rem',
 }}>
 <div style={{ fontWeight: 800, color: 'white', fontSize: '1.05rem' }}>{form.label}</div>
 <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Onglet Sheet : {form.sheetTab}</div>
 </div>

 <AddForm categorie={categorie} form={form} />
 </div>
 </div>
 </div>
 );
}
