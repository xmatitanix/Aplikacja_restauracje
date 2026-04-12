#!/usr/bin/env node
/**
 * SETLOG — Event Sync z Ticketmaster Discovery API
 *
 * Jak używać:
 *   1. Skopiuj .env.example do .env i wpisz swój klucz API
 *      cp scripts/.env.example scripts/.env
 *   2. Odpal skrypt:
 *      node scripts/sync-events.js
 *   3. Commituj wygenerowany plik:
 *      git add data/fetched-events.ts
 *      git commit -m "sync: ticketmaster events $(date +%Y-%m-%d)"
 *      git push -u origin claude/dj-rating-mobile-app-FQx3w
 *
 * Klucz API (darmowy):
 *   https://developer.ticketmaster.com → Sign Up → My Apps → API Key
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ─── Wczytaj .env ────────────────────────────────────────────────────────────

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('\n❌  Brak pliku scripts/.env');
  console.error('   Skopiuj: cp scripts/.env.example scripts/.env');
  console.error('   I wpisz swój klucz API z developer.ticketmaster.com\n');
  process.exit(1);
}
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

const TM_API_KEY = process.env.TM_API_KEY;
if (!TM_API_KEY || TM_API_KEY === 'wpisz_tutaj_swoj_klucz') {
  console.error('\n❌  TM_API_KEY nie jest ustawiony w scripts/.env\n');
  process.exit(1);
}

// ─── Konfiguracja ────────────────────────────────────────────────────────────

const CITIES = [
  { name: 'Warsaw',   id: 'warszawa'  },
  { name: 'Krakow',   id: 'krakow'   },
  { name: 'Wroclaw',  id: 'wroclaw'  },
  { name: 'Gdansk',   id: 'gdansk'   },
  { name: 'Poznan',   id: 'poznan'   },
  { name: 'Lodz',     id: 'lodz'     },
  { name: 'Katowice', id: 'katowice' },
];

// Mapowanie gatunków Ticketmaster → gatunki aplikacji
const GENRE_MAP = {
  'Electronic':       'Electronic',
  'Dance/Electronic': 'Electronic',
  'House':            'House',
  'Techno':           'Techno',
  'Drum & Bass':      'Drum & Bass',
  'Jungle':           'Jungle',
  'Liquid':           'Liquid',
  'Industrial':       'Industrial',
  'EBM':              'EBM',
  'Club Music':       'Club Music',
  'Breaks':           'Breaks',
  'Ambient':          'Electronic',
  'Trance':           'Electronic',
  'Minimal':          'Minimal',
  'Hard Techno':      'Hard Techno',
  'Disco':            'Disco',
  'UK Bass':          'UK Bass',
  'Electro':          'Electro',
  'Experimental':     'Experimental',
  'Noise':            'Noise',
  'EBM/Industrial':   'Industrial',
  'Dark Ambient':     'Dark Ambient',
};

// ─── Pomocnicze funkcje ───────────────────────────────────────────────────────

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Błąd parsowania JSON: ' + e.message)); }
      });
    }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function mapGenres(classifications = []) {
  const genres = new Set();
  for (const c of classifications) {
    const sub   = c.subGenre?.name;
    const genre = c.genre?.name;
    if (sub   && sub   !== 'Undefined' && GENRE_MAP[sub])   genres.add(GENRE_MAP[sub]);
    if (genre && genre !== 'Undefined' && GENRE_MAP[genre]) genres.add(GENRE_MAP[genre]);
  }
  if (genres.size === 0) genres.add('Electronic');
  return [...genres].slice(0, 3);
}

function mapEvent(e, cityId) {
  const venue = e._embedded?.venues?.[0];
  if (!venue) return null;

  const date = e.dates?.start?.localDate;
  if (!date) return null;

  const rawTime = e.dates?.start?.localTime;
  const startTime = rawTime ? rawTime.slice(0, 5) : '22:00';

  return {
    id:           `tm_${e.id}`,
    djName:       e.name,
    venueName:    venue.name,
    venueAddress: venue.address?.line1 ?? undefined,
    city:         cityId,
    date,
    startTime,
    genres:       mapGenres(e.classifications),
    description:  e.info ?? undefined,
    ratingData: {
      count:            0,
      avgOverall:       0,
      energyArcDist:    { flat: 0, building: 0, peak: 0, rollercoaster: 0, afterburner: 0 },
      avgSelectionStyle: 0,
      avgMixQuality:    0,
      avgCrowdSync:     0,
      wouldReturnPct:   0,
      tagCounts:        {},
      presentPct:       0,
      consensusScore:   0,
      ageGroupDist:     {},
    },
    createdAt: Date.now(),
  };
}

async function fetchCityEvents(cityName, cityId) {
  const now = new Date();
  const end = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    apikey:             TM_API_KEY,
    countryCode:        'PL',
    city:               cityName,
    classificationName: 'Electronic',
    startDateTime:      now.toISOString().split('.')[0] + 'Z',
    endDateTime:        end.toISOString().split('.')[0] + 'Z',
    size:               '50',
    sort:               'date,asc',
  });

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params}`;

  try {
    const data = await fetchJson(url);
    if (data.fault) {
      console.warn(`  ⚠️  API error: ${data.fault.faultstring}`);
      return [];
    }
    const events = data._embedded?.events ?? [];
    return events.map((e) => mapEvent(e, cityId)).filter(Boolean);
  } catch (err) {
    console.warn(`  ⚠️  Błąd dla ${cityName}: ${err.message}`);
    return [];
  }
}

// ─── Generowanie TypeScript ───────────────────────────────────────────────────

function val(v) {
  if (v === undefined) return 'undefined';
  return JSON.stringify(v);
}

function eventToTs(e) {
  const lines = [
    `    id: ${val(e.id)},`,
    `    djName: ${val(e.djName)},`,
    e.venueAddress ? `    venueAddress: ${val(e.venueAddress)},` : null,
    `    venueName: ${val(e.venueName)},`,
    `    city: '${e.city}',`,
    `    date: '${e.date}',`,
    `    startTime: '${e.startTime}',`,
    `    genres: ${JSON.stringify(e.genres)},`,
    e.description ? `    description: ${val(e.description)},` : null,
    `    ratingData: {`,
    `      count: 0, avgOverall: 0,`,
    `      energyArcDist: { flat: 0, building: 0, peak: 0, rollercoaster: 0, afterburner: 0 },`,
    `      avgSelectionStyle: 0, avgMixQuality: 0, avgCrowdSync: 0,`,
    `      wouldReturnPct: 0, tagCounts: {}, presentPct: 0, consensusScore: 0, ageGroupDist: {},`,
    `    },`,
    `    createdAt: ${e.createdAt},`,
  ].filter(Boolean).join('\n');

  return `  {\n${lines}\n  }`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🎵  SETLOG — Ticketmaster Event Sync\n');

  const allEvents = [];

  for (const city of CITIES) {
    process.stdout.write(`  ${city.name.padEnd(12)}`);
    const events = await fetchCityEvents(city.name, city.id);
    console.log(`${events.length} eventów`);
    allEvents.push(...events);
    await sleep(250); // rate limiting
  }

  // Deduplikacja po id
  const unique = [...new Map(allEvents.map((e) => [e.id, e])).values()];
  unique.sort((a, b) => a.date.localeCompare(b.date));

  console.log(`\n  Łącznie: ${unique.length} unikalnych eventów`);

  const outputPath = path.join(__dirname, '..', 'data', 'fetched-events.ts');
  const content = [
    `// AUTO-GENERATED — nie edytuj ręcznie`,
    `// Ostatnia synchronizacja: ${new Date().toISOString()}`,
    `// Źródło: Ticketmaster Discovery API (countryCode=PL, classificationName=Electronic)`,
    `// Aby odświeżyć: node scripts/sync-events.js`,
    `import { DJEvent } from '../types';`,
    ``,
    `export const FETCHED_EVENTS: DJEvent[] = [`,
    unique.length > 0 ? unique.map(eventToTs).join(',\n') : '  // brak wyników — sprawdź klucz API',
    `];`,
    ``,
  ].join('\n');

  fs.writeFileSync(outputPath, content, 'utf8');

  console.log(`\n✅  Zapisano → data/fetched-events.ts`);
  console.log('\n   Następny krok — commituj i pushuj:');
  console.log('   git add data/fetched-events.ts');
  console.log(`   git commit -m "sync: ticketmaster ${new Date().toISOString().slice(0, 10)}"`);
  console.log('   git push -u origin claude/dj-rating-mobile-app-FQx3w\n');
}

main().catch((err) => {
  console.error('\n❌  Błąd:', err.message);
  process.exit(1);
});
