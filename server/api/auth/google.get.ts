import { findByEmail } from '~~/server/db/queries/users'
import { createUser } from '~~/server/services/userService'

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    const { email, name, picture } = user
    
    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email not provided by Google'
      })
    }

    // Check if user exists by email
    let existingUser = await findByEmail(email)

    if (!existingUser) {
      // Create new user with OAuth
      const userName = name || email.split('@')[0]
      existingUser = await createUser({
        email,
        name: userName,
        password: '' // OAuth users don't need password
      })
    }

    if (!existingUser) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create or find user'
      })
    }

    // Set user session
    await setUserSession(event, {
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name
      }
    })

    // Redirect to dashboard
    return sendRedirect(event, '/dashboard')
  },
  
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/auth/login?error=oauth_failed')
  }
})
