import type { AuthCredentials, AuthRepository } from '../../domain/repositories/AuthRepository'

export function loginUser(authRepository: AuthRepository, credentials: AuthCredentials) {
  return authRepository.login(credentials)
}
