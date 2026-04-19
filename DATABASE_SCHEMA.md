# Database Schema

## Entity Relationship Diagram

```
users (1) ──< (N) vehicles (1) ──< (N) fuel_entries
```

## Relationships

- **User → Vehicles**: One-to-Many (one user can have many vehicles)
- **Vehicle → Fuel Entries**: One-to-Many (one vehicle can have many fuel entries)

## Tables

### users

Stores user accounts and authentication information.

| Column        | Type         | Constraints                    | Description                |
|---------------|--------------|--------------------------------|----------------------------|
| id            | SERIAL       | PRIMARY KEY                    | Unique user identifier     |
| email         | VARCHAR(255) | UNIQUE NOT NULL                | User email (login)         |
| password_hash | VARCHAR(255) | NOT NULL                       | Bcrypt hashed password     |
| name          | VARCHAR(100) | NOT NULL                       | User display name          |
| created_at    | TIMESTAMPTZ  | NOT NULL DEFAULT NOW()         | Account creation timestamp |
| updated_at    | TIMESTAMPTZ  | NOT NULL DEFAULT NOW()         | Last update timestamp      |

**Indexes:**
- Primary key on `id`
- Unique index on `email`

---

### vehicles

Stores user vehicles information.

| Column        | Type         | Constraints                           | Description                    |
|---------------|--------------|---------------------------------------|--------------------------------|
| id            | SERIAL       | PRIMARY KEY                           | Unique vehicle identifier      |
| user_id       | INTEGER      | REFERENCES users(id) ON DELETE CASCADE| Owner of the vehicle           |
| name          | VARCHAR(100) | NOT NULL                              | Vehicle nickname               |
| make          | VARCHAR(100) | NOT NULL                              | Manufacturer (e.g., Toyota)    |
| model         | VARCHAR(100) | NOT NULL                              | Model name (e.g., Camry)       |
| year          | INTEGER      | NOT NULL CHECK (year >= 1900 AND year <= 2100) | Manufacturing year |
| license_plate | VARCHAR(20)  | NOT NULL DEFAULT ''                   | License plate number           |
| created_at    | TIMESTAMPTZ  | NOT NULL DEFAULT NOW()                | Record creation timestamp      |
| updated_at    | TIMESTAMPTZ  | NOT NULL DEFAULT NOW()                | Last update timestamp          |

**Indexes:**
- Primary key on `id`
- Index on `user_id` for faster user vehicle lookups

**Foreign Keys:**
- `user_id` → `users(id)` (CASCADE DELETE: deleting a user deletes their vehicles)

---

### fuel_entries

Stores fuel refueling records for vehicles.

| Column          | Type          | Constraints                                  | Description                        |
|-----------------|---------------|----------------------------------------------|------------------------------------|
| id              | SERIAL        | PRIMARY KEY                                  | Unique fuel entry identifier       |
| vehicle_id      | INTEGER       | NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE | Vehicle being refueled      |
| date            | DATE          | NOT NULL                                     | Refueling date                     |
| odometer_km     | NUMERIC(10,1) | NOT NULL CHECK (odometer_km >= 0)            | Odometer reading in kilometers     |
| liters          | NUMERIC(8,2)  | NOT NULL CHECK (liters > 0)                  | Fuel amount in liters              |
| price_per_liter | NUMERIC(8,4)  | NOT NULL CHECK (price_per_liter >= 0)        | Price per liter                    |
| total_cost      | NUMERIC(10,2) | NOT NULL CHECK (total_cost >= 0)             | Total refueling cost               |
| is_full_tank    | BOOLEAN       | NOT NULL DEFAULT true                        | Whether tank was filled completely |
| notes           | TEXT          | NULL                                         | Optional notes                     |
| created_at      | TIMESTAMPTZ   | NOT NULL DEFAULT NOW()                       | Record creation timestamp          |

**Indexes:**
- Primary key on `id`
- Index on `vehicle_id` for faster vehicle fuel entry lookups
- Index on `date DESC` for chronological queries

**Foreign Keys:**
- `vehicle_id` → `vehicles(id)` (CASCADE DELETE: deleting a vehicle deletes its fuel entries)

---

## Data Flow

### User Registration Flow
```
1. User registers → users table
2. User logs in → authentication
3. User creates vehicle → vehicles table (with user_id)
4. User adds fuel entry → fuel_entries table (with vehicle_id)
```

### Data Access Patterns

**Get all vehicles for a user:**
```sql
SELECT * FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC;
```

**Get all fuel entries for a vehicle:**
```sql
SELECT * FROM fuel_entries WHERE vehicle_id = $1 ORDER BY date DESC;
```

**Get all fuel entries for a user (across all vehicles):**
```sql
SELECT fe.* 
FROM fuel_entries fe
JOIN vehicles v ON fe.vehicle_id = v.id
WHERE v.user_id = $1
ORDER BY fe.date DESC;
```

**Calculate fuel consumption for a vehicle:**
```sql
SELECT 
  vehicle_id,
  SUM(liters) as total_liters,
  SUM(total_cost) as total_cost,
  MAX(odometer_km) - MIN(odometer_km) as total_distance_km,
  (SUM(liters) / NULLIF(MAX(odometer_km) - MIN(odometer_km), 0)) * 100 as liters_per_100km,
  SUM(total_cost) / NULLIF(MAX(odometer_km) - MIN(odometer_km), 0) as cost_per_km
FROM fuel_entries
WHERE vehicle_id = $1 AND is_full_tank = true
GROUP BY vehicle_id;
```

---

## Migrations

### 001_initial.sql
- Creates `users` table
- Creates `vehicles` table with `user_id` foreign key
- Creates `fuel_entries` table with `vehicle_id` foreign key
- Creates all necessary indexes

---

## Security Considerations

1. **Password Storage**: Always use bcrypt or similar to hash passwords before storing in `password_hash`
2. **Row-Level Security**: Ensure users can only access their own vehicles and fuel entries
3. **Cascade Deletes**: 
   - Deleting a user deletes all their vehicles and fuel entries
   - Deleting a vehicle deletes all its fuel entries
4. **Email Uniqueness**: Enforced at database level to prevent duplicate accounts

---

## Future Enhancements

Potential schema additions:

1. **Sessions table** for authentication tokens
2. **Vehicle sharing** (many-to-many relationship between users and vehicles)
3. **Fuel types** (diesel, petrol, electric) as enum or separate table
4. **Maintenance records** linked to vehicles
5. **Trip tracking** with start/end odometer readings
6. **Fuel stations** as a separate entity
7. **User preferences** (currency, distance unit, etc.)
