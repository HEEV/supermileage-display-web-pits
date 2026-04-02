const AUTH_TOKEN_KEY = 'supermileage_jwt'

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(AUTH_TOKEN_KEY)
}

export const setAuthToken = (token: string) => {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const clearAuthToken = () => {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY)
}

export const extractAuthToken = (value: unknown) => {
  if (!value || typeof value !== 'object' || !('token' in value)) return null

  const token = (value as { token?: unknown }).token
  if (typeof token !== 'string') return null

  const trimmed = token.trim()
  return trimmed.length > 0 ? trimmed : null
}
