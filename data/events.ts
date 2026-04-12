import { City, CityFact, CityId, DJEvent } from '../types';

export const CITIES: City[] = [
  {
    id: 'warszawa',
    name: 'WARSZAWA',
    description: 'Stolica nocnego życia',
    sceneNote: 'Smolna, Jasna 1, Luzztro, Powiększenie',
  },
  {
    id: 'krakow',
    name: 'KRAKÓW',
    description: 'Underground pełen historii',
    sceneNote: 'Hevre, Świteź, Forum Przestrzenie',
  },
  {
    id: 'wroclaw',
    name: 'WROCŁAW',
    description: 'Techno ze Śląska',
    sceneNote: 'Hype Park, Zakład, Bezsenność',
  },
  {
    id: 'gdansk',
    name: 'GDAŃSK',
    description: 'Port i puls Trójmiasta',
    sceneNote: 'B90, Protokultura, Młode Miasto',
  },
  {
    id: 'poznan',
    name: 'POZNAŃ',
    description: 'Scena z charakterem',
    sceneNote: 'Meskalina, Dragon, Pewex',
  },
  {
    id: 'lodz',
    name: 'ŁÓDŹ',
    description: 'Fabryczna energia',
    sceneNote: 'Wytwórnia, YES, Klub Fabryczny',
  },
  {
    id: 'katowice',
    name: 'KATOWICE',
    description: 'Górnośląski hardcore',
    sceneNote: 'Mega Club, Strefa, Arras',
  },
];

export const CITY_FACTS: CityFact[] = [
  {
    cityId: 'warszawa',
    fact: 'Smolna jest uznawana za jeden z najlepszych klubów techno w Europie Wschodniej według Resident Advisor.',
    stat: '12 klubów w promieniu 2 km',
  },
  {
    cityId: 'krakow',
    fact: 'Forum Przestrzenie to dawna kawiarnia Hotelu Forum — jeden z najbardziej instagramowalnych klubów w Polsce.',
    stat: 'Scena aktywna od 1993 roku',
  },
  {
    cityId: 'wroclaw',
    fact: 'Hype Park działa całą dobę podczas wybranych imprez i jest jedynym tak dużym outdoor w Polsce.',
    stat: 'Pojemność Hype Park: 5000 osób',
  },
  {
    cityId: 'gdansk',
    fact: 'B90 mieści się w byłej stoczni — jedno z niewielu miejsc, gdzie można grać do wschodu słońca z widokiem na morze.',
    stat: 'Najdłuższa średnia sesja: 6.2h',
  },
  {
    cityId: 'poznan',
    fact: 'Poznańska scena jest wyjątkowa przez silny wpływ berlińskiego techno — miasto leży w połowie drogi między Warszawą a Berlinem.',
    stat: '~180 km od Berlina',
  },
  {
    cityId: 'lodz',
    fact: 'Wytwórnia to dawna fabryka Izraela Poznańskiego — 120-letnie ceglane mury i akustyka, której nie da się podrobić.',
    stat: 'Pojemność: 3000 osób',
  },
  {
    cityId: 'katowice',
    fact: 'Katowice jest stolicą polskiego heavy metalu i elektroniki — tu odbywa się największy Off Festival w Polsce.',
    stat: 'Off Festival: 20 000 uczestników',
  },
];

export const VIBE_TAGS = [
  'heavy sub',
  'crispy highs',
  'tight transitions',
  'deep cuts',
  'anthems only',
  'genre-defying',
  'crowd pleaser',
  'underground',
  'peak time',
  'slow burn',
  'technical flex',
  'vibes only',
  'raw energy',
  'experimental',
  'crowd control',
  'no mercy',
  'silky smooth',
  'warehouse feel',
];

