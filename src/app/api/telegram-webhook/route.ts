// POST /api/telegram-webhook
// Bot Telegram intelligent : reçoit photo/texte/vocal → Gemini analyse → Sheet → site

import { NextRequest, NextResponse } from 'next/server';

const TG_TOKEN  = process.env.TELEGRAM_BOT_TOKEN || '';
const TG_CHAT   = process.env.TELEGRAM_CHAT_ID   || '';  // seul chat autorisé
const GEMINI    = process.env.GEMINI_API_KEY      || '';
const APPS_URL  = process.env.APPS_SCRIPT_WEBHOOK_URL || '';

const SYSTEM_PROMPT = `Tu es Wassil, l'assistant IA de la plateforme Al-Wasil.
Tu analyses des messages, images ou transcriptions vocales pour extraire des informations
sur des ressources islamiques en France (événements, mosquées, librairies, piscines, emploi,
praticiens, solidarité, instituts, cagnottes, hajj).

Tu retournes UNIQUEMENT un JSON valide (pas de markdown) :
{
  "categorie": "evenement|mosquee|librairie|piscine|emploi|praticien|solidarite|institut|cagnotte|hajj",
  "titre": "...",
  "description": "2 phrases factuelles",
  "ville": "...",
  "departement": "75",
  "date_iso": "YYYY-MM-DD ou null",
  "heure": "14h00 ou null",
  "organisateur": "... ou null",
  "adresse": "... ou null",
  "contact": "... ou null",
  "site_web": "... ou null",
  "gratuit": true,
  "tags": ["tag1", "tag2"],
  "note_wassil": "Ce que j'ai compris / ce qui manque",
  "confiance": 0.9
}`;

// ── Helpers Telegram ─────────────────────────────────────────────

async function tgSend(chatId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  }).catch(() => {});
}

async function tgGetFile(fileId: string): Promise<string | null> {
  const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/getFile?file_id=${fileId}`);
  const d = await r.json();
  const path = d?.result?.file_path;
  if (!path) return null;
  return `https://api.telegram.org/file/bot${TG_TOKEN}/${path}`;
}

async function downloadToBase64(url: string): Promise<{ b64: string; mime: string }> {
  const r   = await fetch(url);
  const buf = await r.arrayBuffer();
  const b64 = Buffer.from(buf).toString('base64');
  const ct  = r.headers.get('content-type') || 'application/octet-stream';
  return { b64, mime: ct };
}

// ── Appel Gemini (texte seul OU multimodal) ──────────────────────

async function analyzeWithGemini(
  text: string,
  media?: { b64: string; mime: string }
): Promise<Record<string, unknown> | null> {

  const parts: unknown[] = [];
  if (media) {
    parts.push({ inline_data: { mime_type: media.mime, data: media.b64 } });
  }
  parts.push({ text: `${text}\n\nAnalyse et retourne le JSON.` });

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: 'user', parts }],
    tools: [{ google_search: {} }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
  };

  // Essaie gemini-2.0-flash en premier (vision + audio), sinon 1.5-flash
  for (const model of ['gemini-2.0-flash', 'gemini-1.5-flash']) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );
      if (!res.ok) continue;
      const d    = await res.json();
      const raw  = d?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch { continue; }
  }
  return null;
}

// ── Écrire dans le Sheet ─────────────────────────────────────────

const CAT_TO_TAB: Record<string, string> = {
  evenement:  'soumissions_events',
  mosquee:    'soumissions_education',
  librairie:  'soumissions_librairies',
  piscine:    'soumissions_piscines',
  emploi:     'soumissions_emploi',
  praticien:  'soumissions_praticiens',
  solidarite: 'soumissions_solidarite',
  institut:   'soumissions_education',
  cagnotte:   'soumissions_cagnottes',
  hajj:       'soumissions_hajj',
};

async function writeToSheet(data: Record<string, unknown>) {
  const tab = CAT_TO_TAB[String(data.categorie)] || 'Soumissions';
  if (!APPS_URL) return false;
  try {
    const r = await fetch(APPS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sheetTab: tab,
        row: {
          id:         `tg-${Date.now()}`,
          status:     'a verifier',
          soumis_par: 'Admin (Telegram)',
          soumis_le:  new Date().toISOString(),
          ...data,
        },
      }),
    });
    return r.ok;
  } catch { return false; }
}

