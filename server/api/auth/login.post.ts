import { login } from '../../services/userService'
import type { UserLogin } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<UserLogin>(event)

    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required',
      })
    }

    const user = await login(body.email, body.password)

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
      statusCode: 401,
      message: error.message || 'Login failed',
    })
  }
})
