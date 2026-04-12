import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { DJEvent } from '../types';

export function useSubmittedEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<DJEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Load publicly visible submitted events (all users, no auth required)
    supabase
      .from('submitted_events')
      .select('event_data')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!mounted || error || !data) {
          if (mounted) setLoaded(true);
          return;
        }
        const parsed = data
          .map((row) => row.event_data as DJEvent)
          .filter(Boolean);
        setEvents(parsed);
        setLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const submitEvent = useCallback(
    async (event: DJEvent) => {
      if (!user) return;

      const { error } = await supabase.from('submitted_events').insert({
        user_id: user.id,
        event_data: event,
      });

      if (!error) {
        setEvents((prev) => [event, ...prev]);
      }
    },
    [user]
  );

  return { events, submitEvent, loaded };
}
