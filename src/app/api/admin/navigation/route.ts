import { NextResponse } from 'next/server';
import { count, eq } from 'drizzle-orm';
import { db } from '@/db';
import { items, reports, automationErrors } from '@/db/schema';
import { isAdminLoggedIn } from '@/lib/admin-auth';

export async function GET() {
  if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const [pending, openReports, errors] = await Promise.all([
      db.select({ value: count() }).from(items).where(eq(items.status, 'pending')),
      db.select({ value: count() }).from(reports).where(eq(reports.status, 'open')),
      db.select({ value: count() }).from(automationErrors),
    ]);
    return NextResponse.json({ pending: Number(pending[0]?.value ?? 0), reports: Number(openReports[0]?.value ?? 0), errors: Number(errors[0]?.value ?? 0) });
  } catch { return NextResponse.json({ pending: 0, reports: 0, errors: 0 }); }
}
