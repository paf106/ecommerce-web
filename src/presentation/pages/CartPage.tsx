import { AppLink } from '../components/AppLink'
import { EmptyState } from '../components/EmptyState'
import { useCart } from '../providers/cartContext'
import { formatCurrency } from '../utils/formatCurrency'

export function CartPage() {
  const { clearCart, items, removeProduct, subtotal, updateQuantity } = useCart()

  if (items.length === 0) {
    return (
      <EmptyState
        eyebrow="Carrito"
        title="Tu carrito está vacío"
        description="Añade productos desde el catálogo para preparar tu pedido."
        action={
          <AppLink
            to="/products"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            Ver productos
          </AppLink>
        }
      />
    )
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-slate-950 p-6 text-white sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">Carrito</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">Productos seleccionados</h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.product.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                    Categoría {item.product.categoryId}
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{item.product.name}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{item.product.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="grid size-9 place-items-center rounded-full text-lg font-black text-slate-600 transition hover:bg-white hover:text-slate-950"
                      aria-label={`Reducir cantidad de ${item.product.name}`}
                    >
                      -
                    </button>
                    <input
                      aria-label={`Cantidad de ${item.product.name}`}
                      min={1}
                      type="number"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.product.id, Number(event.target.value))}
                      className="w-14 bg-transparent text-center font-black text-slate-950 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="grid size-9 place-items-center rounded-full text-lg font-black text-slate-600 transition hover:bg-white hover:text-slate-950"
                      aria-label={`Aumentar cantidad de ${item.product.name}`}
                    >
                      +
                    </button>
                  </div>

                  <div className="min-w-32 text-right">
                    <p className="text-sm font-semibold text-slate-500">Subtotal</p>
                    <p className="text-xl font-black text-slate-950">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeProduct(item.product.id)}
                    className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-100"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="sticky top-36 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Resumen</p>
        <div className="mt-6 space-y-4 text-sm">
          <div className="flex items-center justify-between gap-4 text-slate-600">
            <span>Productos</span>
            <span>{items.length}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-black text-slate-950">Total</span>
              <span className="text-2xl font-black text-slate-950">{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </div>

        <AppLink
          to="/checkout"
          className="mt-8 flex w-full justify-center rounded-2xl bg-emerald-500 px-5 py-3 font-black text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
        >
          Ir al checkout
        </AppLink>
      </aside>
    </section>
  )
}
