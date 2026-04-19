export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const loading = useState('auth-loading', () => false)

  const fetchSession = async () => {
    try {
      loading.value = true
      const { data } = await useFetch('/api/auth/session')
      user.value = data.value?.user || null
    } catch (error) {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      const { data, error } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Login failed')
      }

      user.value = data.value?.user || null
      await navigateTo('/dashboard')
    } catch (error: any) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      loading.value = true
      const { data, error } = await useFetch('/api/auth/register', {
        method: 'POST',
        body: { name, email, password },
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Registration failed')
      }

      user.value = data.value?.user || null
      await navigateTo('/dashboard')
    } catch (error: any) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
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
