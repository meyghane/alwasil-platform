import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { items, categoryEnum } from '@/db/schema';
import { isAdminLoggedIn } from '@/lib/admin-auth';
export async function GET() {
 if (!(await isAdminLoggedIn())) return NextResponse.json({ error:'Non autorisé' },{status:401});
 try {
  const rows = await db.select({ category:items.category, department:items.department, count:sql<number>`count(*)::int` }).from(items).where(eq(items.status,'approved')).groupBy(items.category,items.department);
  const categories:Record<string,Record<string,number>>=Object.fromEntries(categoryEnum.enumValues.map(c=>[c,{}]));
  const departments=new Set(['75','77','78','91','92','93','94','95']);
  for(const row of rows){const value=(row.department??'').trim().toUpperCase();const dep=/^(\d{2}|2A|2B|97\d)$/.test(value)?value:'Non renseigné';departments.add(dep);categories[row.category][dep]=(categories[row.category][dep]??0)+Number(row.count);}
  return NextResponse.json({priorityDepartments:[...departments],targetPerDepartment:3,categories,source:'neon'});
 } catch {return NextResponse.json({error:'Couverture indisponible'},{status:503});}
}
