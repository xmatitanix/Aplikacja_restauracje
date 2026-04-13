-- DJ Notes table
-- Run this in Supabase SQL Editor: https://app.supabase.com → SQL Editor

CREATE TABLE IF NOT EXISTS dj_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL CHECK (char_length(author_name) <= 60),
  content TEXT NOT NULL CHECK (char_length(content) <= 280),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE dj_notes ENABLE ROW LEVEL SECURITY;

-- Anyone can read all notes
CREATE POLICY "dj_notes_read" ON dj_notes
  FOR SELECT USING (true);

-- Only logged-in user can insert their own note
CREATE POLICY "dj_notes_insert" ON dj_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only the author can update their note
CREATE POLICY "dj_notes_update" ON dj_notes
  FOR UPDATE USING (auth.uid() = user_id);

-- Only the author can delete their note
CREATE POLICY "dj_notes_delete" ON dj_notes
  FOR DELETE USING (auth.uid() = user_id);
