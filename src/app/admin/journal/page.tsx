import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import AutomationJournal from './AutomationJournal';

export default async function JournalPage() {
  if (!(await isAdminLoggedIn())) redirect('/admin/login');
  return <main style={{minHeight:'100vh',background:'#f7f7f5',padding:'2rem 1rem'}}><div className="container" style={{maxWidth:1000}}><Link href="/admin" style={{color:'#080808'}}>Retour au dashboard</Link><h1 style={{margin:'1.5rem 0 .35rem'}}>Journal des automatisations</h1><p style={{color:'#666'}}>Les erreurs techniques sont enregistrées sans clé, mot de passe ni donnée personnelle.</p><AutomationJournal/></div></main>;
}
