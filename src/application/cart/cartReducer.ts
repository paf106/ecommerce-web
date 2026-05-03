import type { CartItem } from '../../domain/entities/CartItem'
import type { Product } from '../../domain/entities/Product'

export type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'remove'; productId: number }
  | { type: 'updateQuantity'; productId: number; quantity: number }
  | { type: 'clear' }

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      const existingItem = state.find((item) => item.product.id === action.product.id)

      if (!existingItem) {
        return [...state, { product: action.product, quantity: 1 }]
      }

      return state.map((item) =>
        item.product.id === action.product.id
          ? { ...item, product: action.product, quantity: item.quantity + 1 }
          : item,
      )
    }
    case 'remove':
      return state.filter((item) => item.product.id !== action.productId)
    case 'updateQuantity': {
      if (action.quantity <= 0) {
        return state.filter((item) => item.product.id !== action.productId)
      }

      return state.map((item) =>
        item.product.id === action.productId ? { ...item, quantity: action.quantity } : item,
      )
    }
    case 'clear':
      return []
  }
}
