import type { CartItem } from '../../domain/entities/CartItem'

export function calculateCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
}

export function calculateCartItemsCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0)
}
