import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { DJEvent } from '../types';

const STORAGE_KEY = 'setlog_submitted_events';

export function useSubmittedEvents() {
  const [events, setEvents] = useState<DJEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) return;
        if (raw) {
          try {
            setEvents(JSON.parse(raw));
          } catch {
            setEvents([]);
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

  const submitEvent = useCallback(
    async (event: DJEvent) => {
      const updated = [...events, event];
      setEvents(updated);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Storage write failed — state updated in memory
      }
    },
    [events]
  );

  return { events, submitEvent, loaded };
}
