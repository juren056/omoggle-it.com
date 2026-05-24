import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

// More robust auth - try multiple methods
async function getUserId(req) {
  // Method 1: Clerk server auth
  try {
    const { auth } = await import('@clerk/nextjs/server')
    const session = await auth()
    if (session?.userId) return session.userId
  } catch (e) {
    console.log('Clerk auth method 1 failed:', e.message)
  }

  // Method 2: Read from Authorization header (Clerk JWT)
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      // Decode JWT payload (no verification - just read userId)
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      )
      if (payload.sub) return payload.sub
    }
  } catch {}

  // Method 3: Read from cookie
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const sessionMatch = cookieHeader.match(/__session=([^;]+)/)
    if (sessionMatch) {
      const token = sessionMatch[1]
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      )
      if (payload.sub) return payload.sub
    }
  } catch {}

  return null
}

async function ensureUser(supabase, userId) {
  const { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error?.code === 'PGRST116') {
    const { data: newData, error: e2 } = await supabase
      .from('user_points')
      .insert({ user_id: userId, points: 0, total_earned: 0, extra_uses: 0 })
      .select().single()
    if (e2) throw new Error(e2.message)
    return newData
  }
  if (error) throw new Error(error.message)
  return data
}

export async function GET(req) {
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, { status: 401 })

  try {
    const supabase = getSupabase()
    const userData = await ensureUser(supabase, userId)

    const { data: logs } = await supabase
      .from('points_log').select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }).limit(20)

    const today = new Date().toISOString().split('T')[0]

    const { data: checkin } = await supabase
      .from('daily_checkins').select('id')
      .eq('user_id', userId).eq('checkin_date', today).maybeSingle()

    const { data: tasks } = await supabase
      .from('tasks_completed').select('task_id').eq('user_id', userId)

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
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' }, { status: 401 })

  let body
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const { action, payload } = body
  const supabase = getSupabase()
  const today = new Date().toISOString().split('T')[0]

  try {
    const userData = await ensureUser(supabase, userId)
    let pointsToAdd = 0, description = ''

    switch (action) {
      case 'daily_checkin': {
        const { data: ex } = await supabase.from('daily_checkins').select('id')
          .eq('user_id', userId).eq('checkin_date', today).maybeSingle()
        if (ex) return NextResponse.json({ error: '今天已经签到过了' }, { status: 400 })
        await supabase.from('daily_checkins').insert({ user_id: userId, checkin_date: today })
        pointsToAdd = 5; description = '每日签到 +5分'
        break
      }
      case 'share_result': {
        const taskId = `share_${today}`
        const { data: ex } = await supabase.from('tasks_completed').select('id')
          .eq('user_id', userId).eq('task_id', taskId).maybeSingle()
        if (ex) return NextResponse.json({ error: '今天已经分享过了' }, { status: 400 })
        await supabase.from('tasks_completed').insert({ user_id: userId, task_id: taskId })
        pointsToAdd = 10; description = '分享分析结果 +10分'
        break
      }
      case 'complete_profile': {
        const { data: ex } = await supabase.from('tasks_completed').select('id')
          .eq('user_id', userId).eq('task_id', 'complete_profile').maybeSingle()
        if (ex) return NextResponse.json({ error: '已经完成过了' }, { status: 400 })
        const name = (payload?.display_name || '').trim()
        if (name.length < 2) return NextResponse.json({ error: '昵称至少2个字符' }, { status: 400 })
        await supabase.from('user_points')
          .update({ display_name: name, updated_at: new Date().toISOString() })
          .eq('user_id', userId)
        await supabase.from('tasks_completed').insert({ user_id: userId, task_id: 'complete_profile' })
        pointsToAdd = 10; description = '完善个人资料 +10分'
        break
      }
      case 'redeem_use': {
        if ((userData.points || 0) < 10)
          return NextResponse.json({ error: '积分不足（需要10分）' }, { status: 400 })
        await supabase.from('user_points').update({
          points: userData.points - 10,
          extra_uses: (userData.extra_uses || 0) + 1,
          updated_at: new Date().toISOString()
        }).eq('user_id', userId)
        await supabase.from('points_log').insert({
          user_id: userId, points: -10, action: 'redeem_use', description: '兑换1次额外分析（-10分）'
        })
        return NextResponse.json({ success: true, message: '✅ 兑换成功！获得1次额外分析' })
      }
      default:
        return NextResponse.json({ error: '无效操作' }, { status: 400 })
    }

    if (pointsToAdd > 0) {
      await supabase.from('user_points').update({
        points: (userData.points || 0) + pointsToAdd,
        total_earned: (userData.total_earned || 0) + pointsToAdd,
        updated_at: new Date().toISOString()
      }).eq('user_id', userId)
      await supabase.from('points_log').insert({
        user_id: userId, points: pointsToAdd, action, description
      })
    }

    return NextResponse.json({ success: true, points_earned: pointsToAdd, message: `✅ ${description}` })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
