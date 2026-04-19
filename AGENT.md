# DriveCost — Fuel Tracking SaaS MVP

## Project Overview

DriveCost is a fuel tracking SaaS application that helps users track fuel expenses, calculate consumption (L/100km), and analyze cost per kilometer for their vehicles.

## Tech Stack

- **Nuxt 4** — Fullstack framework (frontend + backend)
- **Vue 3** — Frontend framework with Composition API
- **TypeScript** — Type safety across the entire stack
- **Tailwind CSS** — Utility-first styling
- **PostgreSQL** — Relational database
- **pg** — PostgreSQL client (raw SQL, no ORM)

## Architecture

### Fullstack Nuxt Application

```
app/                    # Frontend (Vue 3 + TypeScript)
├── pages/              # Route views (file-based routing)
├── components/
│   ├── base/           # Reusable UI primitives (BaseButton, BaseCard, BaseInput, BaseTable)
│   ├── icons/          # SVG icon components
│   └── layout/         # Layout components (AppSidebar, AppHeader)
├── layouts/            # Page layouts
│   ├── default.vue     # Legacy layout with sidebar/header
│   ├── dashboard.vue   # New dashboard layout with collapsible sidebar
│   ├── auth.vue        # Centered auth layout (login/register)
│   └── landing.vue     # Landing page layout (no sidebar/header)
├── composables/        # Shared reactive logic
├── types/              # TypeScript interfaces
└── utils/              # Pure utility functions

server/                 # Backend (Nitro)
├── api/                # HTTP route handlers
│   ├── vehicles/       # CRUD endpoints for vehicles
│   └── fuel-entries/   # GET/POST endpoints for fuel entries
├── services/           # Business logic layer
│   ├── vehicleService.ts
│   └── fuelEntryService.ts
├── db/
│   ├── index.ts        # PostgreSQL connection pool with query helpers
│   ├── queries/        # Raw SQL functions by domain
│   │   ├── vehicles.ts
│   │   └── fuel-entries.ts
│   └── migrations/     # SQL migration files
│       └── 001_initial.sql
└── utils/              # Server helpers (validation)
```

### Data Flow Pattern

**API Route → Service → Query → Raw SQL**

Example:
```
GET /api/vehicles → vehicleService.getAll() → vehicleQueries.findAll() → SELECT * FROM vehicles
```

## Design System

### Design Tokens (tailwind.config.ts)

```typescript
colors: {
  background: '#f5f7fb',      // Page background
  surface: '#ffffff',          // Card/panel background
  border: '#e5e7eb',           // Border color
  'text-primary': '#111827',   // Primary text
  'text-secondary': '#374151', // Secondary text
  'text-muted': '#9ca3af',     // Muted/placeholder text
  primary: '#3b82f6',          // Primary brand color (blue)
  success: '#10b981',          // Success/positive (green)
  secondary: '#8b5cf6',        // Secondary accent (purple)
  error: '#ef4444',            // Error/danger (red)
}
```

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Design Principles

- Border-based design (subtle borders, minimal shadows)
- Clean, modern UI with ample whitespace
- Consistent spacing using Tailwind's spacing scale
- Subtle shadows for depth (card, dropdown)

## Component Library

### Base Components

All base components are located in `app/components/base/`:

1. **BaseButton** — Primary button component
   - Variants: default (primary), outline, ghost
   - Supports all native button attributes

2. **BaseCard** — Card container component
   - Props: `title`, `description`, `noPadding`
   - Includes header with title/description and content slot

3. **BaseInput** — Form input component
   - Props: `label`, `type`, `placeholder`, `required`, etc.
   - Supports v-model binding
   - Includes label and error state styling

4. **BaseTable** — Data table component
   - Props: `columns`, `rows`, `emptyText`
   - Supports custom cell templates via slots
   - Responsive design

### Icon Components

All icons are SVG components in `app/components/icons/`:

- IconFuelPump, IconCar, IconDashboard, IconClipboard, IconChart, IconBarChart
- IconCalculator, IconTrending, IconSettings, IconUser
- IconEye, IconEyeOff (password toggle)
- IconMail, IconFuel

Icons are simple Vue components with SVG markup, no external icon library.

## Layouts

### 1. Landing Layout (`landing.vue`)
- Minimal layout for unauthenticated landing page
- No sidebar or header
- Just a slot for page content

### 2. Auth Layout (`auth.vue`)
- Centered layout for login/register pages
- Gray background with centered content
- No sidebar or header

### 3. Dashboard Layout (`dashboard.vue`) — **PRIMARY LAYOUT**
- Collapsible sidebar navigation
- Header with page title and user profile
- Navigation items:
  - Dashboard (`/dashboard`)
  - Fuel Entries (`/fuel-entries`)
  - Statistics (`/statistics`)
  - Vehicles (`/vehicles`)
  - Settings (in footer)
