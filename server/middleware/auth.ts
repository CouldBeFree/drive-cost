export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  // Skip auth check for auth routes
  if (event.path.startsWith('/api/auth/')) {
    return
  }

  // Skip auth check for public routes
  const publicRoutes = ['/api/health']
  if (publicRoutes.includes(event.path)) {
    return
  }

  // Require authentication for all other API routes
  if (event.path.startsWith('/api/') && !session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
})
