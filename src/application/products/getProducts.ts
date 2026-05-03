import type { ProductRepository } from '../../domain/repositories/ProductRepository'

export function getProducts(productRepository: ProductRepository) {
  return productRepository.getAll()
}
