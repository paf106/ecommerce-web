import type { UserSession } from '../../domain/entities/UserSession'
import type { AuthCredentials, AuthRepository } from '../../domain/repositories/AuthRepository'
import { apiRequest } from '../http/apiClient'

interface AuthResponse {
  tokenType: string
  accessToken: string
  userId: number
  email: string
}

export class ApiAuthRepository implements AuthRepository {
  login(credentials: AuthCredentials) {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    }).then(mapAuthResponse)
  }

  register(credentials: AuthCredentials) {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: credentials,
    }).then(mapAuthResponse)
  }
}

function mapAuthResponse(response: AuthResponse): UserSession {
  return {
    tokenType: response.tokenType || 'Bearer',
    accessToken: response.accessToken,
    userId: Number(response.userId),
    email: response.email,
  }
}
