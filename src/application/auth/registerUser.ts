import type { AuthCredentials, AuthRepository } from '../../domain/repositories/AuthRepository'

export function registerUser(authRepository: AuthRepository, credentials: AuthCredentials) {
  return authRepository.register(credentials)
}
