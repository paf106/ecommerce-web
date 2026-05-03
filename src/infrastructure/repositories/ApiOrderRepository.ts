import type { CreateOrderItem, Order, OrderItem } from '../../domain/entities/Order'
import type { UserSession } from '../../domain/entities/UserSession'
import type { OrderRepository } from '../../domain/repositories/OrderRepository'
import { apiRequest } from '../http/apiClient'

interface OrderResponse {
  id: number
  userId: number
  status: string
  total: number
  createdAt: string
  items: OrderItemResponse[]
}

interface OrderItemResponse {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export class ApiOrderRepository implements OrderRepository {
  create(items: CreateOrderItem[], session: UserSession) {
    return apiRequest<OrderResponse>('/orders', {
      method: 'POST',
      body: { items },
      session,
    }).then(mapOrder)
  }
}

function mapOrder(order: OrderResponse): Order {
  return {
    id: Number(order.id),
    userId: Number(order.userId),
    status: order.status,
    total: Number(order.total),
    createdAt: order.createdAt,
    items: order.items.map(mapOrderItem),
  }
}

function mapOrderItem(item: OrderItemResponse): OrderItem {
  return {
    id: Number(item.id),
    productId: Number(item.productId),
    productName: item.productName,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
    subtotal: Number(item.subtotal),
  }
}
