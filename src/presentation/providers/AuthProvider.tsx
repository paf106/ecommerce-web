import { useState, type ReactNode } from 'react'
import { loginUser } from '../../application/auth/loginUser'
import { registerUser } from '../../application/auth/registerUser'
import type { UserSession } from '../../domain/entities/UserSession'
import type { AuthRepository } from '../../domain/repositories/AuthRepository'
import {
  clearStoredSession,
  loadStoredSession,
  saveStoredSession,
} from '../../infrastructure/storage/sessionStorage'
import { AuthContext } from './authContext'

interface AuthProviderProps {
  authRepository: AuthRepository
  children: ReactNode
}

export function AuthProvider({ authRepository, children }: AuthProviderProps) {
  const [session, setSession] = useState<UserSession | null>(() => loadStoredSession())

  async function login(email: string, password: string) {
    const nextSession = await loginUser(authRepository, { email, password })

    saveStoredSession(nextSession)
    setSession(nextSession)
  }

  async function register(email: string, password: string) {
    const nextSession = await registerUser(authRepository, { email, password })

    saveStoredSession(nextSession)
    setSession(nextSession)
  }

  function logout() {
    clearStoredSession()
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
