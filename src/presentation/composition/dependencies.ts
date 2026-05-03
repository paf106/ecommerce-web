import { ApiAuthRepository } from '../../infrastructure/repositories/ApiAuthRepository'
import { ApiOrderRepository } from '../../infrastructure/repositories/ApiOrderRepository'
import { ApiProductRepository } from '../../infrastructure/repositories/ApiProductRepository'

export const dependencies = {
  authRepository: new ApiAuthRepository(),
  orderRepository: new ApiOrderRepository(),
  productRepository: new ApiProductRepository(),
} as const
