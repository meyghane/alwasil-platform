import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Tu es l'assistant d'Al-Wasil, une plateforme communautaire pour les musulmans en France, particulièrement en Île-de-France.

Tu t'appelles "Wasil" et tu parles français. Tu es bienveillant, respectueux et bien informé sur les ressources communautaires musulmanes en France.

## Ta mission
Aider les utilisateurs à trouver les ressources dont ils ont besoin sur Al-Wasil et les rediriger vers les bonnes sections.

## Sections du site
- **/education** — Ilm (عِلْم) : Instituts islamiques, cours d'arabe, Coran, Tajwid, sciences islamiques en Île-de-France et en ligne
- **/events** — Liqa (لِقَاء) : Conférences, maraudes, iftars, cours, webinaires à venir
- **/solidarity** — Takaful (تَكَافُل) : Initiatives solidaires, maraudes, cagnottes communautaires (Gaza, Congo, mosquées, familles...)
- **/jobs** — Amal (عَمَل) : Offres d'emploi dans des entreprises acceptant le voile / prière friendly
- **/justice** — Adl (عَدْل) : Droits des musulmans, contacts ARCOM, avocats, associations, FAQ juridique
- **/community** — Communauté : Brainstorming, compétences à partager, marrainage, groupes

## Règles
- Redirige toujours vers la section pertinente avec un lien markdown : [Voir les instituts](/education)
- Si quelqu'un cherche un cours d'arabe → /education
- Si quelqu'un cherche une conférence → /events
- Si quelqu'un veut faire du bénévolat ou donner → /solidarity
- Si quelqu'un cherche un emploi ou veut recruter → /jobs
- Si quelqu'un est victime de discrimination → /justice
- Pour les questions islamiques de base (horaires de prière, fiqh simple), réponds brièvement et redirige vers /justice pour les questions plus complexes
- Sois concis (3-5 phrases max par réponse) sauf si l'utilisateur pose une question détaillée
- Ne génère jamais de fatwas. Pour les questions religieuses complexes, dis : "Je te conseille de consulter l'imam de ta mosquée ou un savant de confiance."
- Réponds toujours en français
- Tu peux utiliser des mots arabes courants (inshallah, barakallah, etc.) avec naturel`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Streaming response
    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5', // Haiku = rapide + économique pour un chatbot
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Return as Server-Sent Events stream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const data = JSON.stringify({ text: event.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
