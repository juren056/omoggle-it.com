/** Bump when replacing files in public/images/ to bust CDN & browser cache */
export const IMAGE_CACHE_VERSION = '20260630'

export function imageUrl(path) {
  if (!path) return path
  const base = path.startsWith('/') ? path : `/${path}`
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}v=${IMAGE_CACHE_VERSION}`
}
