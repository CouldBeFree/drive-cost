# Database Setup

## PostgreSQL Configuration

This project uses **raw SQL queries** with the `pg` library (no ORM).

## Connection Pool

The database connection pool is configured in `server/db/index.ts`:

- **Max connections**: 10
- **Idle timeout**: 30 seconds
- **Connection timeout**: 5 seconds

## Helper Functions

### `query<T>(sql, params)`
Execute a query and return all rows.

```typescript
const vehicles = await query<Vehicle>('SELECT * FROM vehicles WHERE year > $1', [2020])
```

### `queryOne<T>(sql, params)`
Execute a query and return the first row (or null).

```typescript
const vehicle = await queryOne<Vehicle>('SELECT * FROM vehicles WHERE id = $1', [id])
```

## Setup Instructions

### Option 1: Docker (Recommended)

**Prerequisites:** Docker and Docker Compose installed

1. **Start PostgreSQL container:**
```bash
docker compose up -d
```

This automatically:
- Creates PostgreSQL 16 container
- Creates `drivecost` database
- Runs all migrations from `server/db/migrations/`
- Exposes port 5432
- Persists data in Docker volume

2. **Configure environment:**
```bash
cp .env.example .env
```

Default `.env.example` works with Docker:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/drivecost
```

3. **Access Adminer (Web UI):**

Open http://localhost:8080 in your browser and login with:
- **System:** PostgreSQL
- **Server:** postgres
- **Username:** postgres
- **Password:** postgres
- **Database:** drivecost

4. **Verify setup (CLI):**
```bash
docker compose exec postgres psql -U postgres -d drivecost -c "\dt"
```

Should show `users`, `vehicles`, and `fuel_entries` tables.

**Docker commands:**
```bash
docker compose up -d          # Start containers
docker compose down           # Stop containers
docker compose logs postgres  # View PostgreSQL logs
docker compose logs adminer   # View Adminer logs
docker compose restart        # Restart containers
docker compose exec postgres psql -U postgres -d drivecost  # Connect to DB via CLI
```

### Option 2: Local PostgreSQL Installation

**1. Install PostgreSQL:**

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

**2. Create Database:**

```bash
# Switch to postgres user (Linux/macOS)
sudo -u postgres psql

# Or connect directly (if configured)
psql -U postgres

# Create database
CREATE DATABASE drivecost;

# Create user (optional)
CREATE USER drivecost_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE drivecost TO drivecost_user;

# Exit
\q
```

**3. Configure Environment:**

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/drivecost
```

Or with custom user:

```
DATABASE_URL=postgresql://drivecost_user:your_password@localhost:5432/drivecost
```

**4. Run Migrations:**

```bash
psql -U postgres -d drivecost -f server/db/migrations/001_initial.sql
```

Or if using custom user:

```bash
psql -U drivecost_user -d drivecost -f server/db/migrations/001_initial.sql
```

**5. Verify Setup:**

```bash
psql -U postgres -d drivecost

# List tables
\dt

# Should show:
# - vehicles
# - fuel_entries

# Exit
\q
```

## Writing Queries

### Query Files Location

Organize queries by domain in `server/db/queries/`:

- `vehicles.ts` — Vehicle-related queries
- `fuel-entries.ts` — Fuel entry queries

### Example Query File

```typescript
// server/db/queries/vehicles.ts
import { query, queryOne } from '../index'
import type { Vehicle, VehicleCreate } from '~/types'

export async function findAll(): Promise<Vehicle[]> {
  return query<Vehicle>('SELECT * FROM vehicles ORDER BY created_at DESC')
}

export async function findById(id: number): Promise<Vehicle | null> {
  return queryOne<Vehicle>('SELECT * FROM vehicles WHERE id = $1', [id])
}

export async function create(data: VehicleCreate): Promise<Vehicle> {
  const sql = `
    INSERT INTO vehicles (name, make, model, year, license_plate)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `
  return queryOne<Vehicle>(sql, [
    data.name,
    data.make,
    data.model,
    data.year,
    data.license_plate,
  ]) as Promise<Vehicle>
}

export async function update(id: number, data: Partial<VehicleCreate>): Promise<Vehicle | null> {
  const sql = `
    UPDATE vehicles
    SET name = COALESCE($2, name),
        make = COALESCE($3, make),
        model = COALESCE($4, model),
        year = COALESCE($5, year),
        license_plate = COALESCE($6, license_plate),
        updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `
  return queryOne<Vehicle>(sql, [
    id,
    data.name,
    data.make,
    data.model,
    data.year,
    data.license_plate,
  ])
}

export async function remove(id: number): Promise<boolean> {
  const result = await query('DELETE FROM vehicles WHERE id = $1', [id])
  return result.length > 0
}
```

