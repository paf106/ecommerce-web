import { createContext, use } from 'react'
import type { CartItem } from '../../domain/entities/CartItem'
import type { Product } from '../../domain/entities/Product'

export interface CartContextValue {
  items: CartItem[]
  subtotal: number
  totalItems: number
  addProduct(product: Product): void
  removeProduct(productId: number): void
  updateQuantity(productId: number, quantity: number): void
  clearCart(): void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const context = use(CartContext)

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider.')
  }

  return context
}
