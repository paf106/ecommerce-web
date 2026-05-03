import { dependencies } from './presentation/composition/dependencies'
import { AppLayout } from './presentation/components/AppLayout'
import { CartPage } from './presentation/pages/CartPage'
import { CheckoutPage } from './presentation/pages/CheckoutPage'
import { LoginPage } from './presentation/pages/LoginPage'
import { ProductsPage } from './presentation/pages/ProductsPage'
import { RegisterPage } from './presentation/pages/RegisterPage'
import { AuthProvider } from './presentation/providers/AuthProvider'
import { CartProvider } from './presentation/providers/CartProvider'
import { RouterProvider } from './presentation/router/RouterProvider'
import { useRouter } from './presentation/router/routerContext'

function App() {
  return (
    <RouterProvider>
      <AuthProvider authRepository={dependencies.authRepository}>
        <CartProvider>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </CartProvider>
      </AuthProvider>
    </RouterProvider>
  )
}

function AppRoutes() {
  const { currentPath } = useRouter()

  switch (currentPath) {
    case '/login':
      return <LoginPage />
    case '/register':
      return <RegisterPage />
    case '/cart':
      return <CartPage />
    case '/checkout':
      return <CheckoutPage orderRepository={dependencies.orderRepository} />
    case '/':
    case '/products':
      return <ProductsPage productRepository={dependencies.productRepository} />
  }
}

export default App
