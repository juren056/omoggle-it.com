import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSubscriptionSnapshot } from '@/lib/subscription-snapshot'

export async function GET() {
  const { userId } = await auth()
  return NextResponse.json(await getSubscriptionSnapshot(userId))
}
