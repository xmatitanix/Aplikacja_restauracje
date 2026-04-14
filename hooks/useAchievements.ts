import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ACHIEVEMENTS } from '../constants/achievements';
import { useRatings } from './useRatings';

const STORAGE_KEY = 'setlog_seen_achievements_v1';

export function useAchievements() {
  const { ratings, loaded } = useRatings();
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const arr: string[] = JSON.parse(raw);
          setSeenIds(new Set(arr));
        } catch {}
      }
      setStorageLoaded(true);
    });
  }, []);

  const earnedIds = useMemo(() => {
    if (!loaded) return new Set<string>();
    return new Set(
      ACHIEVEMENTS.filter((a) => a.condition(ratings)).map((a) => a.id)
    );
  }, [ratings, loaded]);

  const newlyUnlocked = useMemo(() => {
    if (!storageLoaded || !loaded) return [];
    return ACHIEVEMENTS.filter(
      (a) => earnedIds.has(a.id) && !seenIds.has(a.id)
    );
  }, [earnedIds, seenIds, storageLoaded, loaded]);

  const markAllSeen = useCallback(async () => {
    const next = new Set([...seenIds, ...earnedIds]);
    setSeenIds(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  }, [seenIds, earnedIds]);

  return {
    achievements: ACHIEVEMENTS,
    earnedIds,
    newlyUnlocked,
    markAllSeen,
    ready: loaded && storageLoaded,
  };
}
