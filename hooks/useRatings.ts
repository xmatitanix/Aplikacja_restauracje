import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Rating } from '../types';

const STORAGE_KEY = 'setlog_ratings';

export function useRatings() {
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setRatings(JSON.parse(raw));
        } catch {
          setRatings({});
        }
      }
      setLoaded(true);
    });
  }, []);

  const saveRating = useCallback(
    async (rating: Rating) => {
      const updated = { ...ratings, [rating.eventId]: rating };
      setRatings(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [ratings]
  );

  const getRating = useCallback(
    (eventId: string): Rating | undefined => ratings[eventId],
    [ratings]
  );

  const hasRated = useCallback(
    (eventId: string): boolean => !!ratings[eventId],
    [ratings]
  );

  const getRatedCount = useCallback(
    () => Object.keys(ratings).length,
    [ratings]
  );

  return { ratings, saveRating, getRating, hasRated, getRatedCount, loaded };
}
