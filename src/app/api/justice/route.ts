import { getLegalResources } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    return Response.json(await getLegalResources(), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Ressources juridiques indisponibles' }, { status: 503 });
  }
}
