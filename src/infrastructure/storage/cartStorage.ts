import type { CartItem } from '../../domain/entities/CartItem'
import type { Product } from '../../domain/entities/Product'

const CART_STORAGE_KEY = 'ecommerce-web.cart'

export function loadStoredCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  const value = window.localStorage.getItem(CART_STORAGE_KEY)

  if (!value) {
    return []
  }

  try {
    const items = JSON.parse(value) as unknown

    if (!Array.isArray(items)) {
      return []
    }

    return items.filter(isCartItem)
  } catch {
    return []
  }
}

export function saveStoredCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

function isCartItem(item: unknown): item is CartItem {
  if (typeof item !== 'object' || item === null) {
    return false
  }

  const candidate = item as { product?: Partial<Product>; quantity?: unknown }

  return (
    isProduct(candidate.product) &&
    typeof candidate.quantity === 'number' &&
    Number.isFinite(candidate.quantity) &&
    candidate.quantity > 0
  )
}

function isProduct(product: Partial<Product> | undefined): product is Product {
  return (
    typeof product?.id === 'number' &&
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    typeof product.price === 'number' &&
    typeof product.categoryId === 'number'
  )
}
