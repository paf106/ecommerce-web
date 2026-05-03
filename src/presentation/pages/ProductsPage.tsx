import { useDeferredValue, useEffect, useState } from 'react'
import { getProducts } from '../../application/products/getProducts'
import type { Product } from '../../domain/entities/Product'
import type { ProductRepository } from '../../domain/repositories/ProductRepository'
import { EmptyState } from '../components/EmptyState'
import { AppLink } from '../components/AppLink'
import { ProductCard } from '../components/ProductCard'
import { useCart } from '../providers/cartContext'
import { getErrorMessage } from '../utils/getErrorMessage'

interface ProductsPageProps {
  productRepository: ProductRepository
}

type ProductsStatus = 'loading' | 'success' | 'error'

export function ProductsPage({ productRepository }: ProductsPageProps) {
  const { addProduct, totalItems } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<ProductsStatus>('loading')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all')
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    let ignoreResult = false

    getProducts(productRepository)
      .then((nextProducts) => {
        if (!ignoreResult) {
          setProducts(nextProducts)
          setStatus('success')
        }
      })
      .catch((requestError: unknown) => {
        if (!ignoreResult) {
          setError(getErrorMessage(requestError))
          setStatus('error')
        }
      })

    return () => {
      ignoreResult = true
    }
  }, [productRepository])

  const categories = Array.from(new Set(products.map((product) => product.categoryId))).sort((a, b) => a - b)
  const normalizedSearch = deferredSearch.trim().toLowerCase()
  const visibleProducts = products.filter((product) => {
    const matchesSearch = normalizedSearch
      ? `${product.name} ${product.description}`.toLowerCase().includes(normalizedSearch)
      : true
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
        <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">Catálogo</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Productos listos para añadir al carrito.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Consulta el inventario desde la API, filtra por categoría y prepara tu pedido.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <span className="text-sm font-semibold text-slate-300">Productos en carrito</span>
            <div className="mt-2 flex items-end justify-between gap-4">
              <strong className="text-5xl font-black">{totalItems}</strong>
              <AppLink
                to="/cart"
                className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-emerald-100"
              >
                Ver carrito
              </AppLink>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
        <label>
          <span className="sr-only">Buscar productos</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="search"
            placeholder="Buscar por nombre o descripción"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={getCategoryClassName(selectedCategory === 'all')}
          >
            Todas
          </button>
          {categories.map((categoryId) => (
            <button
              key={categoryId}
              type="button"
              onClick={() => setSelectedCategory(categoryId)}
              className={getCategoryClassName(selectedCategory === categoryId)}
            >
              Cat. {categoryId}
            </button>
          ))}
        </div>
      </div>

      {status === 'loading' ? <ProductGridSkeleton /> : null}

      {status === 'error' ? (
        <EmptyState
          eyebrow="API"
          title="No se pudieron cargar los productos"
          description={error}
          action={
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Reintentar
            </button>
          }
        />
      ) : null}

      {status === 'success' && visibleProducts.length === 0 ? (
        <EmptyState
          eyebrow="Sin resultados"
          title="No hay productos para ese filtro"
          description="Prueba con otro término de búsqueda o selecciona otra categoría."
        />
      ) : null}

      {status === 'success' && visibleProducts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addProduct} />
          ))}
        </div>
      ) : null}
    </section>
  )
}

function getCategoryClassName(isSelected: boolean) {
  const baseClassName = 'whitespace-nowrap rounded-full px-4 py-2 text-sm font-black transition'

  return isSelected
    ? `${baseClassName} bg-slate-950 text-white shadow-lg shadow-slate-950/15`
    : `${baseClassName} bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950`
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-96 animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-40 rounded-[1.5rem] bg-slate-100" />
          <div className="mt-5 h-6 w-2/3 rounded-full bg-slate-100" />
          <div className="mt-3 h-4 rounded-full bg-slate-100" />
          <div className="mt-2 h-4 w-3/4 rounded-full bg-slate-100" />
          <div className="mt-8 flex items-center justify-between">
            <div className="h-8 w-24 rounded-full bg-slate-100" />
            <div className="h-10 w-24 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  )
}
