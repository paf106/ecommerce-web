import type { CreateOrderItem, Order } from '../entities/Order'
import type { UserSession } from '../entities/UserSession'

export interface OrderRepository {
  create(items: CreateOrderItem[], session: UserSession): Promise<Order>
}
