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
}

export interface CityFact {
  cityId: CityId;
  fact: string;
  stat: string;
}
