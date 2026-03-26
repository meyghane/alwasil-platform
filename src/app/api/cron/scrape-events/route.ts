// Cron job : scraping événements 2x/jour (7h et 19h)
// Déclenché automatiquement par Vercel via vercel.json
// TODO: brancher sur une vraie DB (Supabase) quand prête

export async function GET(request: Request) {
  // Sécurité : seul Vercel peut déclencher ce cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // TODO: implémenter le scraping réel
    // Sources à scraper :
    // 1. Saphirnews.com/evenements
    // 2. Instagram Graph API (@islamiledeFrance)
    // 3. Pages Facebook associations islamiques IdF
    // 4. Sites mosquées (mawaqit.net feed)

    console.log('[CRON] scrape-events — démarrage', new Date().toISOString());

    // Placeholder — retourner OK pour éviter erreur Vercel
    return Response.json({
      success: true,
      message: 'Scraping events placeholder — DB pas encore connectée',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CRON] scrape-events error:', error);
    return Response.json({ error: 'Scraping failed' }, { status: 500 });
  }
}