- Active state highlighting
- User profile display (name, plan)

### 4. Default Layout (`default.vue`) — **LEGACY**
- Old layout with AppSidebar and AppHeader
- Being phased out in favor of dashboard layout

## Pages

### Public Pages

1. **Landing Page** (`/` - `index.vue`)
   - Layout: `landing`
   - Marketing page with features, hero section, CTA buttons
   - Links to `/auth/login` and `/dashboard`

2. **Login** (`/auth/login`)
   - Layout: `auth`
   - Email + password fields
   - Password toggle with eye icon
   - Link to register page

3. **Register** (`/auth/register`)
   - Layout: `auth`
   - Name, email, password, confirm password fields
   - Password toggle icons on both password fields
   - Link to login page

### Authenticated Pages (Dashboard Layout)

All these pages use `layout: 'dashboard'`:

1. **Dashboard** (`/dashboard`)
   - Overview stats (vehicles, fuel entries, avg consumption, total spent)
   - Recent fuel entries card
   - Fuel consumption trend card

2. **Fuel Entries** (`/fuel-entries`)
   - Table of all fuel entries
   - Add entry button
   - Columns: date, odometer, liters, price/L, total cost, tank status

3. **Vehicles** (`/vehicles`)
   - Table of registered vehicles
   - Add vehicle button
   - Columns: name, make, model, year, license plate, actions

4. **Statistics** (`/statistics`)
   - Avg consumption, avg cost per km, total distance cards
   - Spending over time chart placeholder

5. **Settings** (`/settings`)
   - General preferences (currency, distance unit)
   - Data management section

## Database Schema

### Entity Relationships

```
users (1) ──< (N) vehicles (1) ──< (N) fuel_entries
```

- **User → Vehicles**: One-to-Many (one user can have many vehicles)
- **Vehicle → Fuel Entries**: One-to-Many (one vehicle can have many fuel entries)

### Tables

**users**
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR 255, UNIQUE NOT NULL)
- `password_hash` (VARCHAR 255, NOT NULL)
- `name` (VARCHAR 100, NOT NULL)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**vehicles**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, FK to users, CASCADE DELETE)
- `name` (VARCHAR 100)
- `make` (VARCHAR 100)
- `model` (VARCHAR 100)
- `year` (INTEGER, CHECK 1900-2100)
- `license_plate` (VARCHAR 20)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**fuel_entries**
- `id` (SERIAL PRIMARY KEY)
- `vehicle_id` (INTEGER, FK to vehicles, CASCADE DELETE)
- `date` (DATE)
- `odometer_km` (NUMERIC 10,1)
- `liters` (NUMERIC 8,2)
- `price_per_liter` (NUMERIC 8,4)
- `total_cost` (NUMERIC 10,2)
- `is_full_tank` (BOOLEAN)
- `notes` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ)

### Indexes
- `idx_vehicles_user_id` on `vehicles(user_id)`
- `idx_fuel_entries_vehicle_id` on `fuel_entries(vehicle_id)`
- `idx_fuel_entries_date` on `fuel_entries(date DESC)`

### Cascade Deletes
- Deleting a user deletes all their vehicles and fuel entries
- Deleting a vehicle deletes all its fuel entries

See `DATABASE_SCHEMA.md` for detailed schema documentation.

## TypeScript Types

Located in `app/types/index.ts`:

- `User` — Full user object
- `UserCreate` — User registration payload
- `UserLogin` — User login payload
- `Vehicle` — Full vehicle object (includes `user_id`)
- `VehicleCreate` — Vehicle creation payload (includes `user_id`)
- `FuelEntry` — Full fuel entry object
- `FuelEntryCreate` — Fuel entry creation payload
- `FuelConsumption` — Calculated consumption metrics
- `ApiResponse<T>` — Generic API response wrapper

## Code Style & Conventions

### Vue Components

**SFC Order:**
1. `<template>` — HTML markup
2. `<script setup lang="ts">` — TypeScript logic
3. `<style>` — Only if absolutely needed (prefer Tailwind)

**Naming:**
- Components: PascalCase (e.g., `BaseButton.vue`)
- Props: camelCase
- Events: kebab-case

### Styling

- **Tailwind only** — No inline styles, no CSS modules
- Use design tokens from `tailwind.config.ts`
- Prefer utility classes over custom CSS
- Use arbitrary values `[value]` when needed (e.g., `mb-[2.5rem]`)

### TypeScript

- Strict mode enabled
- Explicit types for all function parameters and return values
- Use interfaces for data structures
- No `any` types

