import type { UserSession } from '../entities/UserSession'

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthRepository {
  login(credentials: AuthCredentials): Promise<UserSession>
  register(credentials: AuthCredentials): Promise<UserSession>
}
