// POST /api/ajout-rapide
// Reçoit un texte libre + URL optionnel → Gemini avec Google Search Grounding
// → détecte catégorie, cherche infos sur le web, génère fiche structurée
// → envoie Make webhook + Telegram + email

import { NextRequest, NextResponse } from 'next/server';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { getUserSession } from '@/lib/user-auth';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const MAKE_URL = process.env.MAKE_WEBHOOK_URL || '';
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || '';

const SYSTEM_PROMPT = `Tu es Wassil, l'assistant IA de la plateforme Al-Wasil, qui référence des ressources pour la communauté musulmane française.

Un utilisateur a soumis une description libre d'une ressource à ajouter. Ton travail :
1. Identifier la catégorie parmi : piscine, evenement, mosquee, emploi, institut, librairie, cagnotte, psy, hijama, roqya, hajj
2. Utiliser Google Search pour trouver toutes les informations manquantes (adresse exacte, horaires, tarifs, téléphone, site web, description)
3. Vérifier que la ressource existe bien et que les infos sont correctes
4. Retourner UNIQUEMENT un JSON strict (pas de markdown, pas d'explication)

Format JSON attendu :
{
 "categorie": "piscine",
 "titre": "Nom officiel complet",
 "adresse": "Adresse complète avec numéro et rue",
 "ville": "Ville",
 "departement": "75",
 "description": "2 phrases claires et factuelles",
 "tags": "tag1,tag2,tag3,tag4",
 "tarif": "Prix ou gratuit",
 "horaires": "Horaires si disponibles",
 "contact": "Téléphone ou email",
 "site_web": "URL officiel si disponible",
 "burkini": "OUI/NON/NC (pour piscines)",
 "is_spam": false,
 "confidence": 0.9,
 "note_djamil": "Ce que Wassil a trouvé ou ce qui manque encore"
}`;

export async function POST(req: NextRequest) {
 // Auth : admin (ancien système) OU modo/admin (nouveau système)
 const oldAdmin = await isAdminLoggedIn();
 const userSess = await getUserSession();
 if (!oldAdmin && !userSess) {
 return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 }

 const { texte, url } = await req.json();
 if (!texte || texte.trim().length < 5) {
 return NextResponse.json({ error: 'Texte trop court' }, { status: 400 });
 }

 const auteur = userSess?.name || 'Admin';
 const now = new Date().toISOString();

 // ── 1. Appel Gemini avec Google Search Grounding ─────────────
 const userMessage = `Voici ce que l'utilisateur a soumis :\n\n"${texte.trim()}"${url ? `\n\nLien fourni : ${url}` : ''}\n\nCherche les informations manquantes sur Google et retourne le JSON complet.`;

 let ficheGeneree: Record<string, string | boolean | number> = {};
 let geminiError = '';

 try {
 const geminiRes = await fetch(
 `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
 {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
 contents: [{ role: 'user', parts: [{ text: userMessage }] }],
 tools: [{ google_search: {} }],
 generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
 }),
 }
 );

 const geminiData = await geminiRes.json();
 const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

 // Parser le JSON retourné par Gemini
 const jsonMatch = rawText.match(/\{[\s\S]*\}/);
 if (jsonMatch) {
 ficheGeneree = JSON.parse(jsonMatch[0]);
 } else {
 geminiError = 'Gemini n\'a pas retourné un JSON valide';
 ficheGeneree = { titre: texte.slice(0, 60), description: texte, note_djamil: rawText.slice(0, 200) };
 }
 } catch (e) {
 geminiError = String(e);
 ficheGeneree = { titre: texte.slice(0, 60), description: texte };
 }

 // ── 2. Préparer la ligne Sheet ────────────────────────────────
 const categorie = String(ficheGeneree.categorie || 'divers');
 const row = {
 id: `rapide-${Date.now()}`,
 categorie,
 destinationTab: categorie, // pour que l'Apps Script sache où déplacer après validation
 status: 'à vérifier',
 soumis_le: now,
 soumis_par: auteur,
 source: 'ajout-rapide',
 texte_libre: texte,
 url_source: url || '',
 ...ficheGeneree,
 };

 // ── 3. Envoyer à Make (Google Sheet) ─────────────────────────
 let sheetOk = false;
 if (MAKE_URL) {
 try {
 const res = await fetch(MAKE_URL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(row),
 });
 sheetOk = res.ok;
 } catch { /* Make indisponible */ }
 }

 // Fallback Apps Script
 if (!sheetOk) {
 const appsUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
 if (appsUrl) {
 try {
 await fetch(appsUrl, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ sheetTab: 'Soumissions', row }),
 });
 } catch { /* ignore */ }
 }
 }

 // ── 4. Telegram ───────────────────────────────────────────────
 if (TG_TOKEN && TG_CHAT) {
 const titre = String(ficheGeneree.titre || texte.slice(0, 40));
 const ville = String(ficheGeneree.ville || '');
 const conf = ficheGeneree.confidence ? `${Math.round(Number(ficheGeneree.confidence) * 100)}%` : '?';
 const note = String(ficheGeneree.note_djamil || '');

 const msg = ` <b>Ajout Rapide — Wassil</b>\n\n <b>${categorie}</b>\n ${titre}${ville ? `\n ${ville}` : ''}\n Confiance : ${conf}${note ? `\n ${note}` : ''}\n\n <a href="https://alwasil-platform.vercel.app/admin/soumissions">Valider maintenant</a>`;

 fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ chat_id: TG_CHAT, text: msg, parse_mode: 'HTML' }),
 }).catch(() => {});
 }

 return NextResponse.json({
 ok: true,
 fiche: ficheGeneree,
 sheetOk,
 geminiError: geminiError || null,
 auteur,
 });
}
