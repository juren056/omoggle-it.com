import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/tools(.*)',
  '/blog(.*)',
  '/what-is-omoggle(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/analyze(.*)',
  '/api/detect-lang(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // All routes are public — auth is optional
  // Protected routes can be added here later
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
