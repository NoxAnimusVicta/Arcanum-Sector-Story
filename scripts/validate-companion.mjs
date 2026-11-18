import fs from 'node:fs';
import assert from 'node:assert/strict';
const data=JSON.parse(fs.readFileSync(new URL('../public/campaign.json',import.meta.url)));
assert.equal(data.snapshot.localTime,'21:49');
assert.equal(data.recordedThrough,'arcanum-2028-05-25-broadcast-complete');
for(const key of ['techniques','people','places','inventory','projects','events','accounts']){
 const ids=data[key].map(x=>x.id);assert.equal(ids.length,new Set(ids).size,`Duplicate IDs in ${key}`);
 for(const r of data[key])assert(r.name&&r.summary,`Missing summary in ${key}/${r.id}`);
}
assert(data.people.find(p=>p.id==='lumen').location.includes('3,000'));
assert(data.people.find(p=>p.id==='axiom').location.includes('12'));
assert.equal(data.character.energy,89.7);
assert(!JSON.stringify(data).includes('DEFCON'));
assert(data.events.every(e=>e.summary.length<600));
assert.equal(data.events.at(-1).id,'event-broadcast');
for(const p of data.places)if(p.parentId)assert(data.places.some(x=>x.id===p.parentId));
assert(fs.existsSync(new URL('../public/art/protagonist.jpg',import.meta.url)));
const manifest=JSON.parse(fs.readFileSync(new URL('../public/app.webmanifest',import.meta.url)));
assert.equal(manifest.display,'standalone');
assert(manifest.start_url.startsWith('./'));
for(const icon of manifest.icons)assert(fs.existsSync(new URL('../public/'+icon.src,import.meta.url)));
console.log('Campaign invariants, chronology, summary limits, references and install assets pass.');
