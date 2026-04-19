import { register } from '../../services/userService'
import type { UserCreate } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<UserCreate>(event)

    if (!body.email || !body.password || !body.name) {
      throw createError({
        statusCode: 400,
        message: 'Email, password, and name are required',
      })
    }

    if (body.password.length < 6) {
      throw createError({
        statusCode: 400,
        message: 'Password must be at least 6 characters',
      })
    }

    const user = await register(body)

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || 'Registration failed',
    })
  }
})
