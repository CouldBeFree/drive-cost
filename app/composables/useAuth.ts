import type { User } from '~/types'

interface SessionResponse {
  user: User | null
}

interface AuthResponse {
  user: User
}

export const useAuth = () => {
  const user = useState<User | null>('user', () => null)
  const loading = useState('auth-loading', () => false)

  const fetchSession = async () => {
    try {
      loading.value = true
      const { data } = await useFetch<SessionResponse>('/api/auth/session')
      user.value = data.value?.user ?? null
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const { data, error } = await useFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      if (error.value) {
        throw new Error((error.value.data as { message?: string } | undefined)?.message || 'Login failed')
      }

      user.value = data.value?.user ?? null
      await navigateTo('/dashboard')
    } finally {
      loading.value = false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    loading.value = true
    try {
      const { data, error } = await useFetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: { name, email, password },
      })

      if (error.value) {
        throw new Error((error.value.data as { message?: string } | undefined)?.message || 'Registration failed')
      }

      user.value = data.value?.user ?? null
      await navigateTo('/dashboard')
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await useFetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      await navigateTo('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    fetchSession,
  }
}
