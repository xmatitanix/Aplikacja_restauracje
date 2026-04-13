import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export interface DjNote {
  id: string;
  event_id: string;
  user_id: string;
  author_name: string;
  content: string;
  updated_at: string;
}

export function useDjNotes(eventId: string) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<DjNote[]>([]);
  const [loading, setLoading] = useState(true);

  // Derived — never out of sync with notes
  const myNote = useMemo(
    () => (user ? notes.find((n) => n.user_id === user.id) ?? null : null),
    [notes, user]
  );

  const fetchNotes = useCallback(async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const { data, error } = await supabase
      .from('dj_notes')
      .select('*')
      .eq('event_id', eventId)
      .order('updated_at', { ascending: false });

    if (!cancelled && !error && data) {
      setNotes(data as DjNote[]);
    }
    if (!cancelled) setLoading(false);

    return () => { cancelled = true; };
  }, [eventId, user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const saveNote = useCallback(
    async (authorName: string, content: string): Promise<{ error: Error | null }> => {
      if (!user) return { error: new Error('Not authenticated') };

      const { error } = await supabase.from('dj_notes').upsert(
        {
          event_id: eventId,
          user_id: user.id,
          author_name: authorName.trim(),
          content: content.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'event_id,user_id' }
      );

      if (!error) await fetchNotes();
      return { error: error as Error | null };
    },
    [eventId, user, fetchNotes]
  );

  const deleteNote = useCallback(async (): Promise<{ error: Error | null }> => {
    if (!user || !myNote) return { error: null };

    const { error } = await supabase
      .from('dj_notes')
      .delete()
      .eq('id', myNote.id);

    if (!error) await fetchNotes();
    return { error: error as Error | null };
  }, [user, myNote, fetchNotes]);

  return { notes, loading, myNote, saveNote, deleteNote };
}
