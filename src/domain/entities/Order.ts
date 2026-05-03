export interface CreateOrderItem {
  productId: number
  quantity: number
}

export interface OrderItem {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: number
  userId: number
  status: string
  total: number
  createdAt: string
  items: OrderItem[]
}
