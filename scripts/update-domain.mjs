import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const raw = process.argv[2];
if (!raw) { console.error('Usage: node scripts/update-domain.mjs https://example.com/'); process.exit(1); }
const url = new URL(raw);
if (!['https:', 'http:'].includes(url.protocol) || url.search || url.hash || url.username || url.password) throw new Error('Use a public HTTP(S) site URL without query, hash or credentials.');
url.pathname = url.pathname.replace(/\/+$/, '') + '/';
const next = url.href;
const old = readFileSync(resolve(root, 'index.html'), 'utf8').match(/<link\s+href="([^"]+)"\s+rel="canonical"/i)?.[1];
if (!old) throw new Error('Current canonical URL not found.');
for (const name of ['index.html','frontend/locales/ua/index.html','frontend/locales/en/index.html','robots.txt','sitemap.xml']) {
  const path=resolve(root,name);
  let text=readFileSync(path,'utf8').split(old).join(next);
  if(name==='robots.txt') text=text.replace(/^Host:.*$/m,`Host: ${url.hostname}`);
  writeFileSync(path,text);
}
const fallbackPath=resolve(root,'404.html');
const previousPath=new URL(old).pathname;
let fallback=readFileSync(fallbackPath,'utf8');
fallback=fallback.replace(`path.startsWith('${previousPath}')?'${previousPath}':'/'`, `path.startsWith('${url.pathname}')?'${url.pathname}':'/'`);
writeFileSync(fallbackPath,fallback);
console.log(`SEO updated: ${next}`);
