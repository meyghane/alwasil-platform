export type Delivery = { key: string; itemId?: string; updateId?: number; source: string; recipient: string; type: string };
export type DeliveryStore = {
  claim(delivery: Delivery): Promise<boolean>;
  finish(key: string, result: 'sent' | 'uncertain'): Promise<void>;
};

/** At-most-once delivery. An interrupted send requires manual reconciliation:
 * Telegram has no idempotency key, so retrying ambiguous sends risks duplicates. */
export async function deliverOnce(store: DeliveryStore, delivery: Delivery, send: () => Promise<unknown>): Promise<boolean> {
  if (!await store.claim(delivery)) return false;
  try {
    await send();
    await store.finish(delivery.key, 'sent');
    return true;
  } catch {
    await store.finish(delivery.key, 'uncertain');
    throw new Error('Envoi Telegram non confirmé ; vérifier le journal avant toute relance.');
  }
}
