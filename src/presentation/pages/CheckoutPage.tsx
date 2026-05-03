import { useActionState } from 'react'
import { createOrder } from '../../application/orders/createOrder'
import type { Order } from '../../domain/entities/Order'
import type { OrderRepository } from '../../domain/repositories/OrderRepository'
import { AppLink } from '../components/AppLink'
import { EmptyState } from '../components/EmptyState'
import { useAuth } from '../providers/authContext'
import { useCart } from '../providers/cartContext'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'
import { getErrorMessage } from '../utils/getErrorMessage'

interface CheckoutPageProps {
  orderRepository: OrderRepository
}

interface CheckoutFormState {
  status: 'idle' | 'success' | 'error'
  message: string
  order: Order | null
}

const initialCheckoutFormState: CheckoutFormState = {
  status: 'idle',
  message: '',
  order: null,
}

export function CheckoutPage({ orderRepository }: CheckoutPageProps) {
  const { isAuthenticated, session } = useAuth()
  const { clearCart, items, subtotal } = useCart()
  const [state, formAction, isPending] = useActionState<CheckoutFormState, FormData>(
    async () => {
      if (!session) {
        return {
          status: 'error',
          message: 'Inicia sesión para crear el pedido.',
          order: null,
        }
      }

      if (items.length === 0) {
        return {
          status: 'error',
          message: 'Añade productos al carrito antes de hacer checkout.',
          order: null,
        }
      }

      try {
        const order = await createOrder(orderRepository, session, items)

        clearCart()

        return {
          status: 'success',
          message: 'Pedido creado correctamente.',
          order,
        }
      } catch (error) {
        return {
          status: 'error',
          message: getErrorMessage(error),
          order: null,
        }
      }
    },
    initialCheckoutFormState,
  )

  if (state.status === 'success' && state.order) {
    return <OrderConfirmation order={state.order} />
  }

  if (!isAuthenticated) {
    return (
      <EmptyState
        eyebrow="Checkout"
        title="Inicia sesión para hacer el pedido"
        description="El endpoint de pedidos requiere Authorization: Bearer token. Entra con tu cuenta o regístrate para continuar."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <AppLink
              to="/login"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Login
            </AppLink>
            <AppLink
              to="/register"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100"
            >
              Registro
            </AppLink>
          </div>
        }
      />
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        eyebrow="Checkout"
        title="No hay productos para comprar"
        description="El carrito está vacío. Añade productos antes de confirmar un pedido."
        action={
          <AppLink
            to="/products"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            Volver al catálogo
          </AppLink>
        }
      />
    )
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
      <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20 sm:p-12">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">Checkout</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Confirma tu pedido</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Se enviará un POST a <span className="font-black text-white">/orders</span> con los productos del carrito y tu token bearer.
        </p>

        {state.status === 'error' ? (
          <p className="mt-8 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
            {state.message}
          </p>
        ) : null}

        <form action={formAction} className="mt-8">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-2xl bg-emerald-500 px-6 py-4 font-black text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 disabled:opacity-60"
          >
            {isPending ? 'Creando pedido...' : 'Confirmar pedido'}
          </button>
        </form>
      </div>

      <OrderSummary items={items} subtotal={subtotal} />
    </section>
  )
}

function OrderSummary({ items, subtotal }: Pick<ReturnType<typeof useCart>, 'items' | 'subtotal'>) {
  return (
    <aside className="sticky top-36 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Resumen</p>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0">
            <div>
              <p className="font-black text-slate-950">{item.product.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                {item.quantity} x {formatCurrency(item.product.price)}
              </p>
            </div>
            <p className="font-black text-slate-950">{formatCurrency(item.product.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
        <span className="text-lg font-black text-slate-950">Total</span>
        <span className="text-2xl font-black text-slate-950">{formatCurrency(subtotal)}</span>
      </div>
    </aside>
  )
}

function OrderConfirmation({ order }: { order: Order }) {
  return (
    <section className="mx-auto max-w-4xl rounded-[2.5rem] border border-emerald-100 bg-white p-8 shadow-2xl shadow-slate-200/70 sm:p-12">
      <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-600">Pedido creado</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Gracias por tu compra</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">
        Pedido #{order.id} creado el {formatDate(order.createdAt)} con estado <strong>{order.status}</strong>.
      </p>

      <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
        {order.items.map((item) => (
          <div key={item.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-black text-slate-950">{item.productName}</p>
              <p className="mt-1 text-sm text-slate-500">
                {item.quantity} x {formatCurrency(item.unitPrice)}
              </p>
            </div>
            <p className="font-black text-slate-950">{formatCurrency(item.subtotal)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <span className="text-lg font-black">Total pagado</span>
        <span className="text-3xl font-black">{formatCurrency(order.total)}</span>
      </div>

      <AppLink
        to="/products"
        className="mt-8 inline-flex rounded-full bg-emerald-500 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-600"
      >
        Seguir comprando
      </AppLink>
    </section>
  )
}
