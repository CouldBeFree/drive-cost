# Authentication Guide

## Overview

DriveCost uses **nuxt-auth-utils** for session-based authentication with secure password hashing via **bcrypt**.

## Architecture

### Flow

```
User → Login/Register Page → API Route → Service → Database
                                ↓
                         Set Session Cookie
                                ↓
                         Redirect to Dashboard
```

### Components

1. **Frontend**
   - `app/pages/auth/login.vue` — Login page
   - `app/pages/auth/register.vue` — Registration page
   - `app/composables/useAuth.ts` — Auth composable
   - `app/middleware/auth.ts` — Route protection

2. **Backend**
   - `server/api/auth/login.post.ts` — Login endpoint
   - `server/api/auth/register.post.ts` — Registration endpoint
   - `server/api/auth/logout.post.ts` — Logout endpoint
   - `server/api/auth/session.get.ts` — Get current session
   - `server/services/userService.ts` — User business logic
   - `server/db/queries/users.ts` — User database queries
   - `server/middleware/auth.ts` — API route protection

## Setup

### 1. Environment Variables

Add to `.env`:

```bash
# Generate a random secret (at least 32 characters)
NUXT_SESSION_PASSWORD=your-random-secret-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 2. Database

Users table is created by `001_initial.sql` migration:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Usage

### Frontend (useAuth Composable)

```typescript
const { user, loading, login, register, logout, fetchSession } = useAuth()

// Register
await register('John Doe', 'john@example.com', 'password123')

// Login
await login('john@example.com', 'password123')

// Logout
await logout()

// Get current user
await fetchSession()
console.log(user.value) // { id, email, name }
```

### Protected Routes

Add to page:

```typescript
definePageMeta({
  middleware: 'auth'
})
```

This will:
- Redirect to `/auth/login` if not authenticated
- Redirect to `/dashboard` if already logged in and accessing auth pages

### API Routes

Protected by `server/middleware/auth.ts`:

```typescript
// All /api/* routes require authentication
// Except:
// - /api/auth/* (login, register, logout, session)
// - /api/health (public health check)
```

## API Endpoints

### POST /api/auth/register

Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `400` — Email already exists
- `400` — Password too short (< 6 characters)
- `400` — Missing required fields

### POST /api/auth/login

Login with email and password.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `401` — Invalid email or password
- `400` — Missing required fields

### POST /api/auth/logout

Logout current user.

**Response:**
```json
{
  "success": true
}
```

### GET /api/auth/session

Get current user session.

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

Or if not authenticated:
```json
{
  "user": null
}
```

## Security

### Password Hashing

Passwords are hashed using **bcrypt** with 10 salt rounds:

```typescript
const passwordHash = await bcrypt.hash(password, 10)
```

Never store plain text passwords!

### Session Management

Sessions are encrypted and stored in HTTP-only cookies via `nuxt-auth-utils`:

```typescript
await setUserSession(event, {
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
  },
})
```

### Password Requirements

- Minimum 6 characters (enforced on both frontend and backend)
- No maximum length
- No special character requirements (can be added later)

### Best Practices

1. **Never expose password_hash** — User queries return only safe fields
2. **Validate on both sides** — Frontend for UX, backend for security
3. **Use HTTPS in production** — Cookies should be secure
4. **Rate limiting** — Add rate limiting to auth endpoints (TODO)
5. **Email verification** — Consider adding email verification (TODO)

## Error Handling

### Frontend

Errors are displayed in a red alert box above the form:

```vue
<div v-if="error" class="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">
  {{ error }}
</div>
```

### Backend

Errors are thrown with appropriate status codes:

```typescript
throw createError({
  statusCode: 401,
  message: 'Invalid email or password',
})
```

## Testing

### Manual Testing

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}' \
     -c cookies.txt
   ```

3. **Get session:**
   ```bash
   curl http://localhost:3000/api/auth/session -b cookies.txt
   ```

4. **Logout:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
   ```

### Database Queries

Check registered users:
```bash
docker compose exec postgres psql -U postgres -d drivecost -c "SELECT id, email, name, created_at FROM users;"
```

## Troubleshooting

### "Session password is required"

**Problem:** Missing `NUXT_SESSION_PASSWORD` in `.env`

**Solution:**
```bash
echo "NUXT_SESSION_PASSWORD=$(openssl rand -base64 32)" >> .env
```

### "User with this email already exists"

**Problem:** Trying to register with an existing email

**Solution:** Use a different email or login instead

### "Invalid email or password"

**Problem:** Wrong credentials or user doesn't exist

**Solution:** Check email/password or register first

### Session not persisting

**Problem:** Cookies not being set/sent

**Solution:**
- Check browser console for cookie errors
- Ensure you're using the same domain (not mixing localhost/127.0.0.1)
- Check that cookies are enabled in browser

## Future Enhancements

- [ ] Email verification
- [ ] Password reset flow
- [ ] Remember me functionality
- [ ] Two-factor authentication (2FA)
- [ ] OAuth providers (Google, GitHub)
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed attempts
- [ ] Password strength meter
- [ ] Session expiration configuration
- [ ] Refresh tokens for long-lived sessions
