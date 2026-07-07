import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabase } from '@/lib/supabase'

async function ensureUser(supabase, userId) {
  const { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error?.code === 'PGRST116') {
    const { data: newData, error: insertError } = await supabase
      .from('user_points')
      .insert({ user_id: userId, points: 0, total_earned: 0, extra_uses: 0 })
      .select()
      .single()
    if (insertError) throw new Error(insertError.message)
    return newData
  }
  if (error) throw new Error(error.message)
  return data
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, { status: 401 })
  }

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

    const taskIds = (tasks || []).map(t => t.task_id)

    return NextResponse.json({
      points: userData.points || 0,
      total_earned: userData.total_earned || 0,
      extra_uses: userData.extra_uses || 0,
      display_name: userData.display_name || null,
      logs: logs || [],
      checked_in_today: !!checkin,
      shared_today: taskIds.includes(`share_${today}`),
      profile_complete: taskIds.includes('complete_profile'),
    })
  } catch (err) {
    console.error('[points GET]', err.message)
    return NextResponse.json({ error: err.message, code: 'DB_ERROR' }, { status: 500 })
  }
}

export async function POST(req) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, { status: 401 })
  }

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

  const { action, payload } = body
  const today = new Date().toISOString().split('T')[0]

  try {
    const userData = await ensureUser(supabase, userId)
    let pointsToAdd = 0
    let description = ''

    switch (action) {
      case 'daily_checkin': {
        const { data: ex } = await supabase.from('daily_checkins').select('id')
          .eq('user_id', userId).eq('checkin_date', today).maybeSingle()
        if (ex) return NextResponse.json({ error: 'You already checked in today' }, { status: 400 })
        await supabase.from('daily_checkins').insert({ user_id: userId, checkin_date: today })
        pointsToAdd = 5
        description = 'Daily check-in +5 pts'
        break
      }
      case 'share_result': {
        const taskId = `share_${today}`
        const { data: ex } = await supabase.from('tasks_completed').select('id')
          .eq('user_id', userId).eq('task_id', taskId).maybeSingle()
        if (ex) return NextResponse.json({ error: 'You already shared today' }, { status: 400 })
        await supabase.from('tasks_completed').insert({ user_id: userId, task_id: taskId })
        pointsToAdd = 10
        description = 'Shared analysis result +10 pts'
        break
      }
      case 'complete_profile': {
        const { data: ex } = await supabase.from('tasks_completed').select('id')
          .eq('user_id', userId).eq('task_id', 'complete_profile').maybeSingle()
        if (ex) return NextResponse.json({ error: 'Already completed' }, { status: 400 })
        const name = (payload?.display_name || '').trim()
        if (name.length < 2) return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
        await supabase.from('user_points')
          .update({ display_name: name, updated_at: new Date().toISOString() })
          .eq('user_id', userId)
        await supabase.from('tasks_completed').insert({ user_id: userId, task_id: 'complete_profile' })
        pointsToAdd = 10
        description = 'Completed profile +10 pts'
        break
      }
      case 'redeem_use': {
        if ((userData.points || 0) < 10) {
          return NextResponse.json({ error: 'Not enough points (10 required)' }, { status: 400 })
        }
        await supabase.from('user_points').update({
          points: userData.points - 10,
          extra_uses: (userData.extra_uses || 0) + 1,
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId)
        await supabase.from('points_log').insert({
          user_id: userId, points: -10, action: 'redeem_use', description: 'Redeemed 1 extra analysis (-10 pts)',
        })
        return NextResponse.json({ success: true, message: '✅ Redeemed! You got 1 extra analysis' })
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (pointsToAdd > 0) {
      await supabase.from('user_points').update({
        points: (userData.points || 0) + pointsToAdd,
        total_earned: (userData.total_earned || 0) + pointsToAdd,
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId)
      await supabase.from('points_log').insert({
        user_id: userId, points: pointsToAdd, action, description,
      })
    }

    return NextResponse.json({ success: true, points_earned: pointsToAdd, message: `✅ ${description}` })
  } catch (err) {
    console.error('[points POST]', err.message)
    return NextResponse.json({ error: err.message, code: 'DB_ERROR' }, { status: 500 })
  }
}
