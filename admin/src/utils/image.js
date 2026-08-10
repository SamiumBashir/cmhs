export const getImageUrl = (url) => {
  if (!url) return ''
  if (typeof url !== 'string') return ''

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }

  const DEFAULT_BACKEND_HOST = 'https://cmhs-production.up.railway.app'
  const rawHost = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || (import.meta.env.PROD ? DEFAULT_BACKEND_HOST : '')
  const cleanHost = rawHost.replace(/\/api\/?$/, '')

  if (!cleanHost) return url

  return url.startsWith('/') ? `${cleanHost}${url}` : `${cleanHost}/${url}`
}
