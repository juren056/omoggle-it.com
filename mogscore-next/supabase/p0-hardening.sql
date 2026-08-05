-- P0 hardening migration. Run after points.sql and subscriptions.sql.
-- All mutations are exposed only to the service role used by server-side routes.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS analysis_daily_usage (
  subject TEXT NOT NULL,
  usage_date DATE NOT NULL,
  used INTEGER NOT NULL DEFAULT 0 CHECK (used >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (subject, usage_date)
);

CREATE TABLE IF NOT EXISTS analysis_minute_usage (
  subject TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  used INTEGER NOT NULL DEFAULT 0 CHECK (used >= 0),
  PRIMARY KEY (subject, window_start)
);

CREATE TABLE IF NOT EXISTS analysis_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  user_id TEXT,
  usage_date DATE NOT NULL,
  daily_counted BOOLEAN NOT NULL DEFAULT TRUE,
  credit_used BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'consumed', 'released')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_reservations_subject_created
  ON analysis_reservations (subject, created_at DESC);

CREATE OR REPLACE FUNCTION reserve_analysis_use(
  p_subject TEXT,
  p_user_id TEXT,
  p_base_limit INTEGER,
  p_minute_limit INTEGER,
  p_is_pro BOOLEAN DEFAULT FALSE
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := (NOW() AT TIME ZONE 'UTC')::DATE;
  v_window TIMESTAMPTZ := date_trunc('minute', NOW());
  v_minute_used INTEGER := 0;
  v_daily_used INTEGER := 0;
  v_extra INTEGER := 0;
  v_credit_used BOOLEAN := FALSE;
  v_reservation UUID;
BEGIN
  IF p_subject IS NULL OR length(p_subject) < 3 OR p_base_limit < 0 OR p_minute_limit < 1 THEN
    RAISE EXCEPTION 'invalid quota parameters';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(p_subject, 0));

  SELECT m.used INTO v_minute_used
  FROM analysis_minute_usage m
  WHERE m.subject = p_subject AND m.window_start = v_window
  FOR UPDATE;
  v_minute_used := COALESCE(v_minute_used, 0);
  IF v_minute_used >= p_minute_limit THEN
    RETURN jsonb_build_object('allowed', FALSE, 'reason', 'minute_limit');
  END IF;

  IF NOT p_is_pro THEN
    INSERT INTO analysis_daily_usage (subject, usage_date, used)
    VALUES (p_subject, v_today, 0)
    ON CONFLICT (subject, usage_date) DO NOTHING;

    SELECT d.used INTO v_daily_used
    FROM analysis_daily_usage d
    WHERE d.subject = p_subject AND d.usage_date = v_today
    FOR UPDATE;

    IF p_user_id IS NOT NULL THEN
      INSERT INTO user_points (user_id) VALUES (p_user_id)
      ON CONFLICT (user_id) DO NOTHING;
      SELECT u.extra_uses INTO v_extra FROM user_points u WHERE u.user_id = p_user_id FOR UPDATE;
    END IF;

    IF v_daily_used >= p_base_limit THEN
      IF p_user_id IS NULL OR v_extra < 1 THEN
        RETURN jsonb_build_object(
          'allowed', FALSE, 'reason', 'daily_limit', 'used', v_daily_used,
          'limit', p_base_limit, 'remaining', 0, 'extraUses', v_extra
        );
      END IF;
      UPDATE user_points SET extra_uses = extra_uses - 1, updated_at = NOW() WHERE user_id = p_user_id;
      v_extra := v_extra - 1;
      v_credit_used := TRUE;
    END IF;

    UPDATE analysis_daily_usage
    SET used = used + 1, updated_at = NOW()
    WHERE subject = p_subject AND usage_date = v_today
    RETURNING used INTO v_daily_used;
  END IF;

  INSERT INTO analysis_minute_usage (subject, window_start, used)
  VALUES (p_subject, v_window, 1)
  ON CONFLICT (subject, window_start)
  DO UPDATE SET used = analysis_minute_usage.used + 1;

  INSERT INTO analysis_reservations (subject, user_id, usage_date, daily_counted, credit_used)
  VALUES (p_subject, p_user_id, v_today, NOT p_is_pro, v_credit_used)
  RETURNING id INTO v_reservation;

  RETURN jsonb_build_object(
    'allowed', TRUE, 'reservationId', v_reservation, 'used', v_daily_used,
    'limit', CASE WHEN p_is_pro THEN NULL ELSE p_base_limit END,
    'remaining', CASE WHEN p_is_pro THEN NULL ELSE GREATEST(p_base_limit - v_daily_used, 0) + v_extra END,
    'extraUses', v_extra, 'isPro', p_is_pro
  );
END;
$$;

