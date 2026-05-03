import { startTransition, useEffect, useState, type ReactNode } from 'react'
import { RouterContext, type AppPath } from './routerContext'
const availablePaths = new Set<string>(['/', '/login', '/register', '/products', '/cart', '/checkout'])

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState<AppPath>(() => getCurrentPath())

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath())

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(path: AppPath) {
    if (path === currentPath) {
      return
    }

    window.history.pushState(null, '', path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    startTransition(() => setCurrentPath(path))
  }

  return <RouterContext.Provider value={{ currentPath, navigate }}>{children}</RouterContext.Provider>
}

function getCurrentPath(): AppPath {
  if (typeof window === 'undefined') {
    return '/products'
  }

  return normalizePath(window.location.pathname)
}

function normalizePath(pathname: string): AppPath {
  if (availablePaths.has(pathname)) {
    return pathname as AppPath
  }

  return '/products'
}
