-- ============================================================
-- SETLOG — Supabase schema
-- Wklej to całe do: Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Ratings (jedna ocena na event na użytkownika)
CREATE TABLE IF NOT EXISTS ratings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id      TEXT NOT NULL,
  overall       SMALLINT NOT NULL CHECK (overall BETWEEN 1 AND 5),
  energy_arc    TEXT NOT NULL,
  selection_style SMALLINT NOT NULL CHECK (selection_style BETWEEN -2 AND 2),
  mix_quality   SMALLINT NOT NULL CHECK (mix_quality BETWEEN 1 AND 5),
  crowd_sync    SMALLINT NOT NULL CHECK (crowd_sync BETWEEN 1 AND 5),
  tags          TEXT[] DEFAULT '{}',
  was_present   BOOLEAN NOT NULL DEFAULT false,
  age_group     TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, event_id)
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ratings_read"   ON ratings FOR SELECT USING (true);
CREATE POLICY "ratings_insert" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ratings_update" ON ratings FOR UPDATE USING (auth.uid() = user_id);

-- Support act ratings (jedna ocena na support act na użytkownika)
CREATE TABLE IF NOT EXISTS support_ratings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id    TEXT NOT NULL,
  act_name    TEXT NOT NULL,
  overall     SMALLINT NOT NULL CHECK (overall BETWEEN 1 AND 5),
  tags        TEXT[] DEFAULT '{}',
  was_present BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, event_id, act_name)
);

ALTER TABLE support_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "support_ratings_read"   ON support_ratings FOR SELECT USING (true);
CREATE POLICY "support_ratings_insert" ON support_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "support_ratings_update" ON support_ratings FOR UPDATE USING (auth.uid() = user_id);

-- Submitted events (widoczne dla wszystkich, dodać może tylko zalogowany)
CREATE TABLE IF NOT EXISTS submitted_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_data  JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE submitted_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submitted_events_read"   ON submitted_events FOR SELECT USING (true);
CREATE POLICY "submitted_events_insert" ON submitted_events FOR INSERT WITH CHECK (auth.uid() = user_id);
