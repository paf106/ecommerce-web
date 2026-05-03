import { useEffect, useReducer, type ReactNode } from 'react'
import {
  calculateCartItemsCount,
  calculateCartSubtotal,
} from '../../application/cart/cartCalculations'
import { cartReducer } from '../../application/cart/cartReducer'
import type { Product } from '../../domain/entities/Product'
import { loadStoredCart, saveStoredCart } from '../../infrastructure/storage/cartStorage'
import { CartContext } from './cartContext'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => loadStoredCart())

  useEffect(() => {
    saveStoredCart(items)
  }, [items])

  function addProduct(product: Product) {
    dispatch({ type: 'add', product })
  }

  function removeProduct(productId: number) {
    dispatch({ type: 'remove', productId })
  }

  function updateQuantity(productId: number, quantity: number) {
    dispatch({ type: 'updateQuantity', productId, quantity })
  }

  function clearCart() {
    dispatch({ type: 'clear' })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal: calculateCartSubtotal(items),
        totalItems: calculateCartItemsCount(items),
        addProduct,
        removeProduct,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
