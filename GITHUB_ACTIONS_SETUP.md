# GitHub Actions CI/CD Setup

Автоматичний деплой через GitHub Actions при push в `main` branch.

## Архітектура

```
GitHub Push → Build Docker Image → Push to GHCR → Deploy to Server
```

## Налаштування

### 1. Створи SSH ключ для деплою

На своєму комп'ютері:

```bash
# Генеруй новий SSH ключ
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Скопіюй публічний ключ
cat ~/.ssh/github_actions_deploy.pub
```

На сервері:

```bash
# Додай публічний ключ в authorized_keys
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys

# Перевір права доступу
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 2. Налаштуй GitHub Secrets

Перейди в GitHub: **Settings → Secrets and variables → Actions → New repository secret**

Додай наступні secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `SERVER_HOST` | IP адреса або домен сервера | `123.45.67.89` або `server.example.com` |
| `SERVER_USER` | SSH користувач | `root` або `ubuntu` |
| `SSH_PRIVATE_KEY` | Приватний SSH ключ | Вміст `~/.ssh/github_actions_deploy` |
| `SERVER_PORT` | SSH порт (опціонально) | `22` (default) |
| `DEPLOY_PATH` | Шлях до проекту на сервері | `/home/user/drive-cost` |

### 3. Налаштуй GitHub Container Registry

GitHub автоматично створить GHCR репозиторій при першому push.

Щоб зробити образ публічним (опціонально):

1. Перейди в **Packages** на GitHub
2. Знайди `drive-cost`
3. **Package settings → Change visibility → Public**

### 4. Налаштуй сервер

На сервері створи `.env.prod`:

```bash
cd /path/to/drive-cost

# Створи .env.prod
cp env.production.example .env.prod

# Відредагуй з реальними значеннями
nano .env.prod
```

Створи external network для nginx:

```bash
docker network create edge-net
```

### 5. Перший деплой

```bash
# Push в main branch
git add .
git commit -m "Setup GitHub Actions"
git push origin main

# GitHub Actions автоматично:
# 1. Збілдить Docker image
# 2. Push в ghcr.io/couldbefree/drive-cost:latest
# 3. Задеплоїть на сервер
```

## Workflow Details

### Build and Push Job

- Білдить Docker image з `Dockerfile` (target: production)
- Push в GitHub Container Registry
- Використовує GitHub Actions cache для швидкого білду
- Теги: `latest`, `main-{sha}`

### Deploy Job

- Підключається до сервера через SSH
- Pull останні зміни з git
- Pull Docker image з GHCR
- Restart app container
- Запускає міграції
- Очищає старі images

## Моніторинг деплою

### GitHub Actions

Перейди в **Actions** tab на GitHub:
- Подивись статус workflow
- Перевір логи кожного step
- Отримай notification при помилках

### На сервері

```bash
# Перевір статус контейнерів
docker compose ps

# Подивись логи
docker compose logs -f app

# Перевір які images
docker images | grep drive-cost
```

## Rollback

Якщо щось пішло не так:

```bash
# На сервері
cd /path/to/drive-cost

# Повернись до попередньої версії
git log --oneline  # знайди попередній commit
git checkout <previous-commit-hash>

# Pull попередній image
docker compose pull app

# Restart
docker compose up -d app
```

Або використай конкретний tag:

```bash
# В docker-compose.yml змінити:
image: ghcr.io/couldbefree/drive-cost:main-abc1234  # конкретний SHA

docker compose pull app
docker compose up -d app
```

## Локальна розробка

Для локальної розробки використовуй `docker-compose.dev.yml`:

```bash
# Запусти dev environment
docker compose -f docker-compose.dev.yml up

# Або без Docker
npm install
npm run dev
```

## Troubleshooting

### Build fails

```bash
# Перевір Dockerfile syntax
docker build -t test .

# Перевір GitHub Actions logs
```

### Deploy fails - SSH connection

```bash
# Перевір SSH ключ
ssh -i ~/.ssh/github_actions_deploy user@server

# Перевір SSH_PRIVATE_KEY secret
# Має включати:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ...
# -----END OPENSSH PRIVATE KEY-----
```

### Deploy fails - Docker pull

```bash
# На сервері login в GHCR
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Перевір чи image існує
docker pull ghcr.io/couldbefree/drive-cost:latest
```

### App не стартує після деплою

```bash
# Перевір логи
docker compose logs app

# Перевір .env.prod
cat .env.prod

# Перевір DATABASE_URL
docker compose exec app env | grep DATABASE_URL
```

## Manual Deploy (без GitHub Actions)

Якщо потрібно задеплоїти вручну:

```bash
# На сервері
cd /path/to/drive-cost

# Pull changes
git pull origin main

# Build locally
docker compose build app

# Restart
docker compose up -d app

# Migrations
docker compose run --rm migrate
```

## Security Best Practices

✅ **Використовуй SSH ключі** замість паролів
✅ **Обмеж SSH доступ** тільки для GitHub Actions IP
✅ **Rotate secrets** регулярно
✅ **Використовуй .env.prod** для sensitive data
✅ **Не commit .env.prod** в git
✅ **Enable 2FA** на GitHub
✅ **Review workflow logs** після кожного деплою

## Notifications (опціонально)

Додай Slack/Discord/Telegram notification:

```yaml
- name: Notify deployment
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

## Cost Optimization

GitHub Actions free tier:
- 2000 minutes/month для приватних репозиторіїв
- Unlimited для публічних

GHCR free tier:
- 500MB storage безкоштовно
- 1GB bandwidth/month

Оптимізація:
- Використовуй Docker layer caching
- Build тільки на push в main
- Cleanup старих images
