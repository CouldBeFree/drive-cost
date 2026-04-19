import { query, queryOne } from '../index'
import type { User } from '~/types'

export async function findByEmail(email: string): Promise<User | null> {
  return queryOne<User>('SELECT * FROM users WHERE email = $1', [email])
}

export async function findById(id: number): Promise<User | null> {
  return queryOne<User>('SELECT * FROM users WHERE id = $1', [id])
}

export async function create(email: string, passwordHash: string, name: string): Promise<User> {
  const sql = `
    INSERT INTO users (email, password_hash, name)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, created_at, updated_at
  `
  return queryOne<User>(sql, [email, passwordHash, name]) as Promise<User>
}

export async function updateLastLogin(id: number): Promise<void> {
  await query('UPDATE users SET updated_at = NOW() WHERE id = $1', [id])
}
