const CLERK_PREFIXES = [
  '/dashboard',
  '/account',
  '/profile',
  '/history',
  '/billing',
  '/sign-in',
  '/sign-up',
  '/api/analyze',
  '/api/points',
  '/api/subscription',
  '/api/stripe',
]

export function needsClerk(pathname) {
  return CLERK_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
}