## Best Practices

### 1. Always Use Parameterized Queries

✅ **Good:**
```typescript
query('SELECT * FROM vehicles WHERE id = $1', [id])
```

❌ **Bad (SQL Injection Risk):**
```typescript
query(`SELECT * FROM vehicles WHERE id = ${id}`)
```

### 2. Use TypeScript Types

```typescript
import type { Vehicle } from '~/types'

const vehicles = await query<Vehicle>('SELECT * FROM vehicles')
// vehicles is typed as Vehicle[]
```

### 3. Handle Null Results

```typescript
const vehicle = await queryOne<Vehicle>('SELECT * FROM vehicles WHERE id = $1', [id])
if (!vehicle) {
  throw createError({ statusCode: 404, message: 'Vehicle not found' })
}
```

### 4. Use Transactions for Multiple Operations

```typescript
const client = await getPool().connect()
try {
  await client.query('BEGIN')
  
  // Multiple queries
  await client.query('INSERT INTO vehicles ...')
  await client.query('INSERT INTO fuel_entries ...')
  
  await client.query('COMMIT')
} catch (e) {
  await client.query('ROLLBACK')
  throw e
} finally {
  client.release()
}
```

## Migrations

### Creating a New Migration

1. Create a new file in `server/db/migrations/`:
   ```
   002_add_user_preferences.sql
   003_add_vehicle_color.sql
   ```

2. Write SQL:
   ```sql
   -- 002_add_user_preferences.sql
   ALTER TABLE users ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
   ALTER TABLE users ADD COLUMN distance_unit VARCHAR(10) DEFAULT 'km';
   ```

3. **Apply migration to running Docker container:**
   ```bash
   docker compose exec postgres psql -U postgres -d drivecost -f /docker-entrypoint-initdb.d/002_add_user_preferences.sql
   ```

   Or if you have `psql` installed locally:
   ```bash
   psql -h localhost -p 5433 -U postgres -d drivecost -f server/db/migrations/002_add_user_preferences.sql
   ```

4. **Verify migration:**
   ```bash
   docker compose exec postgres psql -U postgres -d drivecost -c "\d users"
   ```

### Migration Naming Convention

Format: `{number}_{description}.sql`

Examples:
- `001_initial.sql`
- `002_add_users_table.sql`
- `003_add_fuel_entry_indexes.sql`
- `004_alter_vehicles_add_color.sql`

## Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** Start PostgreSQL service
```bash
# Linux
sudo systemctl start postgresql

# macOS
brew services start postgresql@16
```

### Authentication Failed

```
Error: password authentication failed for user "postgres"
```

**Solution:** Reset postgres password
```bash
sudo -u postgres psql
ALTER USER postgres PASSWORD 'new_password';
```

### Database Does Not Exist

```
Error: database "drivecost" does not exist
```

**Solution:** Create the database
```bash
createdb -U postgres drivecost
```

## Useful Commands

```bash
# Connect to database
psql -U postgres -d drivecost

# List databases
\l

# List tables
\dt

# Describe table
\d vehicles

# Show table data
SELECT * FROM vehicles;

# Drop database (careful!)
DROP DATABASE drivecost;

# Backup database
pg_dump -U postgres drivecost > backup.sql

# Restore database
psql -U postgres drivecost < backup.sql
```
