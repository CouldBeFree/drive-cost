# Migration Guide

## Як накатувати нові міграції

### Метод 1: Через Docker (Рекомендовано)

Найпростіший спосіб для розробки:

```bash
# Створіть файл міграції, наприклад 002_add_user_phone.sql
# Виконайте міграцію через Docker:
docker compose exec postgres psql -U postgres -d drivecost -f /docker-entrypoint-initdb.d/002_add_user_phone.sql
```

**Пояснення:**
- Файли з `server/db/migrations/` автоматично монтуються в `/docker-entrypoint-initdb.d/` всередині контейнера
- Міграція виконується на запущеній базі даних без перезапуску контейнера

### Метод 2: Через локальний psql

Якщо у вас встановлений PostgreSQL локально:

```bash
psql -h localhost -p 5433 -U postgres -d drivecost -f server/db/migrations/002_add_user_phone.sql
```

**Примітка:** Порт 5433, бо 5432 зайнятий іншим PostgreSQL контейнером.

### Метод 3: Інтерактивний SQL

Для швидких змін або тестування:

```bash
# Підключитись до бази
docker compose exec postgres psql -U postgres -d drivecost

# Виконати SQL команди
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
\q
```

### Метод 4: Пересоздати контейнер (для великих змін)

⚠️ **Увага:** Цей метод видаляє всі дані!

```bash
# Зупинити і видалити контейнер з volume
docker compose down -v

# Запустити заново (виконає всі міграції з server/db/migrations/)
docker compose up -d
```

Використовуйте цей метод тільки якщо:
- Ви на початку розробки і даних немає
- Потрібно повністю перестворити схему
- Є проблеми з існуючою схемою

## Приклад створення міграції

### 1. Створіть файл міграції

```bash
# Створіть файл server/db/migrations/002_add_user_preferences.sql
```

### 2. Напишіть SQL

```sql
-- 002_add_user_preferences.sql
-- Add user preferences columns

ALTER TABLE users ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD';
ALTER TABLE users ADD COLUMN IF NOT EXISTS distance_unit VARCHAR(10) DEFAULT 'km';
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme VARCHAR(20) DEFAULT 'light';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

### 3. Виконайте міграцію

```bash
docker compose exec postgres psql -U postgres -d drivecost -f /docker-entrypoint-initdb.d/002_add_user_preferences.sql
```

### 4. Перевірте результат

```bash
# Переглянути структуру таблиці users
docker compose exec postgres psql -U postgres -d drivecost -c "\d users"

# Або переглянути всі таблиці
docker compose exec postgres psql -U postgres -d drivecost -c "\dt"
```

## Naming Convention

Формат: `{номер}_{опис}.sql`

Приклади:
- `001_initial.sql` — початкова схема
- `002_add_user_preferences.sql` — додати налаштування користувача
- `003_add_vehicle_color.sql` — додати колір авто
- `004_create_sessions_table.sql` — створити таблицю сесій
- `005_add_fuel_type_enum.sql` — додати тип палива

## Best Practices

### 1. Використовуйте IF NOT EXISTS / IF EXISTS

```sql
-- Добре ✅
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Погано ❌ (впаде якщо колонка вже є)
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

### 2. Додавайте коментарі

```sql
-- 002_add_user_phone.sql
-- Add phone number field for user contact information
-- Author: Your Name
-- Date: 2026-04-18

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
```

### 3. Тестуйте на копії даних

Перед накатуванням на продакшн:
1. Створіть backup
2. Протестуйте міграцію на тестовій базі
3. Перевірте що дані не втрачені

### 4. Rollback план

Для кожної міграції створюйте rollback:

```sql
-- 002_add_user_phone.sql (UP)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- 002_add_user_phone_rollback.sql (DOWN)
ALTER TABLE users DROP COLUMN IF EXISTS phone;
```

## Корисні команди

```bash
# Переглянути всі таблиці
docker compose exec postgres psql -U postgres -d drivecost -c "\dt"

# Переглянути структуру таблиці
docker compose exec postgres psql -U postgres -d drivecost -c "\d users"

# Переглянути індекси
docker compose exec postgres psql -U postgres -d drivecost -c "\di"

# Виконати довільний SQL
docker compose exec postgres psql -U postgres -d drivecost -c "SELECT * FROM users LIMIT 5;"

# Підключитись інтерактивно
docker compose exec postgres psql -U postgres -d drivecost

# Переглянути логи PostgreSQL
docker compose logs postgres

# Переглянути логи в реальному часі
docker compose logs -f postgres
```

## Troubleshooting

### Міграція не виконується

**Проблема:** Файл не знайдено

```bash
ERROR: /docker-entrypoint-initdb.d/002_add_user_phone.sql: No such file or directory
```

**Рішення:** Перевірте що файл існує в `server/db/migrations/` і контейнер запущений.

### Помилка синтаксису SQL

**Проблема:** 
```
ERROR:  syntax error at or near "COLUMN"
```

**Рішення:** Перевірте SQL синтаксис, використовуйте `IF NOT EXISTS` для безпеки.

### Міграція виконалась частково

**Проблема:** Частина команд виконалась, частина ні.

**Рішення:** Використовуйте транзакції:

```sql
BEGIN;

ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN address TEXT;

COMMIT;
```

Якщо будь-яка команда впаде, всі зміни відкатяться.

## Production Deployment

Для продакшн середовища рекомендується:

1. **Використовувати migration tools:**
   - [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
   - [db-migrate](https://github.com/db-migrate/node-db-migrate)
   - [Flyway](https://flywaydb.org/)

2. **Автоматизувати через CI/CD:**
   ```bash
   # В CI/CD pipeline
   npm run migrate:up
   ```

3. **Зберігати історію міграцій:**
   Створіть таблицю `migrations` для tracking:
   ```sql
   CREATE TABLE migrations (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) UNIQUE NOT NULL,
     executed_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

Але для розробки достатньо просто виконувати SQL файли вручну через `psql`.