export const ENERGY_ARCS = [
  {
    id: 'flat' as const,
    label: 'FLAT',
    desc: 'Równy poziom przez cały set',
    shape: '━━━━━',
  },
  {
    id: 'building' as const,
    label: 'BUILDING',
    desc: 'Stopniowe budowanie energii',
    shape: '╱━━━━',
  },
  {
    id: 'peak' as const,
    label: 'PEAK',
    desc: 'Jeden wyraźny szczyt',
    shape: '╱╲━━━',
  },
  {
    id: 'rollercoaster' as const,
    label: 'ROLLERCOASTER',
    desc: 'Góry i doliny, ciągła zmiana',
    shape: '╱╲╱╲╱',
  },
  {
    id: 'afterburner' as const,
    label: 'AFTERBURNER',
    desc: 'Eksplozja na końcu',
    shape: '━━━╱▲',
  },
];

export const MOCK_EVENTS: DJEvent[] = [
  {
    id: 'evt001',
    djName: 'Blawan',
    supportingActs: ['Karenn'],
    venueName: 'Smolna',
    venueAddress: 'ul. Smolna 38, Warszawa',
    city: 'warszawa',
    date: '2026-04-05',
    startTime: '23:00',
    endTime: '08:00',
    genres: ['Techno', 'Industrial', 'UK Bass'],
    description:
      'Blawan, jeden z najbardziej oryginalnych producentów techno ostatnich lat, wraca do Smolnej. Znany z surowego, industrialnego brzmienia i nieprzewidywalnych setów.',
    raUrl: 'https://ra.co',
    ratingData: {
      count: 847,
      avgOverall: 4.6,
      energyArcDist: {
        flat: 12,
        building: 89,
        peak: 234,
        rollercoaster: 412,
        afterburner: 100,
      },
      avgSelectionStyle: 1.4,
      avgMixQuality: 4.2,
      avgCrowdSync: 4.7,
      wouldReturnPct: 94,
      tagCounts: {
        'heavy sub': 689,
        'raw energy': 601,
        'no mercy': 520,
        'warehouse feel': 487,
        'peak time': 445,
        'deep cuts': 234,
        experimental: 198,
        'crowd control': 167,
      },
      presentPct: 61,
      consensusScore: 88,
      ageGroupDist: { '<20': 18, '20-25': 198, '25-30': 342, '30-40': 187, '40+': 44 },
    },
    createdAt: 1743800000,
  },
  {
    id: 'evt002',
    djName: 'Paula Temple',
    venueName: 'Jasna 1',
    venueAddress: 'ul. Jasna 1, Warszawa',
    city: 'warszawa',
    date: '2026-04-12',
    startTime: '00:00',
    endTime: '06:00',
    genres: ['Techno', 'Noise', 'Experimental'],
    description:
      'Paula Temple i jej charakterystyczne połączenie techno z noisem. Pionierka queer techno wraca do stolicy.',
    ratingData: {
      count: 312,
      avgOverall: 4.3,
      energyArcDist: {
        flat: 8,
        building: 45,
        peak: 98,
        rollercoaster: 89,
        afterburner: 72,
      },
      avgSelectionStyle: 1.8,
      avgMixQuality: 4.5,
      avgCrowdSync: 3.9,
      wouldReturnPct: 87,
      tagCounts: {
        experimental: 276,
        'raw energy': 245,
        'heavy sub': 201,
        'crispy highs': 187,
        'no mercy': 156,
      },
      presentPct: 72,
      consensusScore: 74,
      ageGroupDist: { '<20': 8, '20-25': 67, '25-30': 112, '30-40': 89, '40+': 28 },
    },
    createdAt: 1743860000,
  },
  {
    id: 'evt003',
    djName: 'Marcel Dettmann',
    venueName: 'Smolna',
    venueAddress: 'ul. Smolna 38, Warszawa',
    city: 'warszawa',
    date: '2026-03-28',
    startTime: '23:00',
    endTime: '07:00',
    genres: ['Techno', 'Dub Techno'],
    ratingData: {
      count: 1243,
      avgOverall: 4.8,
      energyArcDist: {
        flat: 45,
        building: 312,
        peak: 487,
        rollercoaster: 289,
        afterburner: 110,
      },
      avgSelectionStyle: 0.6,
      avgMixQuality: 4.9,
      avgCrowdSync: 4.8,
      wouldReturnPct: 96,
      tagCounts: {
        'tight transitions': 1102,
        'crowd control': 987,
        'peak time': 856,
        'heavy sub': 789,
        'silky smooth': 712,
        'deep cuts': 456,
        'crowd pleaser': 398,
      },
      presentPct: 54,
      consensusScore: 93,
      ageGroupDist: { '<20': 12, '20-25': 256, '25-30': 487, '30-40': 356, '40+': 89 },
    },
    createdAt: 1743200000,
  },
  {
    id: 'evt004',
    djName: 'KiNK',
    supportingActs: ['DVS1'],
    venueName: 'Hevre',
    venueAddress: 'ul. Miodowa 15, Kraków',
    city: 'krakow',
    date: '2026-04-18',
    startTime: '22:00',
    endTime: '05:00',
    genres: ['Techno', 'House', 'Live'],
    description:
      'KiNK — bułgarski geniusz improwizacji. Każdy set to live performance bez powtórzeń. Legenda Hevre.',
    ratingData: {
      count: 534,
      avgOverall: 4.9,
      energyArcDist: {
        flat: 5,
        building: 67,
        peak: 145,
        rollercoaster: 267,
        afterburner: 50,
      },
      avgSelectionStyle: 1.2,
      avgMixQuality: 4.4,
      avgCrowdSync: 4.6,
      wouldReturnPct: 98,
      tagCounts: {
        'technical flex': 498,
        experimental: 445,
        'raw energy': 389,
        'rollercoaster': 312,
        'crowd control': 287,
        'genre-defying': 267,
      },
      presentPct: 79,
      consensusScore: 91,
      ageGroupDist: { '<20': 23, '20-25': 134, '25-30': 201, '30-40': 145, '40+': 67 },
    },
    createdAt: 1743900000,
  },
  {
    id: 'evt005',
    djName: 'Skudlik',
    venueName: 'Forum Przestrzenie',
    venueAddress: 'ul. Marii Konopnickiej 28, Kraków',
    city: 'krakow',
    date: '2026-04-26',
    startTime: '22:00',
    endTime: '04:00',
    genres: ['Techno', 'Industrial'],
    description:
      'Jeden z najbardziej rozchwytywanych polskich DJ-ów techno. Set z widokiem na Wisłę.',
    ratingData: {
      count: 289,
      avgOverall: 4.4,
      energyArcDist: {
        flat: 12,
        building: 89,
        peak: 112,
        rollercoaster: 56,
        afterburner: 20,
      },
      avgSelectionStyle: 0.8,
      avgMixQuality: 4.6,
      avgCrowdSync: 4.5,
      wouldReturnPct: 91,
      tagCounts: {
        'heavy sub': 256,
        'tight transitions': 234,
        underground: 201,
        'peak time': 187,
        'deep cuts': 145,
      },
      presentPct: 83,
      consensusScore: 85,
      ageGroupDist: { '<20': 34, '20-25': 112, '25-30': 98, '30-40': 45, '40+': 12 },
    },
    createdAt: 1743950000,
  },
  {
    id: 'evt006',
    djName: 'Objekt',
    venueName: 'Hype Park',
    venueAddress: 'ul. Rakietowa 1, Wrocław',
    city: 'wroclaw',
    date: '2026-04-19',
    startTime: '20:00',
    endTime: '06:00',
    genres: ['Techno', 'Club Music', 'Breaks'],
    description:
      'Objekt outdoor na Hype Park — jednym z największych open-air w Polsce. TJ Hertz i jego nieoczekiwane połączenia.',
    ratingData: {
      count: 678,
      avgOverall: 4.7,
      energyArcDist: {
        flat: 23,
        building: 134,
        peak: 278,
        rollercoaster: 198,
        afterburner: 45,
      },
      avgSelectionStyle: 1.6,
      avgMixQuality: 4.3,
      avgCrowdSync: 4.4,
      wouldReturnPct: 92,
      tagCounts: {
        'genre-defying': 589,
        experimental: 512,
        'deep cuts': 445,
        'raw energy': 398,
        'warehouse feel': 356,
        underground: 312,
      },
      presentPct: 67,
      consensusScore: 79,
      ageGroupDist: { '<20': 45, '20-25': 178, '25-30': 234, '30-40': 145, '40+': 45 },
    },
    createdAt: 1743920000,
  },
  {
    id: 'evt007',
    djName: 'Ben Klock',
    venueName: 'B90',
    venueAddress: 'ul. Doki 1, Gdańsk',
    city: 'gdansk',
    date: '2026-03-15',
    startTime: '23:00',
    endTime: '09:00',
    genres: ['Techno', 'Minimal'],
    description:
      'Resident Berghainu na B90. Set z widokiem na stocznię — doświadczenie którego nie zastąpi żadne nagranie.',
    ratingData: {
      count: 934,
      avgOverall: 4.8,
      energyArcDist: {
        flat: 67,
        building: 234,
        peak: 387,
        rollercoaster: 167,
        afterburner: 79,
      },
      avgSelectionStyle: 0.2,
      avgMixQuality: 5.0,
      avgCrowdSync: 4.9,
      wouldReturnPct: 97,
      tagCounts: {
        'silky smooth': 867,
        'tight transitions': 812,
        'crowd control': 756,
        hypnotic: 698,
        'peak time': 634,
        'heavy sub': 589,
        'deep cuts': 445,
      },
      presentPct: 58,
      consensusScore: 96,
      ageGroupDist: { '<20': 15, '20-25': 198, '25-30': 356, '30-40': 267, '40+': 78 },
    },
    createdAt: 1742400000,
  },
  {
    id: 'evt008',
    djName: 'Svreca',
    venueName: 'Meskalina',
    venueAddress: 'ul. Stary Rynek 6, Poznań',
    city: 'poznan',
    date: '2026-04-10',
    startTime: '23:00',
    endTime: '06:00',
    genres: ['Techno', 'Hard Techno'],
    ratingData: {
      count: 421,
      avgOverall: 4.5,
      energyArcDist: {
        flat: 8,
        building: 78,
        peak: 198,
        rollercoaster: 112,
        afterburner: 25,
      },
      avgSelectionStyle: 0.9,
      avgMixQuality: 4.7,
      avgCrowdSync: 4.6,
      wouldReturnPct: 93,
      tagCounts: {
        'no mercy': 389,
        'heavy sub': 356,
        'peak time': 312,
        'raw energy': 287,
        underground: 245,
      },
      presentPct: 76,
      consensusScore: 88,
      ageGroupDist: { '<20': 56, '20-25': 178, '25-30': 134, '30-40': 45, '40+': 8 },
    },
    createdAt: 1743700000,
  },
  {
    id: 'evt009',
    djName: 'Innercity Ensemble',
    venueName: 'Wytwórnia',
    venueAddress: 'ul. Ogrodowa 19, Łódź',
    city: 'lodz',
    date: '2026-04-03',
    startTime: '22:00',
    endTime: '05:00',
    genres: ['Jazz', 'Electronic', 'Experimental'],
    description:
      'Łódź spotyka awangardę. Innercity Ensemble w historycznej Wytwórni — dawna fabryka, nowe brzmienia.',
    ratingData: {
      count: 198,
      avgOverall: 4.6,
      energyArcDist: {
        flat: 34,
        building: 67,
        peak: 56,
        rollercoaster: 34,
        afterburner: 7,
      },
      avgSelectionStyle: 1.9,
      avgMixQuality: 4.1,
      avgCrowdSync: 4.3,
      wouldReturnPct: 95,
      tagCounts: {
        experimental: 178,
        'genre-defying': 167,
        'vibes only': 145,
        'slow burn': 134,
        underground: 112,
      },
      presentPct: 89,
      consensusScore: 82,
      ageGroupDist: { '<20': 4, '20-25': 23, '25-30': 56, '30-40': 78, '40+': 34 },
    },
    createdAt: 1743600000,
  },
  {
    id: 'evt010',
    djName: 'Phase Fatale',
    venueName: 'Mega Club',
    venueAddress: 'ul. Słowackiego 9, Katowice',
    city: 'katowice',
    date: '2026-04-25',
    startTime: '23:00',
    endTime: '07:00',
    genres: ['Techno', 'Dark Ambient'],
    ratingData: {
      count: 356,
      avgOverall: 4.7,
      energyArcDist: {
        flat: 23,
        building: 112,
        peak: 156,
        rollercoaster: 45,
        afterburner: 20,
      },
      avgSelectionStyle: 1.1,
      avgMixQuality: 4.8,
      avgCrowdSync: 4.5,
      wouldReturnPct: 94,
      tagCounts: {
        hypnotic: 312,
        'heavy sub': 289,
        'slow burn': 234,
        underground: 212,
        'warehouse feel': 189,
      },
      presentPct: 71,
      consensusScore: 90,
      ageGroupDist: { '<20': 12, '20-25': 89, '25-30': 145, '30-40': 87, '40+': 23 },
    },
    createdAt: 1743980000,
  },
  {
    id: 'evt011',
    djName: 'DJ Stingray 313',
    venueName: 'Powiększenie',
    venueAddress: 'ul. Nowy Świat 23, Warszawa',
    city: 'warszawa',
    date: '2026-04-20',
    startTime: '00:00',
    endTime: '08:00',
    genres: ['Detroit Techno', 'Electro', 'Ghetto Tech'],
    description:
      'Legenda Detroit w Warszawie. DJ Stingray 313 — funk, electro i techno w jednym, nieprzewidywalnym bloku.',
    ratingData: {
      count: 445,
      avgOverall: 4.4,
      energyArcDist: {
        flat: 34,
        building: 89,
        peak: 178,
        rollercoaster: 112,
        afterburner: 32,
      },
      avgSelectionStyle: 1.7,
      avgMixQuality: 4.0,
      avgCrowdSync: 4.2,
      wouldReturnPct: 88,
      tagCounts: {
        'genre-defying': 401,
        'deep cuts': 378,
        experimental: 312,
        underground: 289,
        'raw energy': 256,
      },
      presentPct: 68,
      consensusScore: 76,
      ageGroupDist: { '<20': 8, '20-25': 78, '25-30': 156, '30-40': 134, '40+': 56 },
    },
    createdAt: 1743940000,
  },
  {
    id: 'evt012',
    djName: 'Anetha',
    supportingActs: ['Perila'],
    venueName: 'Zakład',
    venueAddress: 'ul. Świdnicka 22, Wrocław',
    city: 'wroclaw',
    date: '2026-04-11',
    startTime: '22:00',
    endTime: '05:00',
    genres: ['Techno', 'Experimental', 'EBM'],
    ratingData: {
      count: 234,
      avgOverall: 4.5,
      energyArcDist: {
        flat: 12,
        building: 56,
        peak: 89,
        rollercoaster: 67,
        afterburner: 10,
      },
      avgSelectionStyle: 1.5,
      avgMixQuality: 4.4,
      avgCrowdSync: 4.1,
      wouldReturnPct: 90,
      tagCounts: {
        experimental: 212,
        'raw energy': 189,
        underground: 167,
        'heavy sub': 145,
        'genre-defying': 134,
      },
      presentPct: 81,
      consensusScore: 78,
      ageGroupDist: { '<20': 15, '20-25': 56, '25-30': 89, '30-40': 56, '40+': 18 },
    },
    createdAt: 1743750000,
  },
  {
    id: 'evt013',
    djName: 'Honey Dijon',
    venueName: 'Jasna 1',
    venueAddress: 'ul. Jasna 1, Warszawa',
    city: 'warszawa',
    date: '2026-05-03',
    startTime: '23:00',
    endTime: '06:00',
    genres: ['House', 'Electronic', 'Disco'],
    description:
      'Honey Dijon — chicago house, funk i soul z berlińskim twistem. Jedna z najbardziej rozchwytywanych DJ-ek w Europie.',
    ratingData: {
      count: 567,
      avgOverall: 4.7,
      energyArcDist: { flat: 34, building: 145, peak: 234, rollercoaster: 123, afterburner: 31 },
      avgSelectionStyle: 1.3,
      avgMixQuality: 4.5,
      avgCrowdSync: 4.8,
      wouldReturnPct: 95,
      tagCounts: {
        'crowd pleaser': 489,
        'vibes only': 423,
        'tight transitions': 356,
        'anthems only': 312,
        'silky smooth': 289,
        'crowd control': 234,
      },
      presentPct: 78,
      consensusScore: 92,
      ageGroupDist: { '<20': 34, '20-25': 178, '25-30': 245, '30-40': 167, '40+': 89 },
    },
    createdAt: 1744100000,
  },
  {
    id: 'evt014',
    djName: 'LTJ Bukem',
    venueName: 'Protokultura',
    venueAddress: 'ul. Józefa Wiśniowskiego 1, Gdańsk',
    city: 'gdansk',
    date: '2026-04-27',
    startTime: '22:00',
    endTime: '05:00',
    genres: ['Drum & Bass', 'Jungle', 'Liquid'],
    description:
      'Legenda atmospheric drum & bass. LTJ Bukem i jego pełne emocji, płynne sety — coś czego nie zobaczycie co roku w Polsce.',
    ratingData: {
      count: 289,
      avgOverall: 4.6,
      energyArcDist: { flat: 23, building: 112, peak: 89, rollercoaster: 45, afterburner: 20 },
      avgSelectionStyle: 0.4,
      avgMixQuality: 4.7,
      avgCrowdSync: 4.5,
      wouldReturnPct: 93,
      tagCounts: {
        'silky smooth': 256,
        'slow burn': 234,
        'deep cuts': 198,
        'vibes only': 178,
        'tight transitions': 156,
      },
      presentPct: 84,
      consensusScore: 89,
      ageGroupDist: { '<20': 45, '20-25': 112, '25-30': 89, '30-40': 34, '40+': 9 },
    },
    createdAt: 1744050000,
  },
];

