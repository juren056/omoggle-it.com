-- Points system tables (run in Supabase SQL Editor)

CREATE TABLE IF NOT EXISTS user_points (
  user_id TEXT PRIMARY KEY,
  points INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  extra_uses INTEGER NOT NULL DEFAULT 0,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS points_log (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  points INTEGER NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_points_log_user_id ON points_log (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS daily_checkins (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  checkin_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, checkin_date)
);

CREATE TABLE IF NOT EXISTS tasks_completed (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_tasks_completed_user_id ON tasks_completed (user_id);
