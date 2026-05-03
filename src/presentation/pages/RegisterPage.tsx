import { useActionState } from 'react'
import { AppLink } from '../components/AppLink'
import { useAuth } from '../providers/authContext'
import { useRouter } from '../router/routerContext'
import { getFormString } from '../utils/formData'
import { getErrorMessage } from '../utils/getErrorMessage'

interface RegisterFormState {
  error: string
}

const initialRegisterFormState: RegisterFormState = { error: '' }

export function RegisterPage() {
  const { isAuthenticated, register, session } = useAuth()
  const { navigate } = useRouter()
  const [state, formAction, isPending] = useActionState<RegisterFormState, FormData>(
    async (_previousState, formData) => {
      const email = getFormString(formData, 'email')
      const password = getFormString(formData, 'password')

      if (!email || !password) {
        return { error: 'Introduce email y password para crear la cuenta.' }
      }

      if (password.length < 6) {
        return { error: 'La password debe tener al menos 6 caracteres.' }
      }

      try {
        await register(email, password)
        navigate('/products')

        return initialRegisterFormState
      } catch (error) {
        return { error: getErrorMessage(error) }
      }
    },
    initialRegisterFormState,
  )

  if (isAuthenticated) {
    return (
      <section className="mx-auto max-w-xl rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-xl shadow-slate-200/60">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Sesión activa</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Cuenta conectada</h1>
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
    <section className="grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
      <form action={formAction} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8 lg:order-1">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Registro</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Crea tu cuenta</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            El token que devuelve el backend se guarda como sesión activa automáticamente.
          </p>
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
            autoComplete="new-password"
            type="password"
            name="password"
            minLength={6}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            placeholder="Mínimo 6 caracteres"
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="mt-8 w-full rounded-2xl bg-emerald-500 px-5 py-3 font-black text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <AppLink to="/login" className="font-black text-slate-950 underline decoration-emerald-300 decoration-4 underline-offset-4">
            Inicia sesión
          </AppLink>
        </p>
      </form>

      <div className="rounded-[2.5rem] bg-gradient-to-br from-emerald-500 via-teal-500 to-slate-950 p-8 text-white shadow-2xl shadow-emerald-900/20 sm:p-12 lg:order-2">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-100">Alta rápida</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Tu cuenta lista en segundos.</h2>
        <p className="mt-6 max-w-xl text-lg leading-8 text-emerald-50">
          Registro sencillo con email y password, conectado al endpoint real de autenticación.
        </p>
      </div>
    </section>
  )
}
