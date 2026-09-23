import { neon } from '@neondatabase/serverless';
const contacts=[
  {name:'Al Mourafiq',email:'contact@almourafiq.com',phone:'+33 6 68 58 73 14',website:'https://www.almourafiq.com/',source:'https://www.almourafiq.com/'},
  {name:'OMRA DISCOUNT',email:'contact@omradiscount.fr',phone:'01 77 37 36 99',website:'https://www.omradiscount.fr/',source:'https://www.omradiscount.fr/omra/agence-omra-paris'},
];
try {
  const sql=neon(process.env.DATABASE_URL);
  const verified=[];
  for(const contact of contacts){
    const response=await fetch(contact.source,{redirect:'error',signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error('source_unavailable');
    const html=(await response.text()).toLowerCase();
    const emailPresent=html.includes(contact.email);
    const phonePresent=html.replace(/[^0-9]/g,'').includes(contact.phone.replace(/[^0-9]/g,'')) || html.includes(contact.phone);
    if(!emailPresent||!phonePresent)throw new Error('contact_unconfirmed');
    verified.push(contact);
  }
  const pending=await sql`SELECT id,source_url FROM items WHERE category='hajj' AND status='pending'`;
  console.log(JSON.stringify({officialContactsVerified:verified.length,pendingOffers:pending.length,mode:process.argv.includes('--apply')?'apply':'dry_run'}));
  if(process.argv.includes('--apply')){
    for(const contact of verified){
      await sql`INSERT INTO partners(name,email,phone,website,source_url,status,verified_at,commission_rate,agreement_status)
        SELECT ${contact.name},${contact.email},${contact.phone},${contact.website},${contact.source},'verified',now(),0,'unconfirmed'
        WHERE NOT EXISTS(SELECT 1 FROM partners WHERE lower(email)=lower(${contact.email}))`;
    }
    // Archive unresolved commercial offers without deleting them or inventing terms.
    // Each snapshot preserves the original data for administrative restoration.
    for(const item of pending){
      const source=verified.find(contact=>new URL(contact.source).hostname===new URL(item.source_url || 'https://invalid.example').hostname);
      const partner=source?(await sql`SELECT id FROM partners WHERE lower(email)=lower(${source.email}) AND status='verified' LIMIT 1`)[0]:null;
      const patch={audit:{at:new Date().toISOString(),reason:'Conditions complètes de cette offre non confirmées : archivée sans suppression',officialContactVerified:!!partner},...(partner?{partnerId:partner.id}: {})};
      await sql`WITH prior AS (SELECT * FROM items WHERE id=${item.id}::uuid AND status='pending' FOR UPDATE), changed AS (
        UPDATE items SET status='expired',updated_at=now(),metadata=items.metadata || ${JSON.stringify(patch)}::jsonb FROM prior WHERE items.id=prior.id RETURNING items.*
      ) INSERT INTO agent_item_history(item_id,action,actor,before_snapshot,after_snapshot,reasons)
        SELECT changed.id,'archive','audit:hajj-official-contacts',to_jsonb(prior),to_jsonb(changed),'["offer_terms_unconfirmed"]'::jsonb FROM changed JOIN prior USING(id)`;
    }
    console.log(JSON.stringify({completed:true,publication:false,personalDataDeleted:false}));
  }
} catch {console.error('Vérification des contacts ou écriture échouée ; aucune publication autorisée.');process.exitCode=1;}
