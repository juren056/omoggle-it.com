-- Run this in Supabase SQL Editor before enabling Stripe live payments.
-- Stores Stripe subscription state keyed by Clerk user_id.

CREATE TABLE IF NOT EXISTS subscriptions (
  user_id TEXT PRIMARY KEY,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer
  ON subscriptions (stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription
  ON subscriptions (stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON subscriptions (status);
