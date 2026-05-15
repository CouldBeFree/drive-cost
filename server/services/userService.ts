import bcrypt from 'bcrypt'
import * as userQueries from '../db/queries/users'
import type { User, UserCreate } from '~/types'

const SALT_ROUNDS = 10

export async function register(data: UserCreate): Promise<User> {
  const existingUser = await userQueries.findByEmail(data.email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS)
  const user = await userQueries.create(data.email, passwordHash, data.name)
  
  return user
}

export async function login(email: string, password: string): Promise<User> {
  const user = await userQueries.findByEmail(email)
  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isValidPassword = await bcrypt.compare(password, (user as any).password_hash)
  if (!isValidPassword) {
    throw new Error('Invalid email or password')
  }

  await userQueries.updateLastLogin(user.id)

  return user
}

export async function getUserById(id: number): Promise<User | null> {
  return userQueries.findById(id)
}

export async function createUser(data: { email: string; name: string; password: string }): Promise<User> {
  const existingUser = await userQueries.findByEmail(data.email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // For OAuth users, password can be empty string
  const passwordHash = data.password ? await bcrypt.hash(data.password, SALT_ROUNDS) : ''
  const user = await userQueries.create(data.email, passwordHash, data.name)
  
  return user
}
