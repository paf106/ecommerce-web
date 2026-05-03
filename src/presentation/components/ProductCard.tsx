import type { Product } from '../../domain/entities/Product'
import { formatCurrency } from '../utils/formatCurrency'

const productTones = [
  'from-emerald-200 via-teal-100 to-white',
  'from-amber-200 via-orange-100 to-white',
  'from-sky-200 via-cyan-100 to-white',
  'from-violet-200 via-fuchsia-100 to-white',
  'from-rose-200 via-pink-100 to-white',
]

interface ProductCardProps {
  product: Product
  onAdd(product: Product): void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const tone = productTones[Math.abs(product.categoryId) % productTones.length]

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
      <div className={`relative min-h-44 bg-gradient-to-br ${tone} p-5`}>
        <div className="absolute right-5 top-5 rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-600 backdrop-blur">
          Cat. {product.categoryId}
        </div>
        <div className="grid size-24 place-items-center rounded-[2rem] bg-white/80 text-4xl font-black text-slate-950 shadow-lg shadow-slate-950/10 backdrop-blur transition group-hover:scale-105">
          {product.name.slice(0, 1).toUpperCase()}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-1 flex-col gap-3">
          <h2 className="text-xl font-black tracking-tight text-slate-950">{product.name}</h2>
          <p className="line-clamp-3 text-sm leading-6 text-slate-600">{product.description}</p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="text-2xl font-black tracking-tight text-slate-950">
            {formatCurrency(product.price)}
          </span>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            Añadir
          </button>
        </div>
      </div>
    </article>
  )
}
