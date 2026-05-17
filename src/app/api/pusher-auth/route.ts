// Endpoint d'authentification pour les Pusher Presence Channels
// Permet à Pusher de vérifier l'identité de l'utilisateur
// et de partager sa présence avec les autres membres du canal

import { NextRequest, NextResponse } from 'next/server';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { getUserSession } from '@/lib/user-auth';
import Pusher from 'pusher';

export async function POST(req: NextRequest) {
  const oldAdmin = await isAdminLoggedIn();
  const session  = await getUserSession();
  if (!oldAdmin && !session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body         = await req.text();
  const params       = new URLSearchParams(body);
  const socketId     = params.get('socket_id') || '';
  const channelName  = params.get('channel_name') || '';

  const name = session?.name || 'Admin';
  const role = session?.role || 'admin';

  const pusher = new Pusher({
    appId:   process.env.PUSHER_APP_ID || '',
    key:     process.env.NEXT_PUBLIC_PUSHER_KEY || '',
    secret:  process.env.PUSHER_SECRET || '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
    useTLS:  true,
  });

  // Pour les presence channels, on partage les infos de l'utilisateur
  // L'admin est marqué "invisible" pour que les modos ne le voient pas en ligne
  const presenceData = {
    user_id:   `${role}-${name.replace(/\s+/g, '-').toLowerCase()}`,
    user_info: {
      name,
      role,
      // L'admin est "fantôme" : visible uniquement pour lui-même côté serveur
      visible: role !== 'admin',
    },
  };

  try {
    const auth = pusher.authorizeChannel(socketId, channelName, presenceData);
    return NextResponse.json(auth);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
