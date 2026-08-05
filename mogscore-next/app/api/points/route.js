import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabase } from '@/lib/supabase'

async function ensureUser(supabase, userId) {
  const { error: upsertError } = await supabase
    .from('user_points')
    .upsert({ user_id: userId }, { onConflict: 'user_id', ignoreDuplicates: true })
  if (upsertError) throw new Error(upsertError.message)

  const { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, { status: 401 })

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Points system not configured (Supabase env missing)', code: 'DB_NOT_CONFIGURED' },
      { status: 503 }
    )
  }

  try {
    const userData = await ensureUser(supabase, userId)
    const { data: logs } = await supabase
      .from('points_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    const today = new Date().toISOString().split('T')[0]
    const { data: checkin } = await supabase
      .from('daily_checkins')
      .select('id')
      .eq('user_id', userId)
      .eq('checkin_date', today)
      .maybeSingle()
    const { data: tasks } = await supabase
      .from('tasks_completed')
      .select('task_id')
      .eq('user_id', userId)
    const taskIds = (tasks || []).map(task => task.task_id)

    return NextResponse.json({
      points: userData.points || 0,
      total_earned: userData.total_earned || 0,
      extra_uses: userData.extra_uses || 0,
      display_name: userData.display_name || null,
      logs: logs || [],
      checked_in_today: Boolean(checkin),
      shared_today: taskIds.includes(`share_${today}`),
      profile_complete: taskIds.includes('complete_profile'),
    })
  } catch (error) {
    console.error('[points GET]', error.message)
    return NextResponse.json({ error: error.message, code: 'DB_ERROR' }, { status: 500 })
  }
}

export async function POST(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, { status: 401 })

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Points system not configured (Supabase env missing)', code: 'DB_NOT_CONFIGURED' },
      { status: 503 }
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { action, payload } = body || {}
  const allowedActions = new Set(['daily_checkin', 'share_result', 'complete_profile', 'redeem_use'])
  if (typeof action !== 'string' || !allowedActions.has(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
  const displayName = action === 'complete_profile' ? payload?.display_name : null
  if (displayName !== null && typeof displayName !== 'string') {
    return NextResponse.json({ error: 'Invalid display name' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase.rpc('apply_points_action', {
      p_user_id: userId,
      p_action: action,
      p_display_name: displayName,
    })
    if (error) throw new Error(error.message)
    if (!data?.success) return NextResponse.json({ error: data?.error || 'Action failed' }, { status: 400 })
    return NextResponse.json({
      success: true,
      points_earned: data.pointsEarned || 0,
      message: data.message,
    })
  } catch (error) {
    console.error('[points POST]', error.message)
    return NextResponse.json({ error: 'Points service unavailable', code: 'DB_ERROR' }, { status: 503 })
  }
}
