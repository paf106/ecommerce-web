import { useActionState } from 'react'
import { useAuth } from '../providers/authContext'
import { useRouter } from '../router/routerContext'
import { getErrorMessage } from '../utils/getErrorMessage'
import { getFormString } from '../utils/formData'
import { AppLink } from '../components/AppLink'

interface AuthFormState {
  error: string
}

const initialAuthFormState: AuthFormState = { error: '' }

export function LoginPage() {
  const { isAuthenticated, login, session } = useAuth()
  const { navigate } = useRouter()
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    async (_previousState, formData) => {
      const email = getFormString(formData, 'email')
      const password = getFormString(formData, 'password')

      if (!email || !password) {
        return { error: 'Introduce email y password para iniciar sesión.' }
      }

      try {
        await login(email, password)
        navigate('/products')

        return initialAuthFormState
      } catch (error) {
        return { error: getErrorMessage(error) }
      }
    },
    initialAuthFormState,
  )

  if (isAuthenticated) {
    return (
      <section className="mx-auto max-w-xl rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-xl shadow-slate-200/60">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Sesión activa</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Ya has iniciado sesión</h1>
        <p className="mt-3 text-slate-600">Estás conectado como {session?.email}.</p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mt-8 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
        >
          Ver productos
        </button>
      </section>
    )
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20 sm:p-12">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">Bienvenido</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Compra rápido y sin fricción.</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
          Inicia sesión para completar pedidos con tu token bearer y mantener la experiencia conectada a la API.
        </p>
      </div>

      <form action={formAction} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Login</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Accede a tu cuenta</h2>
        </div>

        {state.error ? (
          <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {state.error}
          </p>
        ) : null}

        <label className="mt-6 block">
          <span className="text-sm font-bold text-slate-700">Email</span>
          <input
            required
            autoComplete="email"
            type="email"
            name="email"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            placeholder="tu@email.com"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-bold text-slate-700">Password</span>
          <input
            required
            autoComplete="current-password"
            type="password"
            name="password"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="mt-8 w-full rounded-2xl bg-emerald-500 px-5 py-3 font-black text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {isPending ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿No tienes cuenta?{' '}
          <AppLink to="/register" className="font-black text-slate-950 underline decoration-emerald-300 decoration-4 underline-offset-4">
            Regístrate
          </AppLink>
        </p>
      </form>
    </section>
  )
}