### Database

- **Raw SQL only** — No ORM
- Use parameterized queries to prevent SQL injection
- Queries organized by domain in `server/db/queries/`
- Connection pool in `server/db/index.ts` with helper methods:
  - `query(sql, params)` — Execute query, return all rows
  - `queryOne(sql, params)` — Execute query, return first row

### API Routes

- Thin handlers — delegate to services
- Services contain business logic
- Services call query functions for database access
- Return consistent `ApiResponse<T>` format
- Handle errors gracefully

## Development Workflow

### Setup

#### Option 1: Docker (Recommended)

1. **Install Docker:**
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/) for Windows/macOS
   - Docker Engine for Linux: `sudo apt install docker.io docker-compose`

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
```

The default `.env.example` is already configured for Docker:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/drivecost
```

4. **Start PostgreSQL container:**
```bash
docker compose up -d
```

This will:
- Pull PostgreSQL 16 Alpine image
- Create `drivecost` database
- Automatically run migrations from `server/db/migrations/`
- Expose PostgreSQL on port 5432
- Persist data in a Docker volume

5. **Verify database:**
```bash
docker compose exec postgres psql -U postgres -d drivecost -c "\dt"
```

Should show `vehicles` and `fuel_entries` tables.

6. **Start development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Docker Commands:**
```bash
docker compose up -d          # Start PostgreSQL in background
docker compose down           # Stop PostgreSQL
docker compose logs postgres  # View PostgreSQL logs
docker compose restart        # Restart PostgreSQL
docker compose exec postgres psql -U postgres -d drivecost  # Connect to database
```

#### Option 2: Local PostgreSQL Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install PostgreSQL:**

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
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

3. **Create database:**
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE drivecost;

# Optional: Create dedicated user
CREATE USER drivecost_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE drivecost TO drivecost_user;

# Exit
\q
```

4. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/drivecost
```

Or with custom user:
```
DATABASE_URL=postgresql://drivecost_user:your_password@localhost:5432/drivecost
```

5. **Run migrations:**
```bash
psql -U postgres -d drivecost -f server/db/migrations/001_initial.sql
```

6. **Verify database setup:**
```bash
psql -U postgres -d drivecost
\dt  # Should show vehicles and fuel_entries tables
\q
```

7. **Start development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (required)

### Running the App

```bash
npm run dev              # Development server (http://localhost:3000)
npm run build            # Production build
npm run preview          # Preview production build
```

### Database Management

See `server/db/README.md` for detailed database documentation including:
- Writing raw SQL queries
- Using query helper functions
- Creating migrations
- Best practices for parameterized queries
- Troubleshooting common issues

## Current State

### Completed Features

✅ Landing page with marketing content
✅ Auth pages (login, register) with password toggle
✅ **Authentication with nuxt-auth-utils** (login, register, logout, sessions)
✅ **Password hashing with bcrypt**
✅ **Protected routes with auth middleware**
✅ Dashboard layout with collapsible sidebar
✅ Base UI components (Button, Card, Input, Table)
✅ Icon component library
✅ Database schema with users, vehicles, fuel_entries
✅ Database migrations system
✅ Docker PostgreSQL setup (port 5433)
✅ Vehicles CRUD API (full)
✅ Fuel entries API (GET, POST)
✅ User queries and service layer
✅ TypeScript types for all entities
✅ Design system with Tailwind tokens

### In Progress / TODO

- [ ] Fuel entry creation form
- [ ] Vehicle creation form
- [ ] Statistics calculations and charts
- [ ] Data visualization (consumption trends)
- [ ] User profile management
- [ ] Settings persistence
- [ ] Update vehicles/fuel entries APIs to filter by user_id

## Key Decisions & Patterns

1. **No ORM** — Using raw SQL with `pg` for full control and performance
2. **No UI Library** — Custom base components for consistency and lightweight bundle
3. **File-based routing** — Nuxt's convention for pages
4. **Composition API** — Vue 3's `<script setup>` for all components
5. **Tailwind-first** — Utility classes over custom CSS
6. **Service layer** — Business logic separated from API handlers
7. **Type safety** — Shared types between frontend and backend

## Notes for AI Agents

- Always use existing base components (BaseButton, BaseCard, BaseInput, BaseTable)
- Follow the established design tokens from `tailwind.config.ts`
- Use the dashboard layout for authenticated pages
- Keep components small and focused
- Prefer composition over inheritance
- Use TypeScript interfaces from `app/types/index.ts`
- Follow the API → Service → Query → SQL pattern for backend
- No emojis in code unless explicitly requested by user
- Password fields should have eye/eye-off toggle icons
- All authenticated pages use `definePageMeta({ layout: 'dashboard' })`
