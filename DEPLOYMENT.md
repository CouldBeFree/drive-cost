# DriveCost Deployment Guide

## Prerequisites

- Docker and Docker Compose installed on your server
- Domain name (optional, for production)
- SSL certificate (optional, for HTTPS)

## Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd drive-cost
```

### 2. Create environment file

```bash
cp env.production.example .env
```

Edit `.env` and set your production values:

```bash
# Generate secure session password
openssl rand -base64 32

# Update .env with generated values
nano .env
```

### 3. Build and start services

```bash
# Build images
docker compose build

# Start all services
docker compose up -d

# Check logs
docker compose logs -f app
```

### 4. Run database migrations

Migrations run automatically on first startup via the `migrate` service.

To run manually:

```bash
docker compose run --rm migrate
```

### 5. Access the application

- **App**: http://localhost:3000
- **Grafana**: http://localhost:3001 (default: admin/changeme)

## Services

| Service | Port | Description |
|---------|------|-------------|
| app | 3000 | DriveCost Nuxt 3 application |
| postgres | 5433 | PostgreSQL database |
| grafana | 3001 | Grafana dashboard for logs |
| loki | 3100 | Loki log aggregation (internal) |
| promtail | 9080 | Promtail log collector (internal) |

## Production Deployment

### 1. Update environment variables

```bash
# Set production values
ENVIRONMENT=production
POSTGRES_PASSWORD=<strong-password>
NUXT_SESSION_PASSWORD=<32-char-password>
GRAFANA_ADMIN_PASSWORD=<strong-password>
```

### 2. Configure reverse proxy (Nginx example)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Grafana (optional)
server {
    listen 80;
    server_name grafana.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL with Let's Encrypt (optional)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d grafana.yourdomain.com
```

## Monitoring & Logs

### View logs in Grafana

1. Open http://localhost:3001
2. Login with credentials from `.env`
3. Navigate to "DriveCost Logs" dashboard
4. View real-time logs from all containers

### View logs via Docker

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f postgres

# Last 100 lines
docker compose logs --tail=100 app
```

## Maintenance

### Update application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker compose build app
docker compose up -d app

# Run migrations if needed
docker compose run --rm migrate
```

### Backup database

```bash
# Create backup
docker compose exec postgres pg_dump -U drivecost_user drivecost > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker compose exec -T postgres psql -U drivecost_user drivecost < backup_20260429_120000.sql
```

### Clean up

```bash
# Stop all services
docker compose down

# Remove volumes (WARNING: deletes all data)
docker compose down -v

# Remove images
docker compose down --rmi all
```

## Troubleshooting

### App container won't start

```bash
# Check logs
docker compose logs app

# Verify database connection
docker compose exec app node -e "console.log(process.env.DATABASE_URL)"
```

### Database connection issues

```bash
# Check postgres is running
docker compose ps postgres

# Test connection
docker compose exec postgres psql -U drivecost_user -d drivecost -c "SELECT 1"
```

### Grafana can't connect to Loki

```bash
# Check Loki is running
docker compose ps loki

# Test Loki endpoint
curl http://localhost:3100/ready
```

## Resource Limits

Current resource limits (can be adjusted in docker-compose.yml):

- **app**: 512MB RAM, 1 CPU
- **loki**: 512MB RAM, 0.5 CPU
- **promtail**: 256MB RAM, 0.25 CPU
- **grafana**: 256MB RAM, 0.25 CPU

## Security Recommendations

1. ✅ Change all default passwords
2. ✅ Use strong session password (32+ characters)
3. ✅ Enable firewall and only expose necessary ports
4. ✅ Use SSL/TLS in production
5. ✅ Regularly update Docker images
6. ✅ Backup database regularly
7. ✅ Monitor logs for suspicious activity

## Network Architecture

All services run in the `app-network` bridge network:

```
app-network (bridge)
├── postgres (internal)
├── app (exposed: 3000)
├── loki (internal)
├── promtail (internal)
└── grafana (exposed: 3001)
```

Only `app` and `grafana` ports are exposed to the host.
