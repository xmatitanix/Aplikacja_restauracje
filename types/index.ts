export const AGE_GROUPS = ['<20', '20-25', '25-30', '30-40', '40+'] as const;
export type AgeGroup = typeof AGE_GROUPS[number];

export interface DJEvent {
  id: string;
  djName: string;
  supportingActs?: string[];
  venueName: string;
  venueAddress?: string;
  city: CityId;
  date: string;
  startTime: string;
  endTime?: string;
  genres: string[];
  description?: string;
  fbEventUrl?: string;
  soundcloudUrl?: string;
  raUrl?: string;
  image?: string;
  lineup?: string[];
  ratingData: AggregatedRatings;
  createdAt: number;
}

export type CityId =
  | 'warszawa'
  | 'krakow'
  | 'wroclaw'
  | 'gdansk'
  | 'poznan'
  | 'lodz'
  | 'katowice';

export interface City {
  id: CityId | 'all';
  name: string;
  description: string;
  sceneNote: string;
}

export type EnergyArc =
  | 'flat'
  | 'building'
  | 'peak'
  | 'rollercoaster'
  | 'afterburner';

export interface Rating {
  eventId: string;
  overall: 1 | 2 | 3 | 4 | 5;
  energyArc: EnergyArc;
  selectionStyle: -2 | -1 | 0 | 1 | 2;
  mixQuality: 1 | 2 | 3 | 4 | 5;
  crowdSync: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  wasPresent: boolean;
  ageGroup?: AgeGroup;
  timestamp: number;
}

export interface SupportRating {
  id: string; // `${eventId}__${actName}`
  eventId: string;
  actName: string;
  overall: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  wasPresent: boolean;
  timestamp: number;
}

export interface AggregatedRatings {
  count: number;
  avgOverall: number;
  energyArcDist: Record<EnergyArc, number>;
  avgSelectionStyle: number;
  avgMixQuality: number;
  avgCrowdSync: number;
  wouldReturnPct: number;
  tagCounts: Record<string, number>;
  presentPct: number;
  consensusScore: number;
  ageGroupDist: Record<string, number>;
}

export interface CityFact {
  cityId: CityId;
  fact: string;
  stat: string;
}

// Validation helpers
export function isValidEventId(id: unknown): id is string {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(id);
}

export function isValidActName(name: unknown): name is string {
  return typeof name === 'string' && name.length > 0 && name.length <= 100;
}

export function sanitizeActName(name: string): string {
  return name.replace(/[^a-zA-ZÀ-ž0-9\s\-'.]/g, '').trim().slice(0, 100);
}
