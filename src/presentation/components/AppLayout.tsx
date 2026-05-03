import type { ReactNode } from 'react'
import { useAuth } from '../providers/authContext'
import { useCart } from '../providers/cartContext'
import { useRouter, type AppPath } from '../router/routerContext'
import { AppLink } from './AppLink'

export function AppLayout({ children }: { children: ReactNode }) {
  const { currentPath, navigate } = useRouter()
  const { isAuthenticated, logout, session } = useAuth()
  const { totalItems } = useCart()

  function handleLogout() {
    logout()
    navigate('/products')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <AppLink to="/products" className="group flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-lg shadow-slate-950/20 transition group-hover:-rotate-3">
                E
              </span>
              <span>
                <span className="block text-lg font-black tracking-tight">Ecommerce TFG</span>
                <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
                  React 19 Store
                </span>
              </span>
            </AppLink>

            <div className="flex flex-wrap items-center gap-2">
              {isAuthenticated ? (
                <>
                  <span className="hidden rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 sm:inline-flex">
                    {session?.email}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <AppLink
                    to="/login"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    Login
                  </AppLink>
                  <AppLink
                    to="/register"
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Registro
                  </AppLink>
                </>
              )}
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1 text-sm font-bold">
            <AppLink to="/products" className={getNavClassName('/products', currentPath)}>
              Productos
            </AppLink>
            <AppLink to="/cart" className={getNavClassName('/cart', currentPath)}>
              Carrito
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs text-slate-950">{totalItems}</span>
            </AppLink>
            <AppLink to="/checkout" className={getNavClassName('/checkout', currentPath)}>
              Checkout
            </AppLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>Ecommerce TFG con React 19, Tailwind y clean architecture.</span>
          <span>API: /api/v1</span>
        </div>
      </footer>
    </div>
  )
}

function getNavClassName(path: AppPath, currentPath: AppPath) {
  const baseClassName =
    'inline-flex items-center gap-2 rounded-full px-4 py-2 transition whitespace-nowrap'

  if (path === currentPath || (path === '/products' && currentPath === '/')) {
    return `${baseClassName} bg-slate-950 text-white shadow-lg shadow-slate-950/15`
  }

  return `${baseClassName} bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-950`
}
