import { getPublicMosques } from '@/lib/public-places';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  try {
    let data = await getPublicMosques();
    if (params.get('courses') === 'true') data = data.filter(row => row.has_courses);
    if (params.get('dept') && params.get('dept') !== 'Tout') data = data.filter(row => row.departement === params.get('dept'));
    if (params.get('territoire')) data = data.filter(row => row.territoire === params.get('territoire'));
    return Response.json({ count: data.length, data });
  } catch { return Response.json({ error: 'Chargement indisponible' }, { status: 503 }); }
}
