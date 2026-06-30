/** Placeholder used in public HTML — replaced at render time or via client hydration */
export const CONTACT_EMAIL_PLACEHOLDER = '__CONTACT_EMAIL__'

const DEV_FALLBACK = 'marcushuang4595@gmail.com'

/** Read contact email from Vercel / local env (server + client build) */
export function getContactEmail() {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    process.env.SUPPORT_EMAIL ||
    process.env.CONTACT_EMAIL ||
    (process.env.NODE_ENV === 'development' ? DEV_FALLBACK : '')
  )
}

export const CONTACT_EMAIL = getContactEmail()
export const SUPPORT_EMAIL = CONTACT_EMAIL

export function injectContactEmail(html) {
  if (!html) return html
  const email = getContactEmail()
  if (!email) return html
  return html
    .split(CONTACT_EMAIL_PLACEHOLDER).join(email)
    .replace(/marcushuang4595@gmail\.com/g, email)
}

export function mailtoLink(subject, body) {
  const email = getContactEmail()
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const q = params.toString()
  return `mailto:${email}${q ? `?${q}` : ''}`
}
