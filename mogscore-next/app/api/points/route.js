import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

async function getUserId() {
  try {
    const { auth } = await import('@clerk/nextjs/server')
    const session = await auth()
    return session?.userId || null
  } catch (e) {
    console.error('Auth error:', e)
    return null
  }
}

async function ensureUserExists(supabase, userId, userEmail, userName) {
  const { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code === 'PGRST116') {
    const { data: newData, error: createErr } = await supabase
      .from('user_points')
      .insert({
        user_id: userId,
        points: 0,
        total_earned: 0,
        extra_uses: 0,
        email: userEmail || null,
        display_name: userName || null,
      })
      .select()
      .single()
    if (createErr) throw new Error(createErr.message)
    return newData
  }
  if (error) throw new Error(error.message)
  return data
}

// GET /api/points
export async function GET(req) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, { status: 401 })
  }

  try {
    const supabase = getSupabase()
    const data = await ensureUserExists(supabase, userId, null, null)

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

    // Check completed one-time tasks
    const { data: completedTasks } = await supabase
      .from('tasks_completed')
      .select('task_id')
      .eq('user_id', userId)

    const completedTaskIds = (completedTasks || []).map(t => t.task_id)

    // Check if profile is complete
    const profileComplete = completedTaskIds.includes('complete_profile')

    // Check if shared today
    const sharedToday = completedTaskIds.includes(`share_${today}`)

    return NextResponse.json({
      points: data.points || 0,
      total_earned: data.total_earned || 0,
      extra_uses: data.extra_uses || 0,
      display_name: data.display_name || null,
      email: data.email || null,
      logs: logs || [],
      checked_in_today: !!checkin,
      shared_today: sharedToday,
      profile_complete: profileComplete,
    })
  } catch (err) {
    console.error('GET /api/points error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/points
export async function POST(req) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { action, payload } = body
  const supabase = getSupabase()
  const today = new Date().toISOString().split('T')[0]

  try {
    // Ensure user record exists
    const userData = await ensureUserExists(supabase, userId, null, null)

    let pointsToAdd = 0
    let description = ''

    switch (action) {

      // ── Daily checkin ───────────────────────────────────────────
      case 'daily_checkin': {
        const { data: existing } = await supabase
          .from('daily_checkins')
          .select('id')
          .eq('user_id', userId)
          .eq('checkin_date', today)
          .maybeSingle()

        if (existing) {
          return NextResponse.json({ error: '今天已经签到过了', code: 'ALREADY_DONE' }, { status: 400 })
        }

        await supabase.from('daily_checkins').insert({ user_id: userId, checkin_date: today })
        pointsToAdd = 5
        description = '每日签到 +5分'
        break
      }

      // ── Share result ────────────────────────────────────────────
      case 'share_result': {
        const taskId = `share_${today}`
        const { data: existing } = await supabase
          .from('tasks_completed')
          .select('id')
          .eq('user_id', userId)
          .eq('task_id', taskId)
          .maybeSingle()

        if (existing) {
          return NextResponse.json({ error: '今天已经分享过了', code: 'ALREADY_DONE' }, { status: 400 })
        }

        await supabase.from('tasks_completed').insert({ user_id: userId, task_id: taskId })
        pointsToAdd = 10
        description = '分享分析结果 +10分'
        break
      }

      // ── Complete profile ────────────────────────────────────────
      case 'complete_profile': {
        const { data: existing } = await supabase
          .from('tasks_completed')
          .select('id')
          .eq('user_id', userId)
          .eq('task_id', 'complete_profile')
          .maybeSingle()

        if (existing) {
          return NextResponse.json({ error: '已经完成过了', code: 'ALREADY_DONE' }, { status: 400 })
        }

        // Validate payload
        const { display_name } = payload || {}
        if (!display_name || display_name.trim().length < 2) {
          return NextResponse.json({ error: '请输入至少2个字符的昵称', code: 'INVALID_INPUT' }, { status: 400 })
        }

        // Save display name
        await supabase
          .from('user_points')
          .update({ display_name: display_name.trim(), updated_at: new Date().toISOString() })
          .eq('user_id', userId)

        await supabase.from('tasks_completed').insert({ user_id: userId, task_id: 'complete_profile' })
        pointsToAdd = 10
        description = '完善个人资料 +10分（一次性）'
        break
      }

      // ── Redeem use ──────────────────────────────────────────────
      case 'redeem_use': {
        if ((userData.points || 0) < 10) {
          return NextResponse.json({ error: '积分不足（需要10分）', code: 'INSUFFICIENT_POINTS' }, { status: 400 })
        }

        await supabase
          .from('user_points')
          .update({
            points: userData.points - 10,
            extra_uses: (userData.extra_uses || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase.from('points_log').insert({
          user_id: userId,
          points: -10,
          action: 'redeem_use',
          description: '兑换1次额外分析（-10分）'
        })

        return NextResponse.json({
          success: true,
          action: 'redeemed',
          message: '✅ 兑换成功！获得1次额外分析次数',
          new_extra_uses: (userData.extra_uses || 0) + 1,
        })
      }

      default:
        return NextResponse.json({ error: '无效的操作', code: 'INVALID_ACTION' }, { status: 400 })
    }

    if (pointsToAdd > 0) {
      await supabase
        .from('user_points')
        .update({
          points: (userData.points || 0) + pointsToAdd,
          total_earned: (userData.total_earned || 0) + pointsToAdd,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      await supabase.from('points_log').insert({
        user_id: userId,
        points: pointsToAdd,
        action,
        description
      })
    }

    return NextResponse.json({
      success: true,
      points_earned: pointsToAdd,
      description,
      message: `✅ ${description}`,
    })

  } catch (err) {
    console.error('POST /api/points error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
