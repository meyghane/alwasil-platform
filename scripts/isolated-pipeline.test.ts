import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { neon } from '@neondatabase/serverless';
import { runAgents } from '../src/lib/agents/pipeline';
import { saveAgentRecord, rollbackInvisible } from '../src/lib/agents/store';
import { deliverOnce } from '../src/lib/delivery-ledger';
import { telegramStore } from '../src/lib/telegram-delivery';
import { REGION_ZONES } from '../src/lib/agents/discovery';
import type { Source } from '../src/lib/agents/contracts';

test('recette PostgreSQL isolée : import, doublon, visibilité, livraison, redémarrage, rollback, restauration',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'alwasil-isolated-'));
  let pg=new PGlite(directory);
  // Runs the production SQL templates against a local PostgreSQL engine only.
  const sql=(async (parts:TemplateStringsArray,...params:unknown[])=>{
    const query=parts.reduce((text,part,index)=>text+(index?`$${index}`:'')+part,'');
    return (await pg.query(query,params)).rows;
  }) as ReturnType<typeof neon>;
  try {
    for(const file of ['0000_cute_longshot.sql','0001_first_lockjaw.sql','0003_lead_engine.sql','0004_freshness.sql','0009_form_security.sql','0012_telegram_delivery.sql','0014_agents.sql','0015_source_registry.sql','0016_crm_privacy.sql'])
      await pg.exec(await readFile(new URL(`../src/db/migrations/${file}`,import.meta.url),'utf8'));
    const now=new Date('2026-09-23T12:00:00Z');
    const source:Source={id:'00000000-0000-4000-8000-000000000001',url:'https://example.org/fixture',category:'mosquee',departments:[...REGION_ZONES[Math.floor(now.getTime()/86400000)%REGION_ZONES.length]],trust:'trusted',official:true,evidence:'Source synthétique réservée à cette base de test isolée.',enabled:true};
    const html='<script type="application/ld+json">'+JSON.stringify({'@type':'Mosque',name:'Fixture isolée, jamais publiée',description:'Description exclusivement synthétique pour vérifier la conservation de champs structurés dans une base de test.',telephone:'0123456789',address:{addressLocality:'Ville de test',postalCode:'75001',streetAddress:'Adresse synthétique'}})+'</script>';
    let publishedId='';let sent=0;
    const ports={sources:async()=>[source],fetch:async()=>html,save:async(record:Parameters<typeof saveAgentRecord>[0],assessment:Parameters<typeof saveAgentRecord>[1])=>{const saved=await saveAgentRecord(record,assessment,sql);if(saved.id)publishedId=saved.id;return saved;},verifyPublic:async(id:string)=>(await sql`SELECT id FROM items WHERE id=${id}::uuid AND status='approved' AND is_spam=false`).length===1,rollback:(id:string)=>rollbackInvisible(id,sql),finish:async()=>{}};
    const first=await runAgents(ports,now);
    assert.equal(first.added,1);assert.equal(first.published,1);assert.equal(first.sources.length,1);
    const delivery={key:`review:test:${publishedId}`,itemId:publishedId,recipient:'isolated-test',source:'fixture',type:'review'};
    assert.equal(await deliverOnce(telegramStore(sql),delivery,async()=>{sent++;}),true);
    await pg.close();pg=new PGlite(directory);
    assert.equal(await deliverOnce(telegramStore(sql),delivery,async()=>{sent++;}),false);
    const remaining=await sql`SELECT id FROM items i WHERE NOT EXISTS(SELECT 1 FROM telegram_deliveries d WHERE d.item_id=i.id AND d.notification_type='review' AND d.recipient='isolated-test')`;
    assert.equal(remaining.length,0);assert.equal(sent,1);
    const duplicate=await runAgents(ports,now);assert.equal(duplicate.duplicates,1);assert.equal(duplicate.added,0);
    await rollbackInvisible(publishedId,sql);assert.equal(await ports.verifyPublic(publishedId),false);
    const history=await sql`SELECT before_snapshot FROM agent_item_history WHERE item_id=${publishedId}::uuid AND action='publication_failed'`;
    assert.equal(history.length,1);
    await sql`UPDATE items SET status='approved',metadata=${JSON.stringify(history[0].before_snapshot.metadata)}::jsonb WHERE id=${publishedId}::uuid`;
    assert.equal(await ports.verifyPublic(publishedId),true);
    await sql`UPDATE items SET status='expired' WHERE id=${publishedId}::uuid`;
    assert.equal(await ports.verifyPublic(publishedId),false);
    const uncertain={...delivery,key:`uncertain:${publishedId}`,type:'isolated_error'};
    await assert.rejects(deliverOnce(telegramStore(sql),uncertain,async()=>{throw new Error('simulated timeout');}));
    assert.equal(await deliverOnce(telegramStore(sql),uncertain,async()=>assert.fail()),false);
    assert.equal((await sql`SELECT error_code FROM telegram_deliveries WHERE dedupe_key=${uncertain.key}`)[0].error_code,'delivery_unconfirmed');
  } finally {await pg.close();await rm(directory,{recursive:true,force:true});}
});
