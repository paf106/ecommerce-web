import type { Product } from '../../domain/entities/Product'
import type { ProductRepository } from '../../domain/repositories/ProductRepository'
import { apiRequest } from '../http/apiClient'

interface ProductResponse {
  id: number
  name: string
  description: string
  price: number
  categoryId: number
}

export class ApiProductRepository implements ProductRepository {
  getAll() {
    return apiRequest<ProductResponse[]>('/products').then((products) => products.map(mapProduct))
  }
}

function mapProduct(product: ProductResponse): Product {
  return {
    id: Number(product.id),
    name: product.name,
    description: product.description,
    price: Number(product.price),
    categoryId: Number(product.categoryId),
  }
}
