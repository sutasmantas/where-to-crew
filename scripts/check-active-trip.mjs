import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const config = fs.readFileSync(path.join(root, 'assets/config.js'), 'utf8');
const active = /var ACTIVE\s*=\s*'([^']+)'/.exec(config)?.[1];
if (!active) throw new Error('Set ACTIVE in assets/config.js');
const read = name => fs.readFileSync(path.join(root, active, name), 'utf8');
const pages = {signup: read('sign-up.html'), draft: read('plan-draft.html'), plan: read('plan.html')};
const failures = [];
function requireText(ok, message) { if (!ok) failures.push(message); }
function has(page, pattern, message) { requireText(pattern.test(page), message); }

const facts = fs.readFileSync(path.join(root, 'assets/trip-facts.js'), 'utf8');
has(facts, new RegExp('\\b' + active + '\\s*:\\s*\\{'), `${active}: add sourced prices and routes to assets/trip-facts.js`);
for (const [name, html] of Object.entries(pages)) {
  const configAt = html.indexOf('src="../assets/config.js');
  const storeAt = html.indexOf('src="../assets/store.js');
  requireText(configAt >= 0 && storeAt > configAt, `${active}/${name}: load config before store (trip namespace)`);
  has(html, /src="\.\.\/assets\/crew\.js(?:\?|\")/, `${active}/${name}: load shared crew code`);
  has(html, /src="\.\.\/assets\/trip-tools\.js(?:\?|\")/, `${active}/${name}: load trip invitation code`);
  has(html, /data-share-trip/, `${active}/${name}: add an invitation button`);
  has(html, /crewSuggestions/, `${active}/${name}: show crew suggestions`);
  const behavior = name === 'draft' ? html + fs.readFileSync(path.join(root, 'assets/plan-draft-' + active + '.js'), 'utf8') : html;
  has(behavior, /CREW\.onChange/, `${active}/${name}: refresh when remote suggestions arrive`);
}
has(pages.draft, /src="\.\.\/assets\/trip-facts\.js(?:\?|\")/, 'draft: load sourced trip facts');
has(pages.plan, /src="\.\.\/assets\/trip-facts\.js(?:\?|\")/, 'plan: load sourced trip facts');
has(pages.draft, /WTC_sharePlan|src="\.\.\/assets\/share\.js(?:\?|\")/, 'draft: provide plan sharing');
has(pages.plan, /WTC_sharePlan/, 'plan: provide plan sharing');
has(pages.draft, /<img[^>]+src=/, 'draft: show useful comparison photos');
has(pages.draft, /<figcaption[^>]*>[^<]*[\s\S]*?href="https:/, 'draft: credit comparison photos with source links');
has(pages.plan, /sources\.[A-Za-z]+/, 'plan: link first-party evidence and bookings');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log(`Active trip ${active}: shared visibility, invitation, sources and photo checks passed.`);
