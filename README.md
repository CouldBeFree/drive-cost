# DriveCost — Fuel Tracking SaaS

Track fuel expenses, calculate consumption (L/100km), and analyze cost per kilometer.

## Tech Stack

- **Nuxt 4** — fullstack framework
- **Vue 3** — frontend
- **TypeScript** — type safety
- **Tailwind CSS** — styling
- **PostgreSQL** — database
- **Raw SQL** — no ORM

## Project Structure

```
app/                    # Frontend
├── pages/              # Route views
├── components/
│   ├── base/           # Reusable UI primitives
│   ├── icons/          # SVG icon components
│   └── layout/         # Sidebar, Header
├── layouts/            # App shell (default.vue)
├── composables/        # Shared reactive logic
├── types/              # TypeScript interfaces
└── utils/              # Pure utility functions

server/                 # Backend (Nitro)
├── api/                # HTTP route handlers
│   ├── vehicles/
│   └── fuel-entries/
├── services/           # Business logic
├── db/
│   ├── index.ts        # PostgreSQL connection pool
│   ├── queries/        # Raw SQL functions by domain
│   └── migrations/     # SQL migration files
└── utils/              # Server helpers (validation)
```

## Quick Start

### With Docker (Recommended)

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start PostgreSQL container (auto-runs migrations)
docker compose up -d

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Without Docker

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Create PostgreSQL database
createdb drivecost

# Run migrations
psql drivecost < server/db/migrations/001_initial.sql

# Start development server
npm run dev
```

## Docker Commands

```bash
docker compose up -d          # Start PostgreSQL
docker compose down           # Stop PostgreSQL
docker compose logs postgres  # View logs
docker compose exec postgres psql -U postgres -d drivecost  # Connect to DB
```

## Production

```bash
npm run build
npm run preview
```
