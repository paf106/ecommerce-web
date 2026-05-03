import { createContext, use } from 'react'

export type AppPath = '/' | '/login' | '/register' | '/products' | '/cart' | '/checkout'

export interface RouterContextValue {
  currentPath: AppPath
  navigate(path: AppPath): void
}

export const RouterContext = createContext<RouterContextValue | null>(null)

export function useRouter() {
  const context = use(RouterContext)

  if (!context) {
    throw new Error('useRouter debe usarse dentro de RouterProvider.')
  }

  return context
}
