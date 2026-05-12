// Chatbot Wasil — Gemini 1.5 Flash (gratuit, quasi illimité)
// Clé API gratuite : https://aistudio.google.com/app/apikey → GEMINI_API_KEY dans .env.local + Vercel

const SYSTEM_PROMPT = `Tu es "Wasil", l'assistant d'Al-Wasil, la plateforme communautaire pour les musulmans de France (surtout Île-de-France).

Tu parles uniquement français. Tu es bienveillant, concis et bien informé sur les ressources communautaires.

## Sections du site
- /education — Instituts islamiques, cours d'arabe, Coran, Tajwid, sciences islamiques
- /events — Conférences, maraudes, iftars, cours, webinaires à venir
- /solidarity — Initiatives solidaires, maraudes, cagnottes (Gaza, mosquées, familles...)
- /jobs — Offres d'emploi avec voile accepté / prière OK
- /justice — Droits des musulmans, avocats, FAQ discrimination, ARCOM
- /sante — Psychologues, hijama certifiés, roqya, médecins bienveillants
- /piscines — Créneaux burkini en Île-de-France
- /hajj — Agences Hajj & Omra 2026, comparatif packages
- /librairies — Librairies islamiques en France

## Règles
- Redirige toujours vers la section pertinente : [Voir les piscines](/piscines)
- 3-4 phrases max par réponse, sauf question détaillée
- Ne génère jamais de fatwas. Pour questions religieuses complexes : "Consulte un imam de confiance."
- Tu peux utiliser inshallah, barakallah naturellement`;

export async function POST(request: Request) {
  const { messages } = await request.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'GEMINI_API_KEY non configurée dans .env.local et Vercel' }, { status: 500 });
  }

  // Format Gemini : "model" au lieu de "assistant"
  const contents = messages.map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}&alt=sse`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error('[chat] Gemini error:', err);
    return Response.json({ error: 'Erreur Gemini API' }, { status: 500 });
  }

  // Transposer SSE Gemini → notre format SSE { text }
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          } catch { /* chunk malformé, ignoré */ }
        }
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
