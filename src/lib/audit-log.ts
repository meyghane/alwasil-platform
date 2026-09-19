import { db } from '@/db';
import { moderationLog } from '@/db/schema';

export async function writeAudit(input: {
  itemId: string;
  action: 'approved' | 'rejected' | 'edited' | 'archived' | 'reverification_requested' | 'deleted';
  previousStatus?: string | null;
  newStatus?: string | null;
  actor: string;
}) { return db.insert(moderationLog).values(input); }
