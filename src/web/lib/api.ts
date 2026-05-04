const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

type ApiOptions = Omit<RequestInit, 'body'> & { body?: unknown }

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, ...rest } = options
  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...rest.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new ApiError(res.status, data.error || 'Erro inesperado')
  }

  return res.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export const api = {
  get: <T>(path: string, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: unknown, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body: unknown, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),

  delete: <T>(path: string, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}

export type AuthUser = { id: string; name: string; email: string }

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ user: AuthUser }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ user: AuthUser }>('/auth/login', data),

  logout: () => api.post<{ message: string }>('/auth/logout', {}),

  me: () => api.get<AuthUser>('/auth/me'),
}
