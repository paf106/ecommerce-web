import type { UserSession } from '../../domain/entities/UserSession'

const SESSION_STORAGE_KEY = 'ecommerce-web.session'

export function loadStoredSession(): UserSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const value = window.localStorage.getItem(SESSION_STORAGE_KEY)

  if (!value) {
    return null
  }

  try {
    const session = JSON.parse(value) as Partial<UserSession>

    if (!session.accessToken || !session.email || session.userId === undefined || session.userId === null) {
      return null
    }

    return {
      tokenType: session.tokenType || 'Bearer',
      accessToken: session.accessToken,
      userId: Number(session.userId),
      email: session.email,
    }
  } catch {
    return null
  }
}

export function saveStoredSession(session: UserSession) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}
