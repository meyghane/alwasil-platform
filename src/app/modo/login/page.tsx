import { redirect } from 'next/navigation';

export default function ModoLoginRedirect() {
  redirect('/admin/login');
}
