import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeGemini } from '../src/lib/gemini-client';
const catalog = { models: [{name:'models/test-flash',supportedGenerationMethods:['generateContent']}] };
for (const status of [400,401,403,429]) test(`Gemini ${status} : arrêt sans retry ni secret exposé`, async () => {
  let calls = 0;
  const transport: typeof fetch = async (url, init) => { calls++; assert.ok(!String(url).includes('fixture-key')); assert.equal(new Headers(init?.headers).get('x-goog-api-key'),'fixture-key'); return Response.json({error:{message:'private details'}},{status}); };
  await assert.rejects(analyzeGemini('fixture-key',[],transport), error => error instanceof Error && error.message.includes(String(status)) && !error.message.includes('private details'));
  assert.equal(calls,1);
});
test('Gemini catalogue vide : aucun modèle inventé', async () => {
  await assert.rejects(analyzeGemini('fixture-key',[],async()=>Response.json({models:[]})),/modele_non_disponible/);
});
test('Gemini timeout : diagnostic masqué', async () => {
  await assert.rejects(analyzeGemini('fixture-key',[],async()=>{throw new Error('private network');}),/timeout_ou_reseau/);
});
for (const value of ['', '{}', '{invalid']) test(`Gemini réponse inutilisable ${value.length}`,async()=>{
  let calls=0;
  await assert.rejects(analyzeGemini('fixture-key',[],async()=>Response.json(calls++?{candidates:[{content:{parts:[{text:value}]}}]}:catalog)));
});
test('Gemini extraction structurée conservée',async()=>{
  let calls=0;
  const result=await analyzeGemini('fixture-key',[],async()=>Response.json(calls++?{candidates:[{content:{parts:[{text:'{"categorie":"institut","courses":["Arabe"]}'}]}}]}:catalog));
  assert.deepEqual(result.courses,['Arabe']);
});
