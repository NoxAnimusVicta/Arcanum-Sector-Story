import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = path.resolve(import.meta.dirname, '..');
const source = fs.readFileSync(path.join(root, 'private/campaign/full-story-log.md'), 'utf8');
const clean = s => s.replace(/\*\*/g, '').replace(/★NEW/g, '').trim();
function table(heading) {
  const start = source.indexOf(heading);
  if (start < 0) throw Error(`Missing source section: ${heading}`);
  const section = source.slice(start + (heading.startsWith('|') ? 0 : heading.length)).split(/\n#{1,4} /)[0];
  const rows = section.split('\n').filter(l => l.startsWith('|')).map(l => l.split('|').slice(1,-1).map(clean));
  return rows.slice(2);
}
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const record = (id,name,summary,details={},status='') => ({id,name,summary,details,status});
const techniques = [];
for(const [name,status,notes] of table('| Shape | Status | Notes |')) {
 if(name==='Sword/Blade')continue;
 techniques.push({...record(slug(name),name,notes.split(';')[0],{'Capability':notes},status),category:'Swarm Forms',icon:'⬡'});
}
for (const [heading,category,icon] of [
  ['### Elemental Techniques','Elemental','◈'],
  ['### Combat Enhancement','Combat','◇'],
  ['### Advanced Techniques','Advanced','⌁']
]) {
  for (const [name,status,notes] of table(heading)) {
    if (name === 'Plasma Bolt (extended range)') continue;
    techniques.push({...record(slug(name),name,notes.split(';')[0],{'Capability': notes},status),category,icon});
  }
}
// Current projections supersede historical resource costs, without awarding new mastery.
const current = table('### Power Projections');
const aliases = {'Nanite Railgun (Mk II)':'Nanite Railgun (Mk II)','Sprint Superman Punch (10m)':'Sprint Superman Punch (10m)','Standing Flurry (4.2s)':'Standing Flurry','Plasma bolt':'Plasma — Bolt','Electrical arc':'Electrical Arc','EMP (directed)':'EMP — Localised Directed','Water tendril':'Water — Multi-Tendril (×2)','Air blast':'Air — Blast','Infrasound':'Acoustic — Infrasound','Contact discharge':'Contact Discharge','Internal voice':'Acoustic — Internal Voice','Nanite sword':'Nanite Sword','Clothing tendrils (×4)':'Clothing Tendrils (×4)'};
for (const [name,output,cost,notes] of current) {
  let t = techniques.find(x => x.name === (name==='Nanite Gauntlet Strike'?'Nanite Gauntlets':aliases[name]));
  if (!t && ['Rock Pillar Launch','Magnetic Corridor Mass-Launch','Nanite Gauntlet Strike','Soldier Enhancement'].includes(name)) {
    t={...record(slug(name),name,output,{},'Demonstrated'),category:'Swarm Operations',icon:'⬡'}; techniques.push(t);
  }
  if(t) { t.summary=output; t.details={'Current Capability':output,'Practical Limits & Context':notes,'Energy':cost === '~negligible' ? 'Negligible fraction of the current swarm reserve.' : `${cost} of reserves in the recorded engagement.`}; }
}
// Historical rows retain their method, but old recharge/output estimates are not current limits.
for(const t of techniques) if(t.details.Capability) t.details={'Recorded Technique':t.details.Capability,'Current Energy Context':'Early training measurements. At the Day 27 swarm scale, existing techniques use negligible fractions of reserves. Recorded delivery and cognitive limits still matter.'};
const deployments = table('#### Current Tactical Deployment');
const bodies = table('### Progenitor Physical Bodies').filter(r=>r.length===7);
const roles = ['Coordinator & historian','Intelligence','Infrastructure & logistics','Daughter · aerial overwatch','Intelligence & archives','Analysis','Security','Tactical command','Quartermaster & counsel'];
const people = bodies.map(([name,appearance,age,height,eyes,voice,distinguishing],i)=> {
  const dep=deployments.find(r=>r[0]===name);
  if(name==='Lumen') appearance='Caucasian female with long hair, currently white to match Father following the broadcast. Colour can change with emotion.';
  return {...record(slug(name),name,roles[i],{'Current Assignment':dep?.[2],'Appearance':appearance,'Apparent Age':age,'Embodiment':'Nanite body activated 18 May 2028. Chronological age is distinct from apparent age.','Height':height,'Eyes':eyes,'Voice':voice,'Distinguishing Features':distinguishing},dep?.[3]),group:'Progenitors',location:dep?.[1]};
});
people.push(
 {...record('selkirk','Graeme Selkirk','Brigadier · Australian ally',{'Current Circumstances':'Abandoned the Liaison Programme and sided with the protagonist. Australian personnel rearmed with nanite-enhanced weapons.','Appearance':'Tall, approximately 188 cm; close-cropped grey hair, weathered face.','Age':'Not recorded. 31 years of service.','Voice':'Queensland accent tempered by international service.'},'Allied'),group:'Contacts'},
 {...record('halcott','Corrin Halcott','WARTOOTH intermediary',{'Current Circumstances':'Executed Kessith after the false gate transit was exposed. Provisional ally, quartered separately with six soldiers. Their seven alien weapons remain in their possession.','Background':'From Tennant Creek; former jackaroo. Twelve years as Kessith’s intermediary.','Age':'Not explicitly recorded.'},'Provisional ally'),group:'Contacts',location:'Level 4'},
 {...record('captive-operative','Reptilian Operative','Captured field operative',{'Current Circumstances':'Interrogation continuing with Tenzin, Axiom and Sable. Mandible reset for speech.','Appearance':'Grey-brown scales, amber slit pupils; approximately 110 kg.','Age':'91 years on Earth; total age not established.'},'Captive'),group:'Contacts',location:'Level 12'},
 {...record('kessith','Kessith','Reptilian · Artisan caste',{'History':'Executed by Halcott at approximately 8:42 PM. Molecular autopsy continuing on Level 30.','Age':'800+ years of operational memory.'},'Deceased'),group:'Contacts',location:'Level 30'}
);
const inventory = table('### Gear / Inventory').map(([name,summary,location])=>({...record(slug(name),name,summary,{'Location':location}),group:location.includes('on person')?'On You':location.includes('Level 1')?'Level 1':'Level 3 Garage'}));
inventory.push(
 {...record('nanite-outfit','Nanite Outfit','White coat, shirt, jeans, gloves and boots',{'Appearance':'High cylindrical collar, bone-white fabric and gold heptagonal outlines. Glove circuitry appears when channelling energy.','Properties':'Self-cleaning nanite construction. Body and clothing allocation combined: approximately 80 trillion nanites.','History':'Current design adopted 21 May.'},'Worn'),group:'On You'},
 {...record('hilux','2019 Toyota HiLux','Fuel approximately half a tank',{'Location':'Level 3 garage','Contents':'Pelican hardcase; partial bottle of water. Personal groceries exhausted 23 May.'}),group:'Level 3 Garage'},
 {...record('rations','Combat Ration Packs','Approximately 400 packs',{'Provenance':'Recovered military supplies, inventoried by Calyx on 25 May.','Planning':'Further provisioning required for the enlarged population.'}),group:'Base Stores'},
 {...record('water','Recovered Water','60 litres plus canteens',{'Provenance':'Recovered military supplies. Level 14 springs exist; potable-water processing has not been separately logged.'}),group:'Base Stores'},
 {...record('wartooth','WARTOOTH','Captured 15 m × 8 m alien craft',{'Status':'Secured in Level 2 vehicle bay. Known flight speed: Mach 1.4.','Provenance':'Arrived with Halcott, six soldiers and Kessith on 25 May.'}),group:'Level 2 Vehicle Bay'}
);
const projects = [
 record('defences','Uluru Defence','Prepare for a possible Annunaki response',{'Next Step':'Player decision on defensive priorities.','Constraints':'Composition, arrival time and approach are unknown. The recorded assessment is minutes to hours, not a confirmed countdown.'},'Immediate'),
 record('prisoners','Prisoner Disposition','74 prisoners on Level 5',{'Contact':'Revenant guards the junction; Pallas is available.','Next Step':'Decide their status and arrangements.'},'Decision Needed'),
 record('alien-weapons','Alien Weapons','Seven weapons remain with Halcott’s group',{'Location':'Level 4','Next Step':'Decide custody and handling.'},'Decision Needed'),
 record('provisions','Provisioning','Sustain the expanded population',{'Current Supplies':'Approximately 400 ration packs and 60 litres of water plus canteens.','Next Step':'Establish further food and water supply.'},'Ongoing'),
 record('relay','Alcubierre Relay','Candidate C under development',{'Current Work':'Triple-layered, self-sustaining toroid. Data and energy relay research remains the critical path.','Estimate':'Days to approximately one week in the source; not a completion promise.','Dependency':'Dyson mesh and concentrated high-output energy applications depend on this breakthrough.'},'Research'),
 record('genome','Genomic Mapping','Approximately 62% mapped',{'Current Work':'Investigating dormant non-baseline sequences and containment architecture.','Next Step':'Complete mapping before considering intervention. Origin remains unknown.'},'Research'),
 record('archives','Reptilian Archives','Approximately 60% decoded',{'Contact':'Tenzin','Current Work':'Decoding and cross-analysis continue.'},'Research'),
 record('matrioshka','Matrioshka Shell 1','Construction at approximately 60 km depth',{'Current Work':'Lateral upper-mantle construction with early geothermal generation. Deeper bores continue.'},'Construction'),
 record('autopsy','Kessith Autopsy','Molecular analysis on Level 30',{'Current Work':'First complete Reptilian specimen under unrestricted analysis.'},'Ongoing'),
 record('broadcast','Global Broadcast','Completed at approximately 9:49 PM',{'Result':'3 minutes 41 seconds. Alien control exposed, war declared, Uluru location transmitted. Infrastructure returned intact.'},'Complete'),
 record('migration','Uluru Migration','All nine Progenitors hosted locally',{'Result':'Migration completed 19 May, approximately 4:28 AM. Former Norway hardware wiped.'},'Complete')
];
const places = [
 record('uluru','Uluru Complex','312 excavated levels · approximately 117 personnel',{'Current State':'Facades sealed. Surface cleared. Interior expansion continues.','Current Position':'Protagonist at Level 14 springs; Lumen on aerial overwatch.'}),
 ...[['level-2','Level 2','Vehicle bay','Captured aircraft, vehicles and WARTOOTH; Marcheur oversees intake.'],['level-3','Level 3','Garage','HiLux and hardcase stored here.'],['level-4','Level 4','Allied quarters','Halcott and six soldiers in a separate room.'],['level-5','Level 5','Prisoner section','74 prisoners. Revenant guards the junction.'],['level-12','Level 12','Interrogation','Captive operative with Tenzin, Axiom and Sable.'],['level-14','Level 14','Spring system','Current protagonist location at the end of the broadcast.'],['level-30','Level 30','Autopsy','Kessith’s remains undergoing molecular examination.']].map(([id,name,summary,detail])=>({...record(id,name,summary,{'Current Circumstances':detail}),parentId:'uluru'}))
];
const events = [
 ['conversion','28–29 April','Conversion Begins','Day 1 of the recorded conversion. The original history is retained in the story tracker.'],
 ['bodies','18 May · ~7:30 PM','The Progenitors Take Form','All nine Progenitors receive physical nanite bodies. White hair and gold irises become the protagonist’s current appearance.'],
 ['migration','19 May · ~4:28 AM','Home Beneath Uluru','Server migration completes; Norway hardware is wiped and orbital assets are recalled.'],
 ['wardrobe','21 May','White & Gold','The protagonist’s nanite wardrobe is redesigned with its high collar and luminous gold heptagons.'],
 ['modifications','22 May','Embodiment Refined','Approved Progenitor modifications take effect. Chip-to-organ conversion is complete by approximately Day 24.'],
 ['first-contact','25 May · ~8:15–8:28 PM','First Contact','Selkirk changes sides. Reptilian identities are exposed. Australian soldiers are enhanced; the hybrid is launched once, around 8:27 PM. War is declared.'],
 ['wartooth','25 May · ~8:36–8:42 PM','WARTOOTH Arrives','Halcott’s claimed gate transit is exposed as a simulation. He executes Kessith and becomes a provisional ally.'],
 ['aircraft','25 May · ~8:42–9:04 PM','The Sky Is Secured','Aircraft are grounded and crews recovered without deaths. Vehicles are brought into the complex.'],
 ['city','25 May · ~9:04–9:45 PM','A City Below the Stone','Housing, gyms, commissary and spring access take shape. The captive’s interrogation continues.'],
 ['broadcast','25 May · ~9:45–9:49 PM','The Broadcast','Alien control is exposed worldwide in 112+ languages. Uluru’s location is transmitted. All nine Progenitors affirm their support. Lumen turns her hair white. The scene remains here.']
].map(([id,date,name,summary])=>({...record(`event-${id}`,name,summary),date}));
const data = {
 schemaVersion:1, recordedThrough:'arcanum-2028-05-25-broadcast-complete',
 snapshot:{date:'2028-05-25',localTime:'21:49',approximate:true,day:27,label:'25 May 2028 · ~9:49 PM',location:'Uluru · Level 14',event:'The Broadcast',sourceSha256:crypto.createHash('sha256').update(source).digest('hex')},
 character:{name:'Protagonist',designation:'Prometheus',species:'Homo Superior',age:28,height:'165 cm',condition:'Fully healed',portrait:'./art/protagonist.jpg',appearance:'Bone-white hair. Gold irises. A white, high-collared nanite coat traced with luminous gold heptagons.',summary:'The broadcast is over. The world knows. Beneath Uluru, the complex is sealed and the nine Progenitors hold their positions.',energy:89.7,reinforcement:34,shoulderReinforcement:'38–40%',swarm:'~8.4 × 10¹⁹',sensing:'14 km',orbital:'None deployed',conversion:'Organic integration complete'},
 techniques,inventory,people,projects,places,events,
 accounts:[['cash','Cash On Hand','~$323.30','AUD · carried in wallet'],['bank','Personal Bank','~$4,319','AUD · last recorded balance'],['business','Meridian Code','~$53,788','AUD · business funds; includes compliance reserves'],['trading','Trading Account','~$62,400','AUD · estimated value'],['cluster','Cluster Funds','~$330,000','AUD · organisational estimate, separate from personal money']].map(([id,name,summary,note])=>record(id,name,summary,{'Context':note})),
 sourceNotes:['Current state is a curated projection of the reconciled story tracker. The original transcript is unavailable.','Historical technique measurements are preserved as context; no new mastery tiers or training gains were assigned.','Later reaction reports at approximately 10:00 and 10:09 PM are beyond this checkpoint and excluded.','The galaxy map is an authorial setting reference, not a statement of character knowledge.']
};
fs.mkdirSync(path.join(root,'public'),{recursive:true});
fs.writeFileSync(path.join(root,'public/campaign.json'),JSON.stringify(data,null,2)+'\n');
console.log(`Exported ${techniques.length} techniques, ${people.length} people, ${inventory.length} items, ${events.length} story milestones.`);
