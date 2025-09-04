-- Enable extension(s)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT,
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily check-ins
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  mood_score INT NOT NULL,
  stress INT NOT NULL,
  energy INT NOT NULL,
  struggles TEXT[] NOT NULL DEFAULT '{}',
  note TEXT
);

-- Seed user1 with bcrypt hash for password 'journal1' (pgcrypto -> blowfish)
INSERT INTO users (username, hashed_password)
VALUES ('user1', crypt('journal1', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

-- Seed mock journal entries for user1
WITH u AS (
  SELECT id FROM users WHERE username = 'user1'
)
INSERT INTO journal_entries (user_id, title, content, mood, tags, is_private, created_at)
SELECT u.id, 'Coffee Surprise', 'I felt a wave of joy today when my friend surprised me with a coffee and we sat together laughing about old memories.', 'Joy', ARRAY['Friends','Food'], TRUE, now() - interval '5 days' FROM u
UNION ALL
SELECT u.id, 'Airport Goodbye', 'I felt really sad after saying goodbye to my cousin at the airport, it hit me how much I’ll miss them.', 'Sad', ARRAY['Family','Travel'], TRUE, now() - interval '4 days' FROM u
UNION ALL
SELECT u.id, 'Lake Walk', 'Taking a slow walk by the lake brought me a calm I didn’t realize I needed — the water was so still.', 'Calm', ARRAY['Health','Recreation'], TRUE, now() - interval '3 days' FROM u
UNION ALL
SELECT u.id, 'Meeting Glitch', 'I felt frustrated when my internet cut out during an important meeting, leaving me anxious about how it looked.', 'Frustrated', ARRAY['Work','Tech'], TRUE, now() - interval '2 days' FROM u
UNION ALL
SELECT u.id, 'Grateful Call', 'I felt grateful this evening when my mom called just to check in — it reminded me I’m not alone.', 'Grateful', ARRAY['Family'], TRUE, now() - interval '1 days' FROM u
UNION ALL
SELECT u.id, 'New Café', 'Tried a new café, latte was amazing.', 'Happy', ARRAY['Food'], TRUE, now() - interval '6 days' FROM u
UNION ALL
SELECT u.id, 'Old Photos', 'Looked through old photos, felt nostalgic.', 'Nostalgic', ARRAY['Memories'], TRUE, now() - interval '7 days' FROM u
ON CONFLICT DO NOTHING;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_entries_user_created
  ON journal_entries(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_checkins_user_created
  ON checkins(user_id, created_at DESC);