async function logHistorique(data: Record<string, unknown>) {
  if (!APPS_URL) return;
  fetch(APPS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sheetTab: 'Historique',
      row: {
        id:         `tg-hist-${Date.now()}`,
        categorie:  data.categorie || '',
        onglet:     CAT_TO_TAB[String(data.categorie)] || '',
        nom:        data.titre || '',
        action:     'IMPORT',
        date:       new Date().toISOString(),
        par:        'Wassil (Telegram)',
      },
    }),
  }).catch(() => {});
}

// ── Handler principal ────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const update = await req.json().catch(() => null);
  if (!update) return NextResponse.json({ ok: true });

  const msg     = update.message || update.edited_message;
  if (!msg) return NextResponse.json({ ok: true });

  const chatId  = String(msg.chat?.id);
  const fromId  = String(msg.from?.id);

  // Sécurité : seulement l'admin autorisé
  if (TG_CHAT && chatId !== TG_CHAT && fromId !== TG_CHAT) {
    return NextResponse.json({ ok: true });
  }

  await tgSend(chatId, 'Wassil analyse... un instant.');

  try {
    let geminiText  = '';
    let mediaData: { b64: string; mime: string } | undefined;

    // ── Texte ──
    if (msg.text) {
      geminiText = `Message texte reçu : "${msg.text}"`;
    }

    // ── Photo / flyer ──
    if (msg.photo || msg.document) {
      const fileId = msg.photo
        ? msg.photo[msg.photo.length - 1].file_id  // prend la meilleure résolution
        : msg.document.file_id;
      const fileUrl = await tgGetFile(fileId);
      if (fileUrl) {
        const dl = await downloadToBase64(fileUrl);
        // Corrige le MIME si nécessaire
        const mime = dl.mime.startsWith('image') ? dl.mime : 'image/jpeg';
        mediaData   = { b64: dl.b64, mime };
        geminiText  = 'Analyse cette image (flyer, affiche, photo) et extrais toutes les informations disponibles.';
      }
    }

    // ── Vocal ──
    if (msg.voice || msg.audio) {
      const fileId  = msg.voice?.file_id || msg.audio?.file_id;
      const fileUrl = await tgGetFile(fileId);
      if (fileUrl) {
        const dl    = await downloadToBase64(fileUrl);
        mediaData   = { b64: dl.b64, mime: 'audio/ogg' };
        geminiText  = 'Transcris ce message vocal et extrais toutes les informations mentionnées sur la ressource islamique.';
      }
    }

    if (!geminiText) {
      await tgSend(chatId, 'Je ne sais pas analyser ce type de message. Envoie du texte, une image ou un vocal.');
      return NextResponse.json({ ok: true });
    }

    // ── Analyse Gemini ──
    const data = await analyzeWithGemini(geminiText, mediaData);

    if (!data || !data.titre) {
      await tgSend(chatId, "Wassil n'a pas pu extraire d'informations claires. Essaie avec plus de détails.");
      return NextResponse.json({ ok: true });
    }

    // ── Écrire dans le Sheet ──
    const ok = await writeToSheet(data);
    await logHistorique(data);

    const conf  = data.confiance ? `${Math.round(Number(data.confiance) * 100)}%` : '?';
    const tab   = CAT_TO_TAB[String(data.categorie)] || '?';
    const note  = data.note_wassil ? `\n<i>${data.note_wassil}</i>` : '';

    await tgSend(chatId,
      `Analyse complete !\n\n` +
      `Categorie : <b>${data.categorie}</b>\n` +
      `Fiche : <b>${data.titre}</b>\n` +
      `Ville : ${data.ville || '?'}\n` +
      `Confiance : ${conf}\n` +
      `Sheet : ${tab}\n` +
      `Ecrit : ${ok ? 'Oui' : 'Erreur Sheet'}` +
      note +
      `\n\nValider sur https://al-wasil.fr/admin/soumissions`
    );

  } catch (err) {
    await tgSend(chatId, `Erreur : ${String(err).slice(0, 200)}`);
  }

  return NextResponse.json({ ok: true });
}
