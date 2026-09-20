import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets', 'next-trips.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context, { filename: 'assets/next-trips.js' });
const trips = context.window.NEXT_TRIPS;

const required = [
  'id', 'place', 'title', 'strap', 'unique', 'image', 'imageAlt', 'credit',
  'creditUrl', 'estimate', 'budget', 'core', 'duration', 'coverage', 'timing', 'season',
  'travel', 'intensity', 'balance', 'risk', 'coreIncludes', 'optional',
  'plan', 'basis', 'sources'
];
const errors = [];

if (!Array.isArray(trips) || !trips.length) errors.push('NEXT_TRIPS is empty or missing');
const seen = new Set();
(trips || []).forEach((trip, index) => {
  required.forEach((key) => {
    if (trip[key] === undefined || trip[key] === null || trip[key] === '') errors.push(`${trip.id || index}: missing ${key}`);
  });
  if (seen.has(trip.id)) errors.push(`${trip.id}: duplicate id`);
  seen.add(trip.id);
  if (index && trips[index - 1].budget > trip.budget) errors.push(`${trip.id}: choices are not ordered by budget`);
  if (!Array.isArray(trip.plan) || trip.plan.length < 3) errors.push(`${trip.id}: activity plan needs at least 3 steps`);
  const statedDays = Number(String(trip.duration).match(/^\d+/)?.[0]);
  const plannedDays = new Set((trip.plan || []).flatMap((step) => [...String(step).matchAll(/Day (\d+)/g)].map((match) => Number(match[1]))));
  if (statedDays < 4) errors.push(`${trip.id}: trips must last at least four days`);
  if (!statedDays || plannedDays.size !== statedDays || Math.max(...plannedDays) !== statedDays) {
    errors.push(`${trip.id}: day-by-day plan does not account for all ${statedDays || '?'} stated days`);
  }
  if (!Array.isArray(trip.sources) || trip.sources.length < 2) errors.push(`${trip.id}: needs at least 2 evidence or booking links`);
  (trip.sources || []).forEach((entry) => {
    if (!Array.isArray(entry) || !entry[0] || !/^https:\/\//.test(entry[1] || '')) errors.push(`${trip.id}: invalid source entry`);
  });
  if (!/^https:\/\//.test(trip.creditUrl || '')) errors.push(`${trip.id}: invalid photo credit link`);
  const imagePath = path.resolve(root, 'next', trip.image.split('?')[0]);
  if (!imagePath.startsWith(root + path.sep) || !fs.existsSync(imagePath)) errors.push(`${trip.id}: missing local image ${trip.image}`);
});

const page = fs.readFileSync(path.join(root, 'next', 'index.html'), 'utf8');
for (const id of ['tripGrid', 'candidateCount', 'heroCandidateCount', 'compareCount', 'voteForm', 'resultsList']) {
  if (!page.includes(`id="${id}"`)) errors.push(`next/index.html: missing #${id}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const buckets = {
  under600: trips.filter((t) => t.budget < 600).length,
  from600to899: trips.filter((t) => t.budget >= 600 && t.budget < 900).length,
  over900: trips.filter((t) => t.budget >= 900).length
};
console.log(JSON.stringify({ choices: trips.length, uniqueIds: seen.size, buckets, checkedFieldsPerChoice: required.length }, null, 2));