CREATE OR REPLACE FUNCTION finalize_analysis_use(p_reservation_id UUID) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row analysis_reservations%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM analysis_reservations WHERE id = p_reservation_id FOR UPDATE;
  IF NOT FOUND OR v_row.status <> 'reserved' THEN RETURN FALSE; END IF;
  UPDATE analysis_reservations SET status = 'consumed', updated_at = NOW() WHERE id = p_reservation_id;
  IF v_row.user_id IS NOT NULL THEN
    INSERT INTO points_log (user_id, points, action, description)
    VALUES (v_row.user_id, 0, 'analyze_use', 'Analysis use');
  END IF;
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION release_analysis_use(p_reservation_id UUID) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row analysis_reservations%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM analysis_reservations WHERE id = p_reservation_id FOR UPDATE;
  IF NOT FOUND OR v_row.status <> 'reserved' THEN RETURN FALSE; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(v_row.subject, 0));
  IF v_row.daily_counted THEN
    UPDATE analysis_daily_usage SET used = GREATEST(used - 1, 0), updated_at = NOW()
    WHERE subject = v_row.subject AND usage_date = v_row.usage_date;
  END IF;
  IF v_row.credit_used AND v_row.user_id IS NOT NULL THEN
    UPDATE user_points SET extra_uses = extra_uses + 1, updated_at = NOW() WHERE user_id = v_row.user_id;
  END IF;
  UPDATE analysis_reservations SET status = 'released', updated_at = NOW() WHERE id = p_reservation_id;
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION apply_points_action(
  p_user_id TEXT,
  p_action TEXT,
  p_display_name TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := (NOW() AT TIME ZONE 'UTC')::DATE;
  v_task_id TEXT;
  v_points INTEGER := 0;
  v_description TEXT;
  v_inserted INTEGER;
  v_user user_points%ROWTYPE;
BEGIN
  IF p_user_id IS NULL OR length(p_user_id) < 3 THEN RAISE EXCEPTION 'invalid user'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('points:' || p_user_id, 0));
  INSERT INTO user_points (user_id) VALUES (p_user_id) ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO v_user FROM user_points WHERE user_id = p_user_id FOR UPDATE;

  CASE p_action
    WHEN 'daily_checkin' THEN
      INSERT INTO daily_checkins (user_id, checkin_date) VALUES (p_user_id, v_today) ON CONFLICT DO NOTHING;
      GET DIAGNOSTICS v_inserted = ROW_COUNT;
      IF v_inserted = 0 THEN RETURN jsonb_build_object('success', FALSE, 'error', 'You already checked in today'); END IF;
      v_points := 5; v_description := 'Daily check-in +5 pts';
    WHEN 'share_result' THEN
      v_task_id := 'share_' || v_today::TEXT;
      INSERT INTO tasks_completed (user_id, task_id) VALUES (p_user_id, v_task_id) ON CONFLICT DO NOTHING;
      GET DIAGNOSTICS v_inserted = ROW_COUNT;
      IF v_inserted = 0 THEN RETURN jsonb_build_object('success', FALSE, 'error', 'You already shared today'); END IF;
      v_points := 10; v_description := 'Shared analysis result +10 pts';
    WHEN 'complete_profile' THEN
      IF p_display_name IS NULL OR length(trim(p_display_name)) < 2 OR length(trim(p_display_name)) > 80 THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Name must be between 2 and 80 characters');
      END IF;
      INSERT INTO tasks_completed (user_id, task_id) VALUES (p_user_id, 'complete_profile') ON CONFLICT DO NOTHING;
      GET DIAGNOSTICS v_inserted = ROW_COUNT;
      IF v_inserted = 0 THEN RETURN jsonb_build_object('success', FALSE, 'error', 'Already completed'); END IF;
      UPDATE user_points SET display_name = trim(p_display_name) WHERE user_id = p_user_id;
      v_points := 10; v_description := 'Completed profile +10 pts';
    WHEN 'redeem_use' THEN
      IF v_user.points < 10 THEN RETURN jsonb_build_object('success', FALSE, 'error', 'Not enough points (10 required)'); END IF;
      UPDATE user_points SET points = points - 10, extra_uses = extra_uses + 1, updated_at = NOW() WHERE user_id = p_user_id;
      INSERT INTO points_log (user_id, points, action, description)
      VALUES (p_user_id, -10, 'redeem_use', 'Redeemed 1 extra analysis (-10 pts)');
      RETURN jsonb_build_object('success', TRUE, 'pointsEarned', -10, 'message', 'Redeemed! You got 1 extra analysis');
    ELSE
      RETURN jsonb_build_object('success', FALSE, 'error', 'Invalid action');
  END CASE;

  UPDATE user_points
  SET points = points + v_points, total_earned = total_earned + v_points, updated_at = NOW()
  WHERE user_id = p_user_id;
  INSERT INTO points_log (user_id, points, action, description)
  VALUES (p_user_id, v_points, p_action, v_description);
  RETURN jsonb_build_object('success', TRUE, 'pointsEarned', v_points, 'message', v_description);
END;
$$;

REVOKE ALL ON FUNCTION reserve_analysis_use(TEXT, TEXT, INTEGER, INTEGER, BOOLEAN) FROM PUBLIC;
REVOKE ALL ON FUNCTION finalize_analysis_use(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION release_analysis_use(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION apply_points_action(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION reserve_analysis_use(TEXT, TEXT, INTEGER, INTEGER, BOOLEAN) TO service_role;
GRANT EXECUTE ON FUNCTION finalize_analysis_use(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION release_analysis_use(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION apply_points_action(TEXT, TEXT, TEXT) TO service_role;
