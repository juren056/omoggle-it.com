import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

async function getUserId(req) {
  try {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = await auth()
    return userId || null
  } catch { return null }
}

// GET /api/points — get user points & stats
export async function GET(req) {
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const supabase = getSupabase()

  // Get or create user points record
  let { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code === 'PGRST116') {
    // User doesn't exist yet, create
    const { data: newData, error: createErr } = await supabase
      .from('user_points')
      .insert({ user_id: userId, points: 0, total_earned: 0, extra_uses: 0 })
      .select()
      .single()
    if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 })
    data = newData
  } else if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get recent log
  const { data: logs } = await supabase
    .from('points_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  // Check today's checkin
  const today = new Date().toISOString().split('T')[0]
  const { data: checkin } = await supabase
    .from('daily_checkins')
    .select('id')
    .eq('user_id', userId)
    .eq('checkin_date', today)
    .single()

  return NextResponse.json({
    points: data.points || 0,
    total_earned: data.total_earned || 0,
    extra_uses: data.extra_uses || 0,
    logs: logs || [],
    checked_in_today: !!checkin,
  })
}

// POST /api/points — perform action to earn points
export async function POST(req) {
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { action } = await req.json()
  const supabase = getSupabase()
  const today = new Date().toISOString().split('T')[0]

  let pointsToAdd = 0
  let description = ''
  let taskId = null

  switch (action) {
    case 'daily_checkin':
      // Check if already checked in today
      const { data: existing } = await supabase
        .from('daily_checkins')
        .select('id')
        .eq('user_id', userId)
        .eq('checkin_date', today)
        .single()
      
      if (existing) return NextResponse.json({ error: 'Already checked in today' }, { status: 400 })
      
      // Record checkin
      await supabase.from('daily_checkins').insert({ user_id: userId, checkin_date: today })
      pointsToAdd = 5
      description = '每日签到 +5分'
      break

    case 'share_result':
      // Can share once per day
      taskId = `share_${today}`
      const { data: sharedToday } = await supabase
        .from('tasks_completed')
        .select('id')
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .single()
      
      if (sharedToday) return NextResponse.json({ error: 'Already shared today' }, { status: 400 })
      
      await supabase.from('tasks_completed').insert({ user_id: userId, task_id: taskId })
      pointsToAdd = 10
      description = '分享结果 +10分'
      break

    case 'complete_profile':
      // One-time task
      taskId = 'complete_profile'
      const { data: profileDone } = await supabase
        .from('tasks_completed')
        .select('id')
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .single()
      
      if (profileDone) return NextResponse.json({ error: 'Already completed' }, { status: 400 })
      
      await supabase.from('tasks_completed').insert({ user_id: userId, task_id: taskId })
      pointsToAdd = 10
      description = '完善个人资料 +10分（一次性）'
      break

    case 'redeem_use':
      // Spend 10 points for 1 extra use
      const { data: userData } = await supabase
        .from('user_points')
        .select('points, extra_uses')
        .eq('user_id', userId)
        .single()
      
      if (!userData || userData.points < 10) {
        return NextResponse.json({ error: 'Insufficient points (need 10)' }, { status: 400 })
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
      
      return NextResponse.json({ success: true, action: 'redeemed', message: '兑换成功！获得1次额外分析' })

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  if (pointsToAdd > 0) {
    // Get current points
    let { data: current } = await supabase
      .from('user_points')
      .select('points, total_earned')
      .eq('user_id', userId)
      .single()

    if (!current) {
      // Create user record
      await supabase.from('user_points').insert({
        user_id: userId, points: pointsToAdd, 
        total_earned: pointsToAdd, extra_uses: 0
      })
    } else {
      await supabase
        .from('user_points')
        .update({
          points: (current.points || 0) + pointsToAdd,
          total_earned: (current.total_earned || 0) + pointsToAdd,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
    }

    // Log the action
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
    description 
  })
}
