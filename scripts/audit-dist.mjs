import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../dist');
const allowed=/^(index\.html|campaign\.json|app\.webmanifest|art\/protagonist\.jpg|icons\/(apple-touch-icon\.png|icon(-192\.png|-512\.png|\.svg))|assets\/[a-zA-Z0-9_-]+\.(js|css))$/;
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
const files=walk(root);
for(const file of files){const rel=path.relative(root,file).replaceAll('\\','/');assert(allowed.test(rel),`Unexpected deployment file: ${rel}`);if(/\.(js|json|html|css)$/.test(rel)){const content=fs.readFileSync(file,'utf8');assert(!content.includes('Money Laundering Pipeline'),`Full log content leaked: ${rel}`);assert(!content.includes('### Day 1 — April 28'),`Full history leaked: ${rel}`);assert(!content.includes('sourceMappingURL'),`Source map reference: ${rel}`)}}
const data=JSON.parse(fs.readFileSync(path.join(root,'campaign.json')));assert(data.events.every(e=>e.summary.length<600));
console.log(`Deployment allowlist passed: ${files.length} files. Concise chronicle only; no full log or source maps.`);
