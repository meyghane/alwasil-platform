import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { isAdminLoggedIn } from '@/lib/admin-auth';

export async function GET() {
  if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const result = await db.execute(sql`
      SELECT category,
        sum(model_calls)::int AS model_calls,
        sum(tokens_used)::int AS tokens_used,
        sum(items_found)::int AS items_found,
        sum(items_inserted)::int AS items_inserted,
        sum(quota_errors)::int AS quota_errors
      FROM scrape_category_usage
      WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'Europe/Paris') AT TIME ZONE 'Europe/Paris'
      GROUP BY category ORDER BY category
    `);
    return NextResponse.json({ date: new Date().toISOString().slice(0, 10), categories: result.rows });
  } catch {
    return NextResponse.json({ error: 'Suivi indisponible : migration 0007 à vérifier.' }, { status: 503 });
  }
}
