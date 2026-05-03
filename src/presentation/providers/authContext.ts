import { createContext, use } from 'react'
import type { UserSession } from '../../domain/entities/UserSession'

export interface AuthContextValue {
  session: UserSession | null
  isAuthenticated: boolean
  login(email: string, password: string): Promise<void>
  register(email: string, password: string): Promise<void>
  logout(): void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = use(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.')
  }

  return context
}
