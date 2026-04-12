import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SupportRating } from '../types';

function makeSupportId(eventId: string, actName: string): string {
  return `${eventId}__${encodeURIComponent(actName)}`;
}

export function useSupportRatings() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Record<string, SupportRating>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setRatings({});
      setLoaded(true);
      return;
    }

    let mounted = true;

    supabase
      .from('support_ratings')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!mounted || error || !data) {
          if (mounted) setLoaded(true);
          return;
        }
        const map: Record<string, SupportRating> = {};
        data.forEach((row) => {
          const id = makeSupportId(row.event_id, row.act_name);
          map[id] = {
            id,
            eventId: row.event_id,
            actName: row.act_name,
            overall: row.overall,
            tags: row.tags ?? [],
            wasPresent: row.was_present,
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
    async (rating: SupportRating) => {
      if (!user) return;

      const { error } = await supabase.from('support_ratings').upsert(
        {
          user_id: user.id,
          event_id: rating.eventId,
          act_name: rating.actName,
          overall: rating.overall,
          tags: rating.tags,
          was_present: rating.wasPresent,
        },
        { onConflict: 'user_id,event_id,act_name' }
      );

      if (!error) {
        setRatings((prev) => ({ ...prev, [rating.id]: rating }));
      }
    },
    [user]
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
