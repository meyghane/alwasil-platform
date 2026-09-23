const base = process.argv[2] || 'http://127.0.0.1:3100';
if (!/^https:\/\/al-wasil\.fr$|^http:\/\/127\.0\.0\.1:3100$/.test(base)) throw new Error('Origine de test non autorisée');
let failed = false;
for (const [path,expected] of [['/',200],['/events',200],['/education',200],['/solidarity',200],['/hajj',200],['/lieux-priere',200],['/piscines',200],['/api/admin/agents',401],['/api/cron/agents',401],['/api/public/items/invalid',404]]) {
  try { const response = await fetch(base+path,{redirect:'manual',signal:AbortSignal.timeout(12000)}); const ok=response.status===expected; failed ||= !ok; console.log(JSON.stringify({path,status:response.status,expected,ok})); }
  catch { failed=true; console.log(JSON.stringify({path,failed:true})); }
}
for (const content of ['événements à Paris','mosquées à Paris','instituts à Paris','solidarité à Paris','Omra à Paris']) {
  try {
    const response=await fetch(base+'/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:[{role:'user',content}]}),signal:AbortSignal.timeout(12000)});
    const body=await response.json(); const ok=response.ok && !!body.text && !/approved|pending|sourceUrl|metadata/.test(body.text);
    failed ||= !ok; console.log(JSON.stringify({question:content,status:response.status,ok}));
  } catch { failed=true; console.log(JSON.stringify({question:content,failed:true})); }
}
for (const path of ['/api/telegram-webhook','/api/admin/agents','/api/contact']) {
  const response=await fetch(base+path,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
  const ok=[400,401,403,503].includes(response.status); failed ||= !ok; console.log(JSON.stringify({path,invalidInputStatus:response.status,ok}));
}
process.exitCode=failed?1:0;
