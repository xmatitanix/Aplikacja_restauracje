import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Rating } from '../types';

export function useRatings() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setRatings({});
      setLoaded(true);
      return;
    }

    let mounted = true;

    supabase
      .from('ratings')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!mounted || error || !data) {
          if (mounted) setLoaded(true);
          return;
        }
        const map: Record<string, Rating> = {};
        data.forEach((row) => {
          map[row.event_id] = {
            eventId: row.event_id,
            overall: row.overall,
            energyArc: row.energy_arc,
            selectionStyle: row.selection_style,
            mixQuality: row.mix_quality,
            crowdSync: row.crowd_sync,
            tags: row.tags ?? [],
            wasPresent: row.was_present,
            ageGroup: row.age_group ?? undefined,
            timestamp: new Date(row.created_at).getTime(),
          };
        });
        setRatings(map);
        setLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  const saveRating = useCallback(
    async (rating: Rating) => {
      if (!user) return;

      const { error } = await supabase.from('ratings').upsert(
        {
          user_id: user.id,
          event_id: rating.eventId,
          overall: rating.overall,
          energy_arc: rating.energyArc,
          selection_style: rating.selectionStyle,
          mix_quality: rating.mixQuality,
          crowd_sync: rating.crowdSync,
          tags: rating.tags,
          was_present: rating.wasPresent,
          age_group: rating.ageGroup ?? null,
        },
        { onConflict: 'user_id,event_id' }
      );

      if (!error) {
        setRatings((prev) => ({ ...prev, [rating.eventId]: rating }));
      }
    },
    [user]
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

  const getStreak = useCallback((): number => {
    const timestamps = Object.values(ratings).map((r) => r.timestamp);
    if (timestamps.length === 0) return 0;

    // YYYY-MM-DD from UTC ms — avoids 365 Date allocations
    const MS = 86_400_000;
    const toDay = (ts: number) => {
      const d = new Date(ts);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const ratedDays = new Set(timestamps.map(toDay));
    const todayMs = Date.now();
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      if (ratedDays.has(toDay(todayMs - i * MS))) {
        streak++;
      } else if (i === 0) {
        // No rating today yet — grace period, check yesterday
        continue;
      } else {
        break;
      }
    }
    return streak;
  }, [ratings]);

  return { ratings, saveRating, getRating, hasRated, getRatedCount, getStreak, loaded };
}
