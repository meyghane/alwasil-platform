// Cron job : scraping cagnottes 2x/jour (9h et 21h)
// Sources : LaunchGood API + HelloAsso API
// Filtre : uniquement projets communauté musulmane

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results: { launchgood?: unknown; helloasso?: unknown } = {};

    // --- LaunchGood (pas d'API officielle publique — scraping nécessaire) ---
    // TODO: fetch https://www.launchgood.com/discover?sort=trending&category=zakat
    // TODO: filtrer par tags: ['palestine','mosque','orphan','water','education']

    // --- HelloAsso (API OAuth2 disponible) ---
    // TODO: POST https://api.helloasso.com/oauth2/token pour obtenir access_token
    // TODO: GET https://api.helloasso.com/v5/organizations?search=islamique&type=FONDS_DE_DOTATION
    // TODO: filtrer par mots-clés: ['musulman','islamique','Gaza','mosquée','Coran','puits']

    console.log('[CRON] scrape-cagnottes — démarrage', new Date().toISOString());

    return Response.json({
      success: true,
      message: 'Scraping cagnottes placeholder — API keys pas encore configurées',
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('[CRON] scrape-cagnottes error:', error);
    return Response.json({ error: 'Scraping failed' }, { status: 500 });
  }
}
