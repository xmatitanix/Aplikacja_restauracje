import { ALL_EVENTS } from '../data/events';
import { Rating } from '../types';

export interface Achievement {
  id: string;
  emoji: string;
  name: string;
  description: string;
  condition: (ratings: Record<string, Rating>) => boolean;
}

function calcStreak(ratings: Record<string, Rating>): number {
  const MS = 86_400_000;
  const toDay = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const ratedDays = new Set(Object.values(ratings).map((r) => toDay(r.timestamp)));
  const todayMs = Date.now();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    if (ratedDays.has(toDay(todayMs - i * MS))) {
      streak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    emoji: '🎧',
    name: 'PIERWSZA OCENA',
    description: 'Oceń swój pierwszy set',
    condition: (r) => Object.keys(r).length >= 1,
  },
  {
    id: 'starter_pack',
    emoji: '📦',
    name: 'STARTER PACK',
    description: 'Oceń 5 setów',
    condition: (r) => Object.keys(r).length >= 5,
  },
  {
    id: 'on_a_roll',
    emoji: '🎲',
    name: 'W RYTMIE',
    description: 'Oceń 25 setów',
    condition: (r) => Object.keys(r).length >= 25,
  },
  {
    id: 'dedicated',
    emoji: '⬛',
    name: 'ZAANGAŻOWANY',
    description: 'Oceń 100 setów',
    condition: (r) => Object.keys(r).length >= 100,
  },
  {
    id: 'fire_starter',
    emoji: '🔥',
    name: 'FIRE STARTER',
    description: '3 dni ocen z rzędu',
    condition: (r) => calcStreak(r) >= 3,
  },
  {
    id: 'week_streak',
    emoji: '📅',
    name: 'TYGODNIK',
    description: '7 dni ocen z rzędu',
    condition: (r) => calcStreak(r) >= 7,
  },
  {
    id: 'month_streak',
    emoji: '🗓️',
    name: 'MIESIĄC Z RZĘDU',
    description: '30 dni ocen z rzędu',
    condition: (r) => calcStreak(r) >= 30,
  },
  {
    id: 'connoisseur',
    emoji: '🔬',
    name: 'KONESER',
    description: '10 pełnych ocen (tryb zaawansowany)',
    condition: (r) =>
      Object.values(r).filter((x) => x.energyArc !== undefined).length >= 10,
  },
  {
    id: 'globetrotter',
    emoji: '🗺️',
    name: 'GLOBTROTER',
    description: 'Oceń sety w 3 różnych miastach',
    condition: (r) => {
      const cityMap: Record<string, string> = {};
      ALL_EVENTS.forEach((e) => { cityMap[e.id] = e.city; });
      return (
        new Set(
          Object.values(r)
            .map((x) => cityMap[x.eventId])
            .filter(Boolean)
        ).size >= 3
      );
    },
  },
  {
    id: 'live_rat',
    emoji: '🐀',
    name: 'BYŁEM TAM',
    description: 'Byłeś/aś na 20 setach live',
    condition: (r) => Object.values(r).filter((x) => x.wasPresent).length >= 20,
  },
  {
    id: 'vibe_catcher',
    emoji: '🌀',
    name: 'ŁAPACZ WIBRACJI',
    description: 'Użyj 5 różnych tagów w ocenach',
    condition: (r) =>
      new Set(Object.values(r).flatMap((x) => x.tags)).size >= 5,
  },
  {
    id: 'night_owl',
    emoji: '🦉',
    name: 'NOCNY MAREK',
    description: 'Oceń set między 00:00 a 04:00',
    condition: (r) =>
      Object.values(r).some((x) => {
        const h = new Date(x.timestamp).getHours();
        return h >= 0 && h < 4;
      }),
  },
];
