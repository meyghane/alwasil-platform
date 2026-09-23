export async function deliverRecordedEmail(send: () => Promise<{ error?: unknown }>, recordFailure: () => Promise<void>): Promise<boolean> {
  try {
    const result = await send();
    if (result.error) throw new Error('Email provider rejected message');
    return true;
  } catch {
    await recordFailure();
    return false;
  }
}
