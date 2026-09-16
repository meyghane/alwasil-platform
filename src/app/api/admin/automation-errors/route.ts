import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { isAdminLoggedIn } from '@/lib/admin-auth';
export async function GET() {
  if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try { const errors = await db.execute(sql`SELECT id, stage, code, item_id, created_at FROM automation_errors ORDER BY created_at DESC LIMIT 100`); return NextResponse.json({ errors: errors.rows }); }
  catch { return NextResponse.json({ error: 'Journal indisponible' }, { status: 503 }); }
}
