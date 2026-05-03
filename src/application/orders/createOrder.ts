import type { CartItem } from '../../domain/entities/CartItem'
import type { Order } from '../../domain/entities/Order'
import type { UserSession } from '../../domain/entities/UserSession'
import type { OrderRepository } from '../../domain/repositories/OrderRepository'

export function createOrder(
  orderRepository: OrderRepository,
  session: UserSession,
  cartItems: CartItem[],
): Promise<Order> {
  const items = cartItems
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }))

  if (items.length === 0) {
    throw new Error('El carrito no tiene productos para comprar.')
  }

  return orderRepository.create(items, session)
}
