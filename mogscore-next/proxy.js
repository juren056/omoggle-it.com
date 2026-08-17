import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { needsClerk } from '@/lib/auth-route-scope.mjs'

const CANONICAL_HOST = 'omoggle-it.com'
const clerk = clerkMiddleware()

export default function proxy(request, event) {
  const hostname = (request.headers.get('host') || '').split(':')[0].toLowerCase()
  const forwardedProto = request.headers.get('x-forwarded-proto')

  if (hostname === `www.${CANONICAL_HOST}` || (hostname === CANONICAL_HOST && forwardedProto === 'http')) {
    const target = request.nextUrl.clone()
    target.protocol = 'https:'
    target.hostname = CANONICAL_HOST
    target.port = ''
    return NextResponse.redirect(target, 301)
  }

  if (needsClerk(request.nextUrl.pathname)) return clerk(request, event)
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