export function getEventById(id: string): DJEvent | undefined {
  return MOCK_EVENTS.find((e) => e.id === id);
}

export function getEventsByCity(cityId: CityId | 'all'): DJEvent[] {
  if (cityId === 'all') return [...MOCK_EVENTS].sort((a, b) => b.createdAt - a.createdAt);
  return MOCK_EVENTS.filter((e) => e.city === cityId).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

export function getTrendingEvents(): DJEvent[] {
  return [...MOCK_EVENTS]
    .sort((a, b) => b.ratingData.count - a.ratingData.count)
    .slice(0, 5);
}

export function getTopRatedEvents(): DJEvent[] {
  return [...MOCK_EVENTS]
    .filter((e) => e.ratingData.count >= 200)
    .sort((a, b) => b.ratingData.avgOverall - a.ratingData.avgOverall)
    .slice(0, 10);
}

export function getMostDivisiveEvents(): DJEvent[] {
  return [...MOCK_EVENTS]
    .filter((e) => e.ratingData.consensusScore < 80)
    .sort((a, b) => a.ratingData.consensusScore - b.ratingData.consensusScore)
    .slice(0, 5);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getCityName(cityId: CityId): string {
  return CITIES.find((c) => c.id === cityId)?.name ?? cityId.toUpperCase();
}

export function getAllGenres(): string[] {
  const set = new Set<string>();
  MOCK_EVENTS.forEach((e) => e.genres.forEach((g) => set.add(g)));
  return Array.from(set).sort();
}

// Macro genre groups — raw genre tags are bucketed into these for the filter UI
export const GENRE_GROUPS: Record<string, string[]> = {
  TECHNO: [
    'Techno', 'Dub Techno', 'Minimal', 'Hard Techno', 'Dark Ambient',
    'Detroit Techno', 'Industrial', 'EBM', 'Noise',
  ],
  HOUSE: ['House', 'Disco'],
  ELECTRONIC: [
    'Electronic', 'Experimental', 'UK Bass', 'Electro', 'Ghetto Tech',
    'Club Music', 'Breaks', 'Live', 'Jazz',
  ],
  'DRUM & BASS': ['Drum & Bass', 'Jungle', 'Liquid'],
};

export function getAvailableMacroGenres(events: DJEvent[]): string[] {
  const presentGenres = new Set<string>();
  events.forEach((e) => e.genres.forEach((g) => presentGenres.add(g)));
  return Object.keys(GENRE_GROUPS).filter((macro) =>
    GENRE_GROUPS[macro].some((g) => presentGenres.has(g))
  );
}
