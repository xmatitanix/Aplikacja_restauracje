import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { SupportRating } from '../types';

const STORAGE_KEY = 'setlog_support_ratings';

function makeSupportId(eventId: string, actName: string): string {
  return `${eventId}__${encodeURIComponent(actName)}`;
}

export function useSupportRatings() {
  const [ratings, setRatings] = useState<Record<string, SupportRating>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) return;
        if (raw) {
          try {
            setRatings(JSON.parse(raw));
          } catch {
            setRatings({});
          }
        }
        setLoaded(true);
      })
      .catch(() => {
        if (mounted) setLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const saveRating = useCallback(
    async (rating: SupportRating) => {
      const updated = { ...ratings, [rating.id]: rating };
      setRatings(updated);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Storage write failed — state still updated in memory
      }
    },
    [ratings]
  );

  const getRating = useCallback(
    (eventId: string, actName: string): SupportRating | undefined =>
      ratings[makeSupportId(eventId, actName)],
    [ratings]
  );

  const hasRated = useCallback(
    (eventId: string, actName: string): boolean =>
      !!ratings[makeSupportId(eventId, actName)],
    [ratings]
  );

  return { ratings, saveRating, getRating, hasRated, loaded, makeSupportId };
}
