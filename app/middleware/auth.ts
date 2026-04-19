export default defineNuxtRouteMiddleware(async (to) => {
  const { fetchSession, user } = useAuth()

  // Fetch session if not already loaded
  if (!user.value) {
    await fetchSession()
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/register']
  
  if (publicRoutes.includes(to.path)) {
    // If user is already logged in and tries to access auth pages, redirect to dashboard
    if (user.value && (to.path === '/auth/login' || to.path === '/auth/register')) {
      return navigateTo('/dashboard')
    }
    return
  }

  // Protected routes - require authentication
  if (!user.value) {
    return navigateTo('/auth/login')
  }
})
