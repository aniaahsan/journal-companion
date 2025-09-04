-- Enable extensions you might use later
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users (simple for now)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT,            -- for later (bcrypt/argon2)
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
  is_private BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed one demo user
INSERT INTO users (username, email)
VALUES ('demo', 'demo@example.com')
ON CONFLICT (username) DO NOTHING;

-- Grab demo user id
WITH u AS (SELECT id FROM users WHERE username='demo')
INSERT INTO journal_entries (user_id, title, content, mood, tags, is_private, created_at)
SELECT u.id, 'First Mock Entry', 'Walked by the lake; felt calm and clear.', 'Calm', ARRAY['Health','Recreation'], true, now() - interval '3 days' FROM u
UNION ALL
SELECT u.id, 'Busy day', 'Meetings stacked; a bit overwhelmed but proud I shipped.', 'Proud', ARRAY['Work'], true, now() - interval '2 days' FROM u
UNION ALL
SELECT u.id, 'Coffee with Sam', 'Laughed a lot, cozy vibes. Grateful.', 'Happy', ARRAY['Friends','Food'], true, now() - interval '1 day' FROM u
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_entries_user_created
  ON journal_entries(user_id, created_at DESC);
