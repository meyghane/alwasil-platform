const names = ['DATABASE_URL','RESEND_API_KEY','GEMINI_API_KEY','TELEGRAM_BOT_TOKEN','TELEGRAM_CHAT_ID','TELEGRAM_MODERATION_CHAT_ID','TELEGRAM_MODERATOR_USER_ID','CRON_SECRET','MODERATE_SECRET','RESEND_FROM_EMAIL','ADMIN_EMAIL','ADMIN_PASSWORD','ADMIN_SESSION_SECRET','PERSONAL_DATA_RETENTION_ENABLED'];
console.log(JSON.stringify({ secureSessionConfigured: (process.env.ADMIN_SESSION_SECRET || '').length >= 32 }));
console.log(JSON.stringify({ configuration: Object.fromEntries(names.map(name => [name, !!process.env[name]])) }));
console.log(JSON.stringify({ malformedConfiguration: Object.fromEntries(names.filter(name => process.env[name]).map(name => [name, { whitespace: process.env[name] !== process.env[name].trim(), escapedNewline: /\\n$/.test(process.env[name]), placeholder: /redacted|encrypted|sensitive/i.test(process.env[name]) }])) }));
async function check(name, url, options, summarize) {
  try {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
    const body = await response.json();
    console.log(JSON.stringify({ check: name, http: response.status, ...summarize(body) }));
  } catch { console.log(JSON.stringify({ check: name, failed: true })); }
}
const usable = name => process.env[name] && !/redacted|encrypted|sensitive/i.test(process.env[name]);
if (process.env.RESEND_API_KEY && !usable('RESEND_API_KEY')) console.log(JSON.stringify({ check:'resend_domains', blocked:'secret non exportable ; test production requis' }));
if (process.env.TELEGRAM_BOT_TOKEN && !usable('TELEGRAM_BOT_TOKEN')) console.log(JSON.stringify({ check:'telegram_webhook', blocked:'secret non exportable ; test production requis' }));
if (usable('RESEND_API_KEY')) await check('resend_domains', 'https://api.resend.com/domains', { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } }, body => ({ verifiedAlWasil: body.data?.some(d => d.name === 'al-wasil.fr' && d.status === 'verified') === true }));
if (usable('TELEGRAM_BOT_TOKEN')) await check('telegram_webhook', `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getWebhookInfo`, {}, body => ({ ok: body.ok === true, correctUrl: body.result?.url === 'https://al-wasil.fr/api/telegram-webhook', pending: body.result?.pending_update_count, hasError: !!body.result?.last_error_date, callbacksEnabled: body.result?.allowed_updates?.includes('callback_query') === true }));
if (process.env.GEMINI_API_KEY) await check('gemini_catalog', 'https://generativelanguage.googleapis.com/v1beta/models', { headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY } }, body => ({ availableFlashModels: body.models?.filter(m => m.name?.includes('flash') && m.supportedGenerationMethods?.includes('generateContent')).map(m => m.name) || [] }));
