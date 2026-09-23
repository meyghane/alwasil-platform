import { NextResponse } from 'next/server';

// Legacy Sheets links cannot publish records outside Neon moderation.
export async function GET() {
  return NextResponse.json({ error: 'Ce lien de validation est ancien. Ouvre /admin/soumissions pour vérifier et publier la fiche.' }, { status: 410 });
}
