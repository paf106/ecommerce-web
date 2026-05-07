import type { UserSession } from '../../domain/entities/UserSession'

const DEFAULT_API_BASE_URL = 'https://api.pabloavila.dev/api/v1'

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  session?: UserSession
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers({ Accept: 'application/json' })

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.session) {
    headers.set('Authorization', `${options.session.tokenType || 'Bearer'} ${options.session.accessToken}`)
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    throw new ApiError(await getResponseErrorMessage(response), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const responseText = await response.text()

  if (!responseText) {
    return undefined as T
  }

  return JSON.parse(responseText) as T
}

function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim()

  return (configuredUrl || DEFAULT_API_BASE_URL).replace(/\/$/, '')
}

async function getResponseErrorMessage(response: Response) {
  const fallbackMessage = `La API ha respondido con un error ${response.status}.`

  try {
    const responseText = await response.text()

    if (!responseText) {
      return fallbackMessage
    }

    const errorBody = JSON.parse(responseText) as Partial<{
      message: string
      error: string
      detail: string
    }>

    return errorBody.message ?? errorBody.error ?? errorBody.detail ?? fallbackMessage
  } catch {
    return fallbackMessage
  }
}
